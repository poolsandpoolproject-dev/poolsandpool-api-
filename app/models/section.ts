import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import MenuItem from '#models/menu_item'

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'category_id' })
  declare categoryId: string

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

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => MenuItem)
  declare menuItems: HasMany<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null


  @beforeCreate()
  static assignUuid(model: Section) {
    model.id = randomUUID()
  }
}