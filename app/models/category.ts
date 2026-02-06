import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Section from '#models/section'
import MenuItem from '#models/menu_item'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column()
  declare order: number

  @column()
  declare enabled: boolean

  @hasMany(() => Section)
  declare sections: HasMany<typeof Section>

  @hasMany(() => MenuItem)
  declare menuItems: HasMany<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(model: Category) {
    model.id = randomUUID()
  }
}