import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import MenuItem from '#models/menu_item'

export default class TemporaryPrice extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'menu_item_id' })
  declare menuItemId: string

  @column({ columnName: 'rule_name' })
  declare ruleName: string

  @column()
  declare price: string

  @column.dateTime({ columnName: 'start_at' })
  declare startAt: DateTime

  @column.dateTime({ columnName: 'end_at' })
  declare endAt: DateTime

  @column()
  declare enabled: boolean

  @belongsTo(() => MenuItem)
  declare menuItem: BelongsTo<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(model: TemporaryPrice) {
    model.id = randomUUID()
  }
}