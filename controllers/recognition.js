const AWS = require('aws-sdk')
const Busboy = require('busboy')

const rekognition = new AWS.Rekognition({
  apiVersion: "2016-06-27",
  region: process.env.REGION,
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
});

module.exports = {
  textRecognition: (req, res) => {
    const { key, VersionId } = req.dataUpload
    let params = {
      Image: {
        S3Object: {
          Bucket: process.env.BUCKET_S3,
          Name: key,
          Version: VersionId
        }
      }
    };

    rekognition.detectText(params, (err, data) => {
      if (err) {
        res
          .status(500)
          .json({
            errMessage: err
          })
      } else {
        res
          .status(200)
          .json({
            info: 'Detect Text Success',
            data: data
          })
        console.log('result recognition ==>',data)
      }
    });
  }
}