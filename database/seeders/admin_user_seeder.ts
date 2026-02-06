import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'
import User from '#models/user'

export default class AdminUserSeeder extends BaseSeeder {
  async run() {
    const email = env.get('ADMIN_EMAIL')?.trim().toLowerCase()
    const password = env.get('ADMIN_PASSWORD')?.trim()

    if (!email || !password) {
      return
    }

    const firstName = env.get('ADMIN_FIRST_NAME') ?? null
    const lastName = env.get('ADMIN_LAST_NAME') ?? null

    const existing = await User.query().where('email', email).first()

    if (existing) {
      existing.firstName = firstName ?? existing.firstName
      existing.lastName = lastName ?? existing.lastName
      existing.role = 'admin'
      existing.password = password
      await existing.save()
      return
    }

    await User.create({
      email,
      firstName,
      lastName,
      role: 'admin',
      password,
    })
  }
}

