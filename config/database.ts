import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const connection: Record<string, unknown> = {
  host: env.get('DB_HOST'),
  port: env.get('DB_PORT'),
  user: env.get('DB_USER'),
  password: env.get('DB_PASSWORD'),
  database: env.get('DB_DATABASE'),
}

if (env.get('DB_SSL', false)) {
  connection.ssl = { rejectUnauthorized: false }
}

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
