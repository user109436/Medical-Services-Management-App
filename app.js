const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controllers/errorController');
dotenv.config({
  path: './config.env',
});
//Todo: for deployment
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
// const DB  =process.env.DATABASE_LOCAL;
mongoose.connect(DB).then(() => console.log('DB Connected Successfully')).catch(err => console.log(err));

//routers
//Authentication
const authRouter = require('./routers/authRouter');
//Independent Collections Router
const yearRouter = require('./routers/yearRouter');
const sectionRouter = require('./routers/sectionRouter');
const courseRouter = require('./routers/courseRouter');
const departmentRouter = require('./routers/departmentRouter');
const logRouter = require('./routers/logRouter');

//Users
const userRouter = require('./routers/userRouter');
const studentRouter = require('./routers/studentRouter');
const staffRouter = require('./routers/staffRouter');
const physicianRouter = require('./routers/physicianRouter');

// Medicals
const medicalRecordRouter = require('./routers/medicalRecordRouter');
const medicineRouter = require('./routers/medicineRouter');
//Chats
const chatRouter = require('./routers/chatRouter');

//Img
const imgRouter = require('./routers/imgRouter');

const app = express();
console.log(`App NODE_ENV=${process.env.NODE_ENV}`);
app.use((req, res, next) => {
  console.log(`App NODE_ENV=${process.env.NODE_ENV}`);
  next();
});
app.enable('trust proxy');
const corsOptions = {
  origin: '*',
  methods: "GET,POST,DELETE,UPDATE,PUT,PATCH, OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'", 'http://localhost:3003', 'http://localhost:3001'],
    },
  })
);
const limiter = rateLimit({ //this will slows down dictionary attacks and brute force
    max: 100,
    windowMs: 60 * 60 * 1000, //1hr
    message: 'Too many request from this IP, please try again in an hour'
});
app.use('/api/account/login', limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
// TODO: list later the ssallowed parameters to the url
app.use(hpp({
  whitelist: []
}))
app.use(compression());

//API ROUTES
//Authentication
app.use('/api/account', authRouter);

//Independent Collections
app.use('/api/years', yearRouter);
app.use('/api/sections', sectionRouter);
app.use('/api/courses', courseRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/logs', logRouter);

//Users
app.use('/api/users', userRouter);
app.use('/api/students', studentRouter);
app.use('/api/staffs', staffRouter);
app.use('/api/physicians', physicianRouter);


// Medicals
app.use('/api/medicines', medicineRouter);
app.use('/api/medical-records', medicalRecordRouter);

// Chats
app.use('/api/chats', chatRouter);

//Img
app.use('/api/images', imgRouter);
// app.use('*', (req, res, next) => {
//     res.status(404).json({
//         status: `Page Not Found ${req.originalUrl}`
//     });
//     next();
// })

//STATIC FILES SERVING
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.use(express.static('client/public'));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
  });
}
app.use(globalErrorHandler);


module.exports = app;