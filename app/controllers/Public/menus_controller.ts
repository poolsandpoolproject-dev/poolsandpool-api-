import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { getTemporaryPriceStatus } from '#services/temporary_price_status'
import { isValidUuid } from '#services/uuid'
import { DateTime } from 'luxon'

export default class MenusController {
  async categoriesIndex({ response }: HttpContext) {
    const list = await Category.query()
      .where('enabled', true)
      .orderBy('order', 'asc')
      .orderBy('created_at', 'desc')

    const data = list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      order: c.order,
    }))
    return response.ok({ data })
  }

  async categoriesShow({ params, response }: HttpContext) {
    const idOrSlug = (typeof params.id === 'string' ? params.id.trim() : '') || ''
    const byId = isValidUuid(idOrSlug)
    const query = Category.query().where('enabled', true)
    if (byId) {
      query.where('id', idOrSlug)
    } else {
      query.where('slug', idOrSlug)
    }

    const category = await query
      .preload('sections', (q) =>
        q
          .where('enabled', true)
          .orderBy('order', 'asc')
          .orderBy('created_at', 'desc')
          .preload('menuItems', (mq) =>
            mq.where('enabled', true).orderBy('created_at', 'desc').preload('temporaryPrices')
          )
      )
      .first()

    if (!category) {
      return response.notFound({ message: 'Category not found' })
    }

    const now = DateTime.now()
    const sections = category.sections.map((section) => ({
      id: section.id,
      name: section.name,
      slug: section.slug,
      description: section.description,
      imageUrl: section.imageUrl,
      order: section.order,
      menuItems: section.menuItems.map((mi) => {
        const activePrice = mi.temporaryPrices
          .filter((tp) => tp.enabled && getTemporaryPriceStatus(tp.startAt, tp.endAt, now) === 'ACTIVE')
          .sort((a, b) => b.startAt.toMillis() - a.startAt.toMillis())[0]
        const effectivePrice = activePrice ? activePrice.price : mi.basePrice
        return {
          id: mi.id,
          name: mi.name,
          slug: mi.slug,
          description: mi.description,
          basePrice: mi.basePrice,
          effectivePrice,
          imageUrl: mi.imageUrl,
          available: mi.available,
        }
      }),
    }))

    const data = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      order: category.order,
      sections,
    }
    return response.ok({ data })
  }
}
