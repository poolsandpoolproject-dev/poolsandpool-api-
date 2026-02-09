import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { uploadImageFromPath } from '#services/cloudinary_service'
import { ensureUniqueSlug, toTitleCase } from '#services/slug_service'
import {
  createCategoryValidator,
  reorderCategoriesValidator,
  setEnabledValidator,
  updateCategoryValidator,
} from '#validators/category_validator'

export default class CategoriesController {
  async index({ request, response }: HttpContext) {
    const includeDisabled = request.input('includeDisabled', true)
    const search = request.input('search')?.trim()
    const enabled = request.input('enabled')
    const page = Math.max(1, request.input('page', 1))
    const perPage = Math.min(100, Math.max(1, request.input('perPage', 20)))

    const query = Category.query().orderBy('order', 'asc').orderBy('created_at', 'desc')
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

    const result = await query.preload('sections').paginate(page, perPage)
    const data = result.all().map((c) => {
      const { sections: _s, ...rest } = c.serialize()
      return {
        ...rest,
        sectionsCount: c.sections.length,
        sectionNames: c.sections.map((s) => s.name),
      }
    })
    return response.ok({ data, meta: result.getMeta() })
  }

  async show({ params, response }: HttpContext) {
    const category = await Category.query().where('id', params.id).preload('sections').firstOrFail()
    const data = {
      ...category.serialize(),
      sectionsCount: category.sections.length,
      sectionNames: category.sections.map((s) => s.name),
    }
    return response.ok({ data })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCategoryValidator)

    const slug = await ensureUniqueSlug(payload.name, async (candidate) => {
      const found = await Category.findBy('slug', candidate)
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
      const uploaded = await uploadImageFromPath(image.tmpPath!, { folder: 'poolsandpool/categories' })
      imageUrl = uploaded.url
    }

    const nextOrder =
      payload.order ??
      ((await Category.query().max('order as max').first())?.$extras?.max ?? -1) + 1

    const category = await Category.create({
      name: toTitleCase(payload.name),
      slug,
      description: payload.description ?? null,
      imageUrl,
      order: nextOrder,
      enabled: payload.enabled ?? true,
    })

    return response.created({ data: category })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCategoryValidator)
    const category = await Category.findOrFail(params.id)

    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (image) {
      if (!image.isValid) {
        return response.unprocessableEntity({ message: image.errors[0]?.message ?? 'Invalid file' })
      }
      const uploaded = await uploadImageFromPath(image.tmpPath!, { folder: 'poolsandpool/categories' })
      category.imageUrl = uploaded.url
    }

    if (payload.name !== undefined) {
      category.name = toTitleCase(payload.name)
      category.slug = await ensureUniqueSlug(payload.name, async (candidate) => {
        const found = await Category.query()
          .where('slug', candidate)
          .whereNot('id', category.id)
          .first()
        return !!found
      })
    }
    if (payload.description !== undefined) category.description = payload.description ?? null
    if (payload.imageUrl !== undefined) category.imageUrl = payload.imageUrl ?? null
    if (payload.order !== undefined) category.order = payload.order
    if (payload.enabled !== undefined) category.enabled = payload.enabled

    await category.save()
    return response.ok({ data: category })
  }

  async reorder({ request, response }: HttpContext) {
    const { categoryIds } = await request.validateUsing(reorderCategoriesValidator)

    const rows = await Category.query().whereIn('id', categoryIds)
    if (rows.length !== categoryIds.length) {
      return response.badRequest({ message: 'Invalid category IDs' })
    }
    const rowById = new Map(rows.map((r) => [r.id, r]))

    await Category.transaction(async (trx) => {
      for (let i = 0; i < categoryIds.length; i++) {
        const id = categoryIds[i]
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
    const category = await Category.findOrFail(params.id)
    category.enabled = enabled
    await category.save()
    return response.ok({ data: { id: category.id, enabled: category.enabled } })
  }
}