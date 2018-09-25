const AWS = require('aws-sdk');

const { createPrescription } = require('./prescription');

const rekognition = new AWS.Rekognition({
  apiVersion: '2016-06-27',
  region: process.env.REGION,
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET
});

module.exports = {
  textRecognition: (req, res) => {
    const { key, VersionId } = req.dataUpload;
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
        res.status(500).json({
          errMessage: err
        });
      } else {
        let arrResult = [];
        let hasilAkhir = [];
        data.TextDetections.map(obat => {
          arrResult.push(obat.DetectedText);
        });

        arrResult.splice(1, 5).map(obatSplit => {
          hasilAkhir.push(obatSplit.split(': ')[1]);
        });

        console.log('<============== hasil recognition ========> ');
        console.log(hasilAkhir);

        const result = {
          userId: req.userId,
          label: hasilAkhir[0],
          times: hasilAkhir[1] && hasilAkhir[1].split('X')[0] * 1,
          route: hasilAkhir[2],
          stock: hasilAkhir[3],
          expDate: hasilAkhir[4]
        };
        console.log('data ==>', result);

        createPrescription(result, null)
          .then(prescriptionSchedule => {
            console.log('success', prescriptionSchedule);
            res.status(200).json(prescriptionSchedule);
          })
          .catch(err => {
            console.log('failed', err);
            res.status(400).json('Failed to process image');
          });
      }
    });
  }
};
