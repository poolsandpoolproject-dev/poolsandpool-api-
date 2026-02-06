import { BaseCommand, flags } from '@adonisjs/core/ace'
import User from '#models/user'

export default class CreateAdminUser extends BaseCommand {
  static commandName = 'user:create-admin'
  static description = 'Create or update an admin user'

  static options = {
    startApp: true,
  }

  @flags.string({ description: 'Admin email' })
  declare email: string

  @flags.string({ description: 'Admin password' })
  declare password: string

  @flags.string({ description: 'Admin first name' })
  declare firstName?: string

  @flags.string({ description: 'Admin last name' })
  declare lastName?: string

  @flags.boolean({ description: 'Update user if already exists' })
  declare force?: boolean

  async run() {
    if (!this.email || !this.password) {
      this.logger.error('Missing required flags: --email and --password')
      this.exitCode = 1
      return
    }

    const existing = await User.query().where('email', this.email).first()

    if (existing) {
      if (!this.force) {
        this.logger.error('User already exists. Re-run with --force to update.')
        this.exitCode = 1
        return
      }

      existing.email = this.email
      existing.firstName = this.firstName ?? existing.firstName
      existing.lastName = this.lastName ?? existing.lastName
      existing.role = 'admin'
      existing.password = this.password
      await existing.save()

      this.logger.success(`Updated admin user: ${existing.email}`)
      return
    }

    const user = await User.create({
      email: this.email,
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      role: 'admin',
      password: this.password,
    })

    this.logger.success(`Created admin user: ${user.email}`)
  }
}

