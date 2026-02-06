import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'

type UploadResult = {
  url: string
  publicId: string
  format: string
  width: number
  height: number
}

function ensureConfigured() {
  const cloudName = env.get('CLOUDINARY_CLOUD_NAME')
  const apiKey = env.get('CLOUDINARY_API_KEY')
  const apiSecret = env.get('CLOUDINARY_API_SECRET')

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

export async function uploadImageFromPath(
  filePath: string,
  options?: { folder?: string }
): Promise<UploadResult> {
  ensureConfigured()

  const res = await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder: options?.folder,
  })

  return {
    url: res.secure_url,
    publicId: res.public_id,
    format: res.format,
    width: res.width,
    height: res.height,
  }
}

