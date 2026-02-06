import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('categories', (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.text('description').nullable()
      table.text('image_url').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.boolean('enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.index(['enabled', 'order'])
    })

    this.schema.createTable('sections', (table) => {
      table.uuid('id').primary()
      table
        .uuid('category_id')
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description').nullable()
      table.text('image_url').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.boolean('enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['category_id', 'slug'])
      table.index(['category_id', 'enabled', 'order'])
    })

    this.schema.createTable('menu_items', (table) => {
      table.uuid('id').primary()
      table
        .uuid('category_id')
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT')
      table
        .uuid('section_id')
        .notNullable()
        .references('id')
        .inTable('sections')
        .onDelete('RESTRICT')
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description').nullable()
      table.bigInteger('base_price').notNullable()
      table.text('image_url').nullable()
      table.boolean('available').notNullable().defaultTo(true)
      table.boolean('enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.unique(['category_id', 'slug'])
      table.index(['category_id'])
      table.index(['section_id'])
      table.index(['enabled', 'available'])
    })

    this.schema.createTable('temporary_prices', (table) => {
      table.uuid('id').primary()
      table
        .uuid('menu_item_id')
        .notNullable()
        .references('id')
        .inTable('menu_items')
        .onDelete('CASCADE')
      table.string('rule_name').notNullable()
      table.bigInteger('price').notNullable()
      table.timestamp('start_at', { useTz: true }).notNullable()
      table.timestamp('end_at', { useTz: true }).notNullable()
      table.boolean('enabled').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.index(['menu_item_id'])
      table.index(['menu_item_id', 'enabled', 'start_at'])
      table.index(['menu_item_id', 'enabled', 'end_at'])
    })

    this.schema.raw(
      'CREATE INDEX IF NOT EXISTS temporary_prices_enabled_start_at_desc_idx ON temporary_prices (menu_item_id, start_at DESC) WHERE enabled = true'
    )
  }

  async down() {
    this.schema.raw('DROP INDEX IF EXISTS temporary_prices_enabled_start_at_desc_idx')
    this.schema.dropTable('temporary_prices')
    this.schema.dropTable('menu_items')
    this.schema.dropTable('sections')
    this.schema.dropTable('categories')
  }
}

