import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRY, ARCJET_KEY, ARCJET_ENV, CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_API_KEY, CLOUDINARY_CLOUD_API_SECRET } = process.env;