import { PrismaClient } from '@/generated/prisma'
import { templates } from './data/template'

const prisma = new PrismaClient()

async function main() {
  for (const template of templates) {
    const exists = await prisma.template.findUnique({
      where: { name: template.name },
      select: { id: true },
    })

    if (!exists) {
      await prisma.template.create({
        data: template,
      })
      console.log(`Created template: ${template.name}`)
    } else {
      console.log(`Skipped (already exists): ${template.name}`)
    }
  }
}

main()
  .then(() => {
    console.log('Seeding finished (new templates only).')
  })
  .catch((err) => {
    console.error('Seeding error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
