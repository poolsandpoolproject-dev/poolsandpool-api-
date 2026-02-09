import type { HttpContext } from '@adonisjs/core/http'
import MenuItem from '#models/menu_item'
import Section from '#models/section'
import { uploadImageFromPath } from '#services/cloudinary_service'
import { slimRelation } from '#services/relation_serializer'
import { ensureUniqueSlug, toTitleCase } from '#services/slug_service'
import {
  createMenuItemValidator,
  updateMenuItemValidator,
  setAvailabilityValidator,
  setEnabledValidator,
} from '#validators/menu_item_validator'

export default class MenuItemsController {
  async index({ request, response }: HttpContext) {
    const includeDisabled = request.input('includeDisabled', true)
    const categoryId = request.input('categoryId')
    const sectionId = request.input('sectionId')
    const search = request.input('search')?.trim()
    const available = request.input('available')
    const enabled = request.input('enabled')
    const page = Math.max(1, request.input('page', 1))
    const perPage = Math.min(100, Math.max(1, request.input('perPage', 20)))

    const query = MenuItem.query()
      .orderBy('created_at', 'desc')
      .preload('section')
      .preload('category')

    if (categoryId) query.where('category_id', categoryId)
    if (sectionId) query.where('section_id', sectionId)
    if (!includeDisabled) query.where('enabled', true)
    if (available !== undefined) {
      query.where('available', available === true || available === 'true')
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

    const result = await query.paginate(page, perPage)
    const data = result.all().map((mi) => ({
      ...mi.serialize(),
      section: slimRelation(mi.section),
      category: slimRelation(mi.category),
    }))
    return response.ok({ data, meta: result.getMeta() })
  }

  async show({ params, response }: HttpContext) {
    const menuItem = await MenuItem.query()
      .where('id', params.id)
      .preload('section')
      .preload('category')
      .firstOrFail()
    const data = {
      ...menuItem.serialize(),
      section: slimRelation(menuItem.section),
      category: slimRelation(menuItem.category),
    }
    return response.ok({ data })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createMenuItemValidator)

    const section = await Section.query()
      .where('id', payload.sectionId)
      .where('category_id', payload.categoryId)
      .firstOrFail()

    const slug = await ensureUniqueSlug(payload.name, async (candidate) => {
      const found = await MenuItem.query()
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
      const uploaded = await uploadImageFromPath(image.tmpPath!, { folder: 'poolsandpool/menu-items' })
      imageUrl = uploaded.url
    }

    const menuItem = await MenuItem.create({
      categoryId: payload.categoryId,
      sectionId: section.id,
      name: toTitleCase(payload.name),
      slug,
      description: payload.description ?? null,
      basePrice: String(payload.basePrice),
      imageUrl,
      available: payload.available ?? true,
      enabled: payload.enabled ?? true,
    })

    await menuItem.load('section')
    await menuItem.load('category')
    const data = {
      ...menuItem.serialize(),
      section: slimRelation(menuItem.section),
      category: slimRelation(menuItem.category),
    }
    return response.created({ data })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateMenuItemValidator)
    const menuItem = await MenuItem.findOrFail(params.id)

    if (payload.categoryId !== undefined || payload.sectionId !== undefined) {
      const categoryId = payload.categoryId ?? menuItem.categoryId
      const sectionId = payload.sectionId ?? menuItem.sectionId
      await Section.query().where('id', sectionId).where('category_id', categoryId).firstOrFail()
      if (payload.categoryId !== undefined) menuItem.categoryId = payload.categoryId
      if (payload.sectionId !== undefined) menuItem.sectionId = payload.sectionId
    }

    const image = request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (image) {
      if (!image.isValid) {
        return response.unprocessableEntity({ message: image.errors[0]?.message ?? 'Invalid file' })
      }
      const uploaded = await uploadImageFromPath(image.tmpPath!, { folder: 'poolsandpool/menu-items' })
      menuItem.imageUrl = uploaded.url
    }

    if (payload.name !== undefined) {
      menuItem.name = toTitleCase(payload.name)
      menuItem.slug = await ensureUniqueSlug(payload.name, async (candidate) => {
        const found = await MenuItem.query()
          .where('category_id', menuItem.categoryId)
          .where('slug', candidate)
          .whereNot('id', menuItem.id)
          .first()
        return !!found
      })
    }
    if (payload.description !== undefined) menuItem.description = payload.description ?? null
    if (payload.basePrice !== undefined) menuItem.basePrice = String(payload.basePrice)
    if (payload.imageUrl !== undefined) menuItem.imageUrl = payload.imageUrl ?? null
    if (payload.available !== undefined) menuItem.available = payload.available
    if (payload.enabled !== undefined) menuItem.enabled = payload.enabled

    await menuItem.save()
    await menuItem.load('section')
    await menuItem.load('category')
    const data = {
      ...menuItem.serialize(),
      section: slimRelation(menuItem.section),
      category: slimRelation(menuItem.category),
    }
    return response.ok({ data })
  }

  async setAvailability({ params, request, response }: HttpContext) {
    const { available } = await request.validateUsing(setAvailabilityValidator)
    const menuItem = await MenuItem.findOrFail(params.id)
    menuItem.available = available
    await menuItem.save()
    return response.ok({ data: { id: menuItem.id, available: menuItem.available } })
  }

  async setEnabled({ params, request, response }: HttpContext) {
    const { enabled } = await request.validateUsing(setEnabledValidator)
    const menuItem = await MenuItem.findOrFail(params.id)
    menuItem.enabled = enabled
    await menuItem.save()
    return response.ok({ data: { id: menuItem.id, enabled: menuItem.enabled } })
  }

  async destroy({ params, response }: HttpContext) {
    const menuItem = await MenuItem.findOrFail(params.id)
    await menuItem.delete()
    return response.ok({ success: true })
  }
}
