const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multerStorage = multer.memoryStorage();
const { uploadFile, getFileStream } = require('./s3Controller');

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an Image! Please upload only images.', 400), false)
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 3 * 1024 * 1024 } //3MB
});
exports.formatUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.params.id}-${Date.now()}.jpeg`; //to be accessible in other middlewares?
    
    await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 80 });
        // .toFile(`client/public/assets/img/${req.file.filename}`); 
        //- we will save our file to AWS server (s3 bucket)

    //uploadFile to s3 bucket
    await uploadFile(req.file);

    next();
});

exports.uploadUserPhoto = upload.single('photo');

//will fetch img from AWS S3 Bucket
exports.getFileFromAWS=catchAsync(async(req, res, next)=>{
  const key = req.params.key
  const readStream = await getFileStream(key)
  console.log('fetch img from s3 bucket')
  return readStream.pipe(res)
  next();
});
