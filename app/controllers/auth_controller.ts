import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/login_validator'

export default class AuthController {
  private getDisplayName(user: User) {
    const first = user.firstName?.trim() || ''
    const last = user.lastName?.trim() || ''
    const name = `${first} ${last}`.trim()
    return name.length ? name : null
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    let user: User
    try {
      user = await User.verifyCredentials(email.trim().toLowerCase(), password)
    } catch {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = await auth.use('api').createToken(user)

    return response.ok({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: this.getDisplayName(user),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken: token.value!.release(),
        expiresIn: 43200,
      },
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    return response.ok({
      data: {
        id: user.id,
        email: user.email,
        name: this.getDisplayName(user),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({ success: true })
  }
}

