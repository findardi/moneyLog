import db from "@/core/utils/database/connection";
import { createExpenseDto, createBulkExpenseDto, updateExpenseDto } from "./dto/expense.dto";
import { categories } from "@/core/utils/database/schema/category";
import { expenses } from "@/core/utils/database/schema/expense/expense.schema";
import { groqService } from "@/core/utils/libs/groq/groq.service";
import { and, asc, count, desc, eq, gte, ilike, lte, sum } from "drizzle-orm";

const groq = new groqService()

export interface GetExpensesOptions {
    limit?: number;
    offset?: number;
    sort?: "asc" | "desc";
    order_by?: "name" | "amount" | "spentAt" | "createdAt" | "updatedAt";
    filters?: {
        category?: string;
        name?: string;
        minAmount?: number;
        maxAmount?: number;
        startDate?: string;
        endDate?: string;
        date?: string;
    };
}

export const expenseService = {
    
    insert: async (request: createExpenseDto, userId: number) => {
        const {name, amount, spent_at} = request
        let categoryId = request.category_id

        try {
            if (!categoryId) {
                const categoriesData = await db.select({id: categories.id, name: categories.name}).from(categories)
                const categoryResponse = await groq.getCategory(name, categoriesData)
                
                if (categoryResponse) {
                    const parsed = JSON.parse(categoryResponse)
                    categoryId = parsed.id
                }
            }

            const [result] = await db.insert(expenses).values({
                id: crypto.randomUUID(), name, amount, categoryId, userId, spentAt: spent_at || new Date(), updatedAt: new Date(), createdAt: new Date()
            }).returning({id: expenses.id})

            return result
        } catch (error) {
            throw error
        }
    },

    insertBulk: async (request: createBulkExpenseDto, userId: number) => {
        try {
            const expensesArray = Array.isArray(request) ? request : [request]
            
            const categoriesData = await db.select({id: categories.id, name: categories.name}).from(categories)
            
            const expensesToInsert = await Promise.all(
                expensesArray.map(async (expense) => {
                    let categoryId = expense.category_id
                    
                    if (!categoryId) {
                        const categoryResponse = await groq.getCategory(expense.name, categoriesData)
                        if (categoryResponse) {
                            const parsed = JSON.parse(categoryResponse)
                            categoryId = parsed.id
                        }
                    }
                    
                    return {
                        id: crypto.randomUUID(),
                        name: expense.name,
                        amount: expense.amount,
                        categoryId,
                        userId,
                        spentAt: expense.spent_at || new Date(),
                        updatedAt: new Date(),
                        createdAt: new Date()
                    }
                })
            )
            
            const results = await db.insert(expenses).values(expensesToInsert).returning({id: expenses.id})
            return {
                count: results.length,
                ids: results.map(r => r.id)
            }
        } catch (error) {
            throw error
        }
    },
    
    update: async(id: string, request: updateExpenseDto) => {
        const {name, amount, spent_at} = request

        try {
            const [result] = await db.update(expenses).set({
                name, amount, spentAt: spent_at, updatedAt: new Date()
            }).where(eq(expenses.id, id)).returning({id: expenses.id})

            return result
        } catch (error) {
            throw error
        }
    },

    delete: async(id: string) => {
        try {
            const [result] = await db.delete(expenses).where(eq(expenses.id, id)).returning({id: expenses.id})
            return result
        } catch (error) {
            throw error
        }
    },

    getExpense: async(id: string) => {
        try {
            const [result] = await db.select().from(expenses).where(eq(expenses.id, id))
            return result
        } catch (error) {
            throw error
        }
    },

    getExpenses: async(userId: number, options?: GetExpensesOptions) => {
        const limit = options?.limit || 10
        const offset = options?.offset || 0
        const sort = options?.sort || "desc"
        const orderBy = options?.order_by || "createdAt"
        
        
        try {
            const baseCondition: any[]= [eq(expenses.userId, userId)]
            
            if (options?.filters) {
                const {category, name, minAmount, maxAmount, startDate, endDate, date} = options?.filters;

                if (category) {
                    const categoryID = await db.select({id: categories.id}).from(categories).where(eq(categories.name, category)).then((res) => res[0]?.id)
                    
                    if (categoryID) {
                        baseCondition.push(eq(expenses.categoryId, categoryID))
                    } else {
                        return {expenses: [],totalExpenses: 0, meta: {total: 0, limit, offset, page: 0, totalPages: 0}}
                    }
                }


                if (name) {
                    baseCondition.push(ilike(expenses.name, `%${name}%`))
                }

                if (minAmount !== undefined) {
                    baseCondition.push(gte(expenses.amount, minAmount));
                }
                if (maxAmount !== undefined) {
                    baseCondition.push(lte(expenses.amount, maxAmount));
                }

                if (startDate) {
                    baseCondition.push(gte(expenses.spentAt, new Date(startDate)));
                }
                if (endDate) {
                    baseCondition.push(lte(expenses.spentAt, new Date(endDate)));
                }

                if (date) {
                    const startOfDay = new Date(date);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(date);
                    endOfDay.setHours(23, 59, 59, 999);
                    baseCondition.push(gte(expenses.spentAt, startOfDay));
                    baseCondition.push(lte(expenses.spentAt, endOfDay));
                }
            }

            const total = await db.select({count: count()}).from(expenses).where(and(...baseCondition)).then((res) => res[0].count)

            const result = await db.select({
                id: expenses.id,
                name: expenses.name,
                amount: expenses.amount,
                category: categories.name,
                spentAt: expenses.spentAt,
                createdAt: expenses.createdAt,
                updatedAt: expenses.updatedAt
            })
            .from(expenses).leftJoin(categories, eq(expenses.categoryId, categories.id))
            .where(and(...baseCondition))
            .orderBy(sort === "asc" ? asc(expenses[orderBy]) : desc(expenses[orderBy]))
            .limit(limit)
            .offset(offset)

            const countTotalExpense = await db.select({total: sum(expenses.amount)}).from(expenses).where(and(...baseCondition)).then((res) => res[0].total)

            const meta = {
                total,
                limit,
                offset,
                page: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(total / limit),
            }
            
            return {
                expenses: result,
                totalExpenses: countTotalExpense,
                meta,
            }
        } catch (error) {
            throw error
        }
    }

}