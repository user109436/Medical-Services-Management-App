const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  };
  const handleDuplicateFieldsDB = (err) => {
    let sanitized = JSON.stringify(err.keyValue);
    sanitized = sanitized.replace(/["\/{}]/gim, "");
    const message = `Duplicate field value/Already Exist: ${sanitized}`;
    return new AppError(message, 400);
  };
  const handleValidationErrorDB =(err)=>{
    const errors = Object.values(err.errors).map(el=>el.message);
    const message=`Invalid input: ${errors.join('. ')}`;
    return new AppError(message, 400);
  }
  const handleJWTError=()=>new AppError('Invalid token, Please login again', 401);
  const handleExpiredJWTError=()=>  new AppError('Token Expired, Please log in again', 401);
  const handleS3BucketError=()=>  new AppError('Access to resource is denied', 401);
  const handleMulterError =(err)=>{
    if(err.code==="LIMIT_FILE_SIZE"){
      return new AppError('Maximum File Size of 3MB', 401);
    }
    if(err.code==="LIMIT_UNEXPECTED_FILE"){
      return new AppError('Max of 10 Photos', 401);
    }
  }
  const sendErrorProd = (err, req, res) => {
    //API
    if(req.originalUrl.startsWith('/api')){
  
      //Operational, trusted error: send message to client
      if (err.isOperational) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          stack:err.stack,
        });
      }
      //Programming or other unknown error :don't leak details
        //1. Log error
        console.error('ERROR:', err);
  
        //2. Send generic message
        return res.status(500).json({
          status: 'error',
          message: 'Something went very wrong',
        });
  }
    //RENDERED WEB APP
    //Operational, trusted error: send message to client
    if (err.isOperational) {
      console.log(err);
      return res.status(err.statusCode).json({
        title: 'Something went wrong!',
        message: err.message
      });
    }
    //Programming or other unknown error :don't leak details
      //1. Log error
      console.error('ERROR:', err);
  
      //2. Send generic message
      return res.status(err.statusCode).json({
        title:'Something went wrong!',
        message:'Please try again later'
      })
  };
module.exports = async(err, req, res, next) => {
    err.statusCode = err.statusCode || 500; //500-internal server error
    err.status = err.status || 'error';
      let error = JSON.parse(JSON.stringify(err)); //{...err} did not work in this case, i don't why but it definitely should work
      error.message = err.message;
      if (error.name === 'CastError') error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if(error.name ==='ValidationError') error = handleValidationErrorDB(error);
      if(error.name === 'JsonWebTokenError') error=handleJWTError(error);
      if(error.name ==='TokenExpiredError') error =handleExpiredJWTError();
      if(error.name ==='MulterError') error =handleMulterError(error);
      if(error.code==='AccessDenied') error =handleS3BucketError(error); //FIXME:doesn't catch the access denied
  
      sendErrorProd(error, req, res);

  };