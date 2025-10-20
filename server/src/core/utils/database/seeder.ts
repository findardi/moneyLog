import { insertCategorySeeder } from "./seeder/insert.category.seeder";

const runSeeders = async () => {
  console.log("🚀 Starting database seeding...\n");
  const start = Date.now();

  try {
    // Jalankan seeder secara berurutan
    await insertCategorySeeder()
    
    const duration = Date.now() - start;
    console.log(`\n✨ Seeding completed in ${duration}ms`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeeders();
