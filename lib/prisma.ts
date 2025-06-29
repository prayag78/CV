import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  throw new Error("DATABASE_URL environment variable is required");
}

if (!process.env.DIRECT_URL) {
  console.error(
    "DIRECT_URL environment variable is required for Prisma Accelerate"
  );
  throw new Error(
    "DIRECT_URL environment variable is required for Prisma Accelerate"
  );
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Add connection validation
prisma
  .$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

export default prisma;
