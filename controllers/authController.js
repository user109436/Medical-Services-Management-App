
const User = require('../models/Users/userModel');
const Physician = require('../models/Users/physicianModel');
const Student = require('../models/Users/studentModel');
const Staff = require('../models/Users/staffModel');

const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const Email = require('../utils/email');

//signToken
const signToken = user => {
    let id =user._id, role =user.role;
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
// createSendToken
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user);//encrypt & use id as a token
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), //10days
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    };
    res.cookie('jwt', token, cookieOptions);
    user.password = null;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
};
//verifyEmail
exports.verifyEmail = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        verificationToken: req.params.verificationToken,
        // verificationTokenExpires: { $gt: Date.now() }
        //convert iso to timestamp
    });
    const staff=['faculty', 'non-faculty'];
    if (!user) {
        return res.status(400).json({
            message: "Verification Link is Invalid or Expired"
        });
    }
    const verificationTokenExpires = new Date(user.verificationTokenExpires).getTime();
    if(!verificationTokenExpires>Date.now()){
        return res.status(400).json({
            message: "Verification Link is Invalid or Expired"
        });
    }
    let msg='';
    if(staff.includes(user.role)){
        user.active=false;
        user.verified=true;
        msg+='is Verified, Admin/Encoder will review your Account to activate';
    }else{
    user.verificationToken = '';
    user.verificationTokenExpires = '';
    user.verified = true;
    msg+='is Verified & Activated';
    }
    await user.save();
    return res.status(200).json({
        status:"success",
        message:`${user.email} ${msg}`
    });

});
//resendEmailVerification -applies only if emailVerificationToken is Already expired
exports.resendEmailVerification = catchAsync(async (req, res, next) => {
    //need email to resend email verification
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid Email or Does not Exist'
        })
    }
    user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    const role = user.role;
    // 1. Extract User Role
    const staffs = ['faculty', 'non-faculty', 'admin', 'encoder'];
    const physicians = ['nurse', 'dentist', 'doctor'];
    //2. Identify what type of User(Student/Staff) & Fetch the details
    let existingAccount = '';
    console.log(user);
    if (role.includes('student')) {
        existingAccount = await Student.findOne({ user_id: user._id });
    } else if (staffs.includes(role)) {
        existingAccount = await Staff.findOne({ user_id: user._id });
    }else if(physicians.includes(role)){
        existingAccount = await Physician.findOne({ user_id: user._id });
    }
    console.log(existingAccount);
    if (!existingAccount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Account Info Does not Exist',
        })
    }
    const emailUser = {
        name: `${existingAccount.name.firstname} ${existingAccount.name.lastname}`,
        email: user.email
    }
    let url, host;
    if(process.env.NODE_ENV==='production'){
        host = process.env.PRODUCTION_HOST;
    }else{
        host = process.env.DEVELOPMENT_HOST;
    }
    url = `${req.protocol}://${host}sign-up/account/verify/${user.verificationToken}`;
    await new Email(emailUser, url).sendEmailVerification();
    res.status(200).json({
        status: 'success',
        message: `Account Verification resent to ${user.email} (expires in 50 minutes)`
    });
});
//sign-up
exports.signup = catchAsync(async (req, res, next) => {
    const user = { ...req.body };
    const role = user.role;
    const invalidRole = role.includes('doctor') || role.includes('nurse') || role.includes('dentist') || role.includes('encoder') || role.includes('admin') || role.includes('system');
    if (invalidRole) {
        return res.status(200).json({
            status: 'fail',
            message: 'Invalid Role For Account'
        })
    }
    const newUser = await User.create({
        name:user.name,
        photo:user?.photo,
        email: user.email,
        password: user.password,
        role: user.role
    });
    newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });
    // 1. Extract User Role
    const staff = role.includes('faculty') || role.includes('non-faculty');
    //2. Identify what type of User(Student/Staff) & Create the new account
    let newAccount = '';
    if (role.includes('student')) {
        newAccount = await Student.create({
            ...req.body,
            user_id: newUser._id
        });
    } else if (staff) {
        newAccount = await Staff.create({
            ...req.body,
            user_id: newUser._id
        });
    }
    //
    const emailUser = {
        name: `${user.name.firstname} ${user.name.lastname}`,
        email: user.email
    }
    let url, host;
    if(process.env.NODE_ENV==='production'){
        host = process.env.PRODUCTION_HOST;
    }else{
        host = process.env.DEVELOPMENT_HOST;
    }
    url = `${req.protocol}://${host}sign-up/account/verify/${newUser.verificationToken}`;
    await new Email(emailUser, url).sendEmailVerification();
    res.status(200).json({
        status: 'success',
        message: `Account Verification Sent to ${user.email} (expires in 50 minutes)`,
        user_id:newUser._id //we return user_id here, we will need it in mobile to update photo
    });
});
//login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Please, provide email & password'
        });
    }
    const user = await User.findOne({ email }).select('+password')  ;

    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        });
    }
    if(!user.active){
        return res.status(401).json({
            message: 'Account is not Activated, Please contact Admin if this is a mistake'
        });
    }
    createSendToken(user, 200, req, res);


});
//logout
exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),//10sec
        httpOnly: true
    });
    res.status(200).json({ status: "success" });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({
            message: "Email doesn't exist"
        });
    }
    const newPassword =user.createNewPassword();
    await user.save({ validateBeforeSave: false });
    try {
        const role = user.role;
        // 1. Extract User Role
        const staff = role.includes('faculty') || role.includes('non-faculty');
        //2. Identify what type of User(Student/Staff) & Fetch the details
        let existingAccount = '';
        if (role.includes('student')) {
            existingAccount = await Student.findOne({ user_id: user._id });
        } else if (staff) {
            existingAccount = await Staff.findOne({ user_id: user._id });
        }
        if (!existingAccount) {
            return res.status(200).json({
                status: 'success',
                message: 'Account Info Does not Exist',
            })
        }
        const emailUser = {
            name: `${existingAccount.name.firstname} ${existingAccount.name.lastname}`,
            email: user.email
        }
        await new Email(emailUser, newPassword).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: `New Password Sent to ${user.email}`
        });
    } catch (err) {
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: "There was an error sending the email.Please try again later" })
    }
});

//update-password
exports.updatePassword = catchAsync(async (req, res, next) => {
    const { passwordCurrent, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !await user.correctPassword(passwordCurrent, user.password)) {
        return res.status(200).json({
            message: "Invalid Password"
        });
    }
    user.password = password;
    await user.save();
    createSendToken(user, 200, req, res);
});

//PROTECTING ROUTES
exports.protect = catchAsync(async (req, res, next) => {
    // console.log(req.headers);
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        //TODO:redirect to homepage/login page
        return res.status(401).json({
            message: 'You are not logged In'
        });
    }
    const decoded = await (promisify(jwt.verify)(token, process.env.JWT_SECRET));
    const user = await User.findById(decoded.id);

    if (!user) {
        //TODO:redirect to homepage/login page
        return res.status(401).json({
            message: 'Token expired'
        })
    }
    req.user = user;
    res.locals.user = user;
    next();
});

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await (promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));
            const user = await User.findById(decoded.id);
            if (!user) {
                return next();
            }
            res.locals.user = user;
        } catch (err) {
            return next();
        }
    }
    next();
}

exports.allowedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    }
}


