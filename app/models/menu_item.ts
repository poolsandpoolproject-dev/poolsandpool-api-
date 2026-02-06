import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import Section from '#models/section'
import TemporaryPrice from '#models/temporary_price'

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'category_id' })
  declare categoryId: string

  @column({ columnName: 'section_id' })
  declare sectionId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column({ columnName: 'base_price' })
  declare basePrice: string

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column()
  declare available: boolean

  @column()
  declare enabled: boolean

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Section)
  declare section: BelongsTo<typeof Section>

  @hasMany(() => TemporaryPrice)
  declare temporaryPrices: HasMany<typeof TemporaryPrice>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(model: MenuItem) {
    model.id = randomUUID()
  }
}