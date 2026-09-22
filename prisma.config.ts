import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'src/main/prisma/schema.prisma',
  migrations: {
    path: 'src/main/prisma/migrations',
    seed: 'src/main/prisma/seed.ts'
  },
  datasource: {
    url: process.env['DATABASE_URL']
  }
})
