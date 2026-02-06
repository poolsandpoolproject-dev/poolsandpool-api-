import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type RequireRoleOptions = {
  roles: string[]
}

export default class RequireRoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: RequireRoleOptions) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }

    const roles = Array.isArray(options?.roles) ? options.roles : []
    if (!roles.includes((user as any).role)) {
      return ctx.response.forbidden({ message: 'Forbidden' })
    }

    return next()
  }
}
