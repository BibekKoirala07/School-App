const express = require("express");
const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });

const app = express();
app.use(express.json());
app.use(cors());

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
});

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/health", (req, res) => {
  return res.send("Server is running");
});

app.get("/test", (req, res) => {
  return res.send("Server is running");
});

app.get("/api/get-all-images", (req, res) => {
  const params = {
    Bucket: bucketName,
  };

  s3.listObjectsV2(params, (err, data) => {
    console.log("data", data);
    if (err) {
      console.error("Error listing objects", err);
      return res.status(500).json({ message: "Could not list objects." });
    }

    const files = data.Contents.map((item) => {
      return {
        name: item.Key,
        url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`,
        size: item.Size,
        lastModified: item.LastModified,
      };
    });
    return res.json({ data: files });
  });
});

app.post("/api/generate-presigned-url", (req, res) => {
  const { fileName, fileType } = req.body;

  console.log("fileName, fileType", fileName, fileType);

  if (!fileName || !fileType) {
    return res
      .status(400)
      .json({ message: "File name and file type are required." });
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
    Expires: 300,
  };

  s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      console.error("Error generating pre-signed URL", err);
      return res
        .status(500)
        .json({ message: "Could not generate pre-signed URL." });
    }

    console.log("url", url);
    res.json({ url });
  });
});

module.exports = app;
