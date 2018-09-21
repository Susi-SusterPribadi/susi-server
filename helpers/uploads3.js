const AWS = require('aws-sdk')
const Busboy = require('busboy')

module.exports = {
  uploadS3: (req, res, next) => {
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
      Bucket: process.env.BUCKET_S3
    });

    const busboy = new Busboy({ headers: req.headers })
    busboy.on('finish', () => {
      const file = req.files.element1
      s3bucket.createBucket(() => {
        var params = {
          Bucket: process.env.BUCKET_S3,
          Key: file.name,
          Body: file.data
        };
        s3bucket.upload(params, (err, data) => {
          if (err) {
            console.log("Error upload", err);
          } else {
            console.log("Success", data);
            console.log("Version" , data.VersionId)
            req.dataUpload = data
            next()
          }
        });
      });
      console.log('Upload success')
    })
    req.pipe(busboy)
  }
}