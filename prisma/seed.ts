import { PrismaClient } from "../app/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  const demoUserId = "f94d16c2-e5e3-42d7-bab2-0cef72ff8113";

  //create Simple Product
  await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, i) => ({
      userId: demoUserId,
      name: `Product ${i + 1}`,
      price: (Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 20),
      lowStock: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 5)),
    })),
  });

  console.log("Seeded data created successfully");
  console.log(`Created 25 products for user ID : ${demoUserId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
