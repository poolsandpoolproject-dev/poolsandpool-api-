import type { HttpContext } from '@adonisjs/core/http'
import { uploadImageFromPath } from '#services/cloudinary_service'

export default class UploadsController {
  async image({ request, response }: HttpContext) {
    const file = request.file('file', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!file) {
      return response.badRequest({ message: 'Missing file' })
    }

    if (!file.isValid) {
      return response.unprocessableEntity({ message: file.errors[0]?.message ?? 'Invalid file' })
    }

    try {
      const result = await uploadImageFromPath(file.tmpPath!, { folder: 'poolsandpool' })
      return response.created({ data: result })
    } catch {
      return response.internalServerError({ message: 'Upload failed' })
    }
  }
}

