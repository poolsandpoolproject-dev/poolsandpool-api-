import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import MenuItem from '#models/menu_item'
import TemporaryPrice from '#models/temporary_price'
import { getTemporaryPriceStatus } from '#services/temporary_price_status'
import {
  createTemporaryPriceValidator,
  updateTemporaryPriceValidator,
  setEnabledValidator,
} from '#validators/temporary_price_validator'

function serializeWithStatus(tp: TemporaryPrice) {
  const status = getTemporaryPriceStatus(tp.startAt, tp.endAt)
  return { ...tp.serialize(), status }
}

export default class TemporaryPricesController {
  async index({ params, response }: HttpContext) {
    const menuItem = await MenuItem.find(params.menuItemId)
    if (!menuItem) {
      return response.notFound({ message: 'Menu item not found' })
    }
    const list = await TemporaryPrice.query()
      .where('menu_item_id', menuItem.id)
      .orderBy('start_at', 'desc')

    const data = list.map((tp) => serializeWithStatus(tp))
    return response.ok({ data })
  }

  async store({ params, request, response }: HttpContext) {
    const menuItem = await MenuItem.find(params.menuItemId)
    if (!menuItem) {
      return response.notFound({ message: 'Menu item not found' })
    }
    const payload = await request.validateUsing(createTemporaryPriceValidator)

    const temporaryPrice = await TemporaryPrice.create({
      menuItemId: menuItem.id,
      ruleName: payload.ruleName,
      price: String(payload.price),
      startAt: DateTime.fromJSDate(payload.startAt),
      endAt: DateTime.fromJSDate(payload.endAt),
      enabled: payload.enabled ?? true,
    })

    const data = serializeWithStatus(temporaryPrice)
    return response.created({ data })
  }

  async update({ params, request, response }: HttpContext) {
    const temporaryPrice = await TemporaryPrice.query()
      .where('menu_item_id', params.menuItemId)
      .where('id', params.id)
      .first()
    if (!temporaryPrice) {
      return response.notFound({ message: 'Temporary price not found' })
    }

    const payload = await request.validateUsing(updateTemporaryPriceValidator)

    if (payload.ruleName !== undefined) temporaryPrice.ruleName = payload.ruleName
    if (payload.price !== undefined) temporaryPrice.price = String(payload.price)
    if (payload.startAt !== undefined) temporaryPrice.startAt = DateTime.fromJSDate(payload.startAt)
    if (payload.endAt !== undefined) temporaryPrice.endAt = DateTime.fromJSDate(payload.endAt)
    if (payload.enabled !== undefined) temporaryPrice.enabled = payload.enabled

    await temporaryPrice.save()
    const data = serializeWithStatus(temporaryPrice)
    return response.ok({ data })
  }

  async setEnabled({ params, request, response }: HttpContext) {
    const temporaryPrice = await TemporaryPrice.query()
      .where('menu_item_id', params.menuItemId)
      .where('id', params.id)
      .first()
    if (!temporaryPrice) {
      return response.notFound({ message: 'Temporary price not found' })
    }

    const { enabled } = await request.validateUsing(setEnabledValidator)
    temporaryPrice.enabled = enabled
    await temporaryPrice.save()
    return response.ok({ data: { id: temporaryPrice.id, enabled: temporaryPrice.enabled } })
  }

  async duplicate({ params, response }: HttpContext) {
    const original = await TemporaryPrice.query()
      .where('menu_item_id', params.menuItemId)
      .where('id', params.id)
      .first()
    if (!original) {
      return response.notFound({ message: 'Temporary price not found' })
    }

    const copy = await TemporaryPrice.create({
      menuItemId: original.menuItemId,
      ruleName: `${original.ruleName} (Copy)`,
      price: original.price,
      startAt: original.startAt,
      endAt: original.endAt,
      enabled: false,
    })

    const data = serializeWithStatus(copy)
    return response.created({ data })
  }

  async destroy({ params, response }: HttpContext) {
    const temporaryPrice = await TemporaryPrice.query()
      .where('menu_item_id', params.menuItemId)
      .where('id', params.id)
      .first()
    if (!temporaryPrice) {
      return response.notFound({ message: 'Temporary price not found' })
    }

    await temporaryPrice.delete()
    return response.ok({ success: true })
  }
}
