import type { HttpContext } from '@adonisjs/core/http'
import MenuItem from '#models/menu_item'
import { slimRelation } from '#services/relation_serializer'

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
}
