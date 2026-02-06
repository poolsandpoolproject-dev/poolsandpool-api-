import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('categories', (table) => {
      table.unique(['name'])
    })

    this.schema.alterTable('sections', (table) => {
      table.unique(['category_id', 'name'])
    })

    this.schema.alterTable('menu_items', (table) => {
      table.unique(['section_id', 'name'])
    })
  }

  async down() {
    this.schema.alterTable('menu_items', (table) => {
      table.dropUnique(['section_id', 'name'])
    })

    this.schema.alterTable('sections', (table) => {
      table.dropUnique(['category_id', 'name'])
    })

    this.schema.alterTable('categories', (table) => {
      table.dropUnique(['name'])
    })
  }
}

