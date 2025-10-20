import postgres from "postgres";
import env from "../../env";
import { drizzle } from "drizzle-orm/postgres-js";
import { categories } from "../schema/category";

export const insertCategorySeeder = async () => {
    const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;  
    const client = postgres(connectionString, {max: 1})
    const db = drizzle(client)

    console.log("seeding categories....")
    const categoriesData = [
        { name: "Food & Drinks", description: "Fuel for the soul (and stomach). Because good food = good mood 🍜" },
        { name: "Tickets", description: "For escaping reality once in a while ✈️" },
        { name: "Shopping", description: "Retail therapy to survive modern life 🛍️" },
        { name: "Health", description: "Keeping the body in one piece 💪" },
        { name: "Entertainment", description: "Because laughing and chilling count as self-care 🎬" },
        { name: "Education", description: "Leveling up the brain — one course (or regret) at a time 📚" },
        { name: "Electricity & Water", description: "Primary needs to keep life functional ⚡🚿" },
        { name: "House", description: "A cozy place to cry, nap, and exist 🏠" },
        { name: "Debt", description: "Past decisions haunting present finances 💸" },
        { name: "Insurance", description: "Pay now so future you can chill 😌" }
    ]

    try {
        await db.insert(categories).values(categoriesData).onConflictDoNothing()
        console.log("\n✅categories seeded successfully")
    } catch (error) {
        console.log("\n❌failed to seed categories", error)
        throw error
    } finally {
        await client.end()
    }

}
