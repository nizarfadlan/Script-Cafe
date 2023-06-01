import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({
    where: { email: "owner@nizarfadlan.dev" },
    update: {},
    create: {
      name: "Nizar",
      email: "owner@nizarfadlan.dev",
      role: "Owner",
      isActive: true,
      password: "$2b$12$D47uI1t2wb706VPMxVv5AePQJG8Xr4Gp0y3KNDP3Vs6m2SJhQud0a",
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
