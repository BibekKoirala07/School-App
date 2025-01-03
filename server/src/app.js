const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });

const {
  GetObjectCommand,
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const envPath = path.resolve(__dirname, "./config/.env");

fs.access(envPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error("Error: .env file not found or inaccessible at", envPath);
  } else {
    console.log("Success");
  }
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV == "production"
        ? process.env.PROD_FRONTEND_URL
        : process.env.DEV_FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-amz-acl", "Authorization"],
    exposedHeaders: ["ETag"],
  })
);

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.get("/health", (req, res) => {
  return res.status(200).send({ message: "Server is running" });
});

app.get("/test", (req, res) => {
  return res.status(200).send({ message: "Server is running" });
});

async function getPresignedUrl(fileName) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

async function putObject(fileName, contentType) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `/${fileName}`,
    ContentType: contentType,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

app.get("/get-credentails", (req, res) => {
  return res.status(200).json({
    data: {
      accessKeyId,
      env:
        process.env.NODE_ENV == "production"
          ? process.env.PROD_FRONTEND_URL
          : process.env.DEV_FRONTEND_URL,
      secretAccessKey,
      bucketName,
      region,
    },
  });
});

app.get("/api/get-all-images", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const data = await s3Client.send(command);

    const files = data.Contents.map((item) => ({
      name: item.Key,
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
    }));

    res.json({ data: files });
  } catch (err) {
    console.error("Error listing objects", err);
    res.status(500).json({ message: "Could not list objects." });
  }
});

app.post("/api/generate-presigned-url", async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res
      .status(400)
      .json({ message: "File name and file type are required." });
  }

  try {
    const url = await putObject(fileName, fileType);

    console.log("url", url);
    res.json({ url });
  } catch (err) {
    console.error("Error generating pre-signed URL", err);
    res.status(500).json({ message: "Could not generate pre-signed URL." });
  }
});

module.exports = app;
