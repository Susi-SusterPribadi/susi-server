const AWS = require('aws-sdk')

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
        let arrResult = []
        let hasilAkhir = []
        data.TextDetections.map(obat => {
          arrResult.push(obat.DetectedText)
        })

        arrResult.splice(1, 4).map(obatSplit => {
          hasilAkhir.push(obatSplit.split(': ')[1])
        })

        res.status(200).json({
          info: "Data detect text success",
          data: hasilAkhir
        })

        console.log('<============== hasil recognition ========> ')
        console.log(hasilAkhir)
      }
    });
  }
}