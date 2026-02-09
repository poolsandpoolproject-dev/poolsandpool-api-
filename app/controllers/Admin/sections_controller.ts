import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import Section from '#models/section'
import { uploadImageFromPath } from '#services/cloudinary_service'
import { slimRelation } from '#services/relation_serializer'
import { ensureUniqueSlug, toTitleCase } from '#services/slug_service'
import {
  createSectionValidator,
  reorderSectionsValidator,
  setEnabledValidator,
  updateSectionValidator,
} from '#validators/section_validator'

export default class SectionsController {
  async index({ request, response }: HttpContext) {
    const includeDisabled = request.input('includeDisabled', true)
    const categoryId = request.input('categoryId')
    const search = request.input('search')?.trim()
    const enabled = request.input('enabled')
    const page = Math.max(1, request.input('page', 1))
    const perPage = Math.min(100, Math.max(1, request.input('perPage', 20)))

    const query = Section.query().orderBy('order', 'asc').orderBy('created_at', 'desc')

    if (categoryId) {
      query.where('category_id', categoryId)
    }

    if (!includeDisabled) {
      query.where('enabled', true)
    }

    if (enabled !== undefined) {
      query.where('enabled', enabled === true || enabled === 'true')
    }

    if (search) {
      const pattern = `%${search}%`
      query.where((q) => {
        q.whereILike('name', pattern).orWhereILike('description', pattern)
      })
    }

    const result = await query.preload('category').paginate(page, perPage)
    const data = result.all().map((s) => ({
      ...s.serialize(),
      category: slimRelation(s.category),
    }))
    return response.ok({ data, meta: result.getMeta() })
  }

  async show({ params, response }: HttpContext) {
    const section = await Section.query().where('id', params.id).preload('category').firstOrFail()
    const data = { ...section.serialize(), category: slimRelation(section.category) }
    return response.ok({ data })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createSectionValidator)

    await Category.findOrFail(payload.categoryId)

    const slug = await ensureUniqueSlug(payload.name, async (candidate) => {
      const found = await Section.query()
        .where('category_id', payload.categoryId)
        .where('slug', candidate)
        .first()
      return !!found
    })

    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    let imageUrl = payload.imageUrl ?? null
    if (image) {
      if (!image.isValid) {
        return response.unprocessableEntity({ message: image.errors[0]?.message ?? 'Invalid file' })
      }
      const uploaded = await uploadImageFromPath(image.tmpPath!, { folder: 'poolsandpool/sections' })
      imageUrl = uploaded.url
    }

    const nextOrder =
      payload.order ??
      ((await Section.query().where('category_id', payload.categoryId).max('order as max').first())?.$extras?.max ?? -1) + 1

    const section = await Section.create({
      categoryId: payload.categoryId,
      name: toTitleCase(payload.name),
      slug,
      description: payload.description ?? null,
      imageUrl,
      order: nextOrder,
      enabled: payload.enabled ?? true,
    })

    await section.load('category')
    const data = { ...section.serialize(), category: slimRelation(section.category) }
    return response.created({ data })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateSectionValidator)
    const section = await Section.findOrFail(params.id)

    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (image) {
      if (!image.isValid) {
        return response.unprocessableEntity({ message: image.errors[0]?.message ?? 'Invalid file' })
      }
      const uploaded = await uploadImageFromPath(image.tmpPath!, { folder: 'poolsandpool/sections' })
      section.imageUrl = uploaded.url
    }

    if (payload.categoryId !== undefined) {
      await Category.findOrFail(payload.categoryId)
      section.categoryId = payload.categoryId
    }
    if (payload.name !== undefined) {
      section.name = toTitleCase(payload.name)
      section.slug = await ensureUniqueSlug(payload.name, async (candidate) => {
        const found = await Section.query()
          .where('category_id', section.categoryId)
          .where('slug', candidate)
          .whereNot('id', section.id)
          .first()
        return !!found
      })
    }
    if (payload.description !== undefined) section.description = payload.description ?? null
    if (payload.imageUrl !== undefined) section.imageUrl = payload.imageUrl ?? null
    if (payload.order !== undefined) section.order = payload.order
    if (payload.enabled !== undefined) section.enabled = payload.enabled

    await section.save()
    await section.load('category')
    const data = { ...section.serialize(), category: slimRelation(section.category) }
    return response.ok({ data })
  }

  async reorder({ request, response }: HttpContext) {
    const { categoryId, sectionIds } = await request.validateUsing(reorderSectionsValidator)

    await Category.findOrFail(categoryId)

    const rows = await Section.query().where('category_id', categoryId).whereIn('id', sectionIds)
    if (rows.length !== sectionIds.length) {
      return response.badRequest({ message: 'Invalid section IDs' })
    }
    const rowById = new Map(rows.map((r) => [r.id, r]))

    await Section.transaction(async (trx) => {
      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i]
        const row = rowById.get(id)
        if (!row) continue
        row.useTransaction(trx)
        row.order = i + 1
        await row.save()
      }
    })

    return response.ok({ success: true })
  }

  async setEnabled({ params, request, response }: HttpContext) {
    const { enabled } = await request.validateUsing(setEnabledValidator)
    const section = await Section.findOrFail(params.id)
    section.enabled = enabled
    await section.save()
    return response.ok({ data: { id: section.id, enabled: section.enabled } })
  }
}