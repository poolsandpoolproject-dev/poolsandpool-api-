import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { isValidUuid } from '#services/uuid'

export default class ValidateUuidParamsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const params = ctx.params
    if (params.id !== undefined && !isValidUuid(params.id)) {
      return ctx.response.badRequest({ message: 'Invalid ID' })
    }
    if (params.menuItemId !== undefined && !isValidUuid(params.menuItemId)) {
      return ctx.response.badRequest({ message: 'Invalid menu item ID' })
    }
    return next()
  }
}
