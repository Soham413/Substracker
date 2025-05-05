import { CLOUDINARY_CLOUD_API_KEY, CLOUDINARY_CLOUD_API_SECRET, CLOUDINARY_CLOUD_NAME, PORT } from './env.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_CLOUD_API_KEY,
    api_secret: CLOUDINARY_CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'subscriptions', // Optional folder name
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
})

export { cloudinary, storage };