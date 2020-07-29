import multer from "multer";
import path from "path";
import crypto from "crypto";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

const bucketName = process.env.AWS_BUCKET || "ecoletauploads/uploads";

const storageTypes = {
  local: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),
    filename(request, file, cb) {
      const hash = crypto.randomBytes(6).toString("hex");
      const filename = `${hash}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(6, (err, hash) => {
        if (err) cb(err);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        file.filename = fileName;
        cb(null, fileName);
      });
    },
  }),
};

const storageType =
  process.env.STORAGE_TYPE === "local"
    ? storageTypes["local"]
    : storageTypes["s3"];

const config: multer.Options = {
  dest: path.resolve(__dirname, "..", "..", "uploads"),
  storage: storageType,
  limits: {
    fileSize: 2 * 1024 * 1024, //limite de 2Mb
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};

export default config;
