class AppError extends Error{
    constructor(message, statusCode){
        super(message); //call the parent constructor and pass the default parameter of message of the parent class
        this.statusCode = statusCode;
        this.status=`${statusCode}`.startsWith('4') ? 'fail':'error';
        this.isOperational=true;

        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports=AppError;