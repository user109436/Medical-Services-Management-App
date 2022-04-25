require('dotenv').config({ path: '../config.env' })
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3');
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
  // const fileStream = fs.createReadStream(file.path)
  const fileStream=file.buffer;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
async function getFileStream(fileKey) {
try{

  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  const client = new S3Client({
  region,
  credentials:{
  accessKeyId,
  secretAccessKey
  }
})
const command = new HeadObjectCommand(downloadParams);
const response = await client.send(command);
// console.log('response:',response); //if there a response that means image exist
return s3.getObject(downloadParams).createReadStream()

}catch(e){
    console.log('file does not exist:', e);
    const brokenImage = fs.createReadStream('client/public/assets/img/broken-image.png');
    return brokenImage;
}
}
exports.getFileStream = getFileStream