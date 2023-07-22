const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenvConfig from '../config/dotenv.config';
dotenvConfig();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
});

const removeInCloudinary = (file) => {
  cloudinary.uploader.destroy(file.filename);
}

const storageAvatar = new (CloudinaryStorage as any)({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'hospital-cloud-avatar',
  },
});

const storageTestResult = new (CloudinaryStorage as any)({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'hospital-cloud-testresult',
  },
});

const uploadAvatar = multer({ storage: storageAvatar });
const uploadTestResult = multer({ storage: storageTestResult });

export {
  removeInCloudinary,
  uploadAvatar,
  uploadTestResult
};