import { Context, Hono } from "hono";
import { createBulkExpenseSchema, updateExpenseSchema } from "./dto/expense.dto";
import { expenseService, GetExpensesOptions } from "./expense.service";
import { HTTP_STATUS } from "@/core/constant/http-code";
import { Response } from "@/core/constant/api-response";
import { AccessMiddleware } from "@/core/utils/middleware/access.middleware";
import { JWTPayload } from "@/core/utils/middleware/jwt";
import { authorizeMiddleware } from "@/core/utils/middleware/authorize.middleware";

const expenseRoute = new Hono()
const accessMiddleware = new AccessMiddleware()
  
expenseRoute.post("/", 
    accessMiddleware.authenticate,
    accessMiddleware.isActive,
    authorizeMiddleware.authorize("isAdmin"),
    async (c:Context) => {
    const payload = c.get("payload") as JWTPayload
    const body = await c.req.json()
    const data = await createBulkExpenseSchema.parse(body)
    const result = await expenseService.insertBulk(data, payload.id)

    return c.json(
        Response.success("Success create expense(s)", HTTP_STATUS.CREATED, result)
    )
})

expenseRoute.patch("/:id",    
    accessMiddleware.authenticate, 
    accessMiddleware.isActive,
    authorizeMiddleware.authorize("canAccess"),
    async (c:Context) => {
    const body = await c.req.json()
    const data = await updateExpenseSchema.parse(body)
    const result = await expenseService.update(c.req.param("id"), data)

    return c.json(
        Response.success("Success update expense", HTTP_STATUS.OK, result)
    )
})

expenseRoute.delete("/:id",    
    accessMiddleware.authenticate, 
    accessMiddleware.isActive,
    authorizeMiddleware.authorize("canAccess"),
    async (c:Context) => {
    const result = await expenseService.delete(c.req.param("id"))

    return c.json(
        Response.success("Success delete expense", HTTP_STATUS.OK,   result)
    )
})

expenseRoute.get("/:id",    
    accessMiddleware.authenticate, 
    accessMiddleware.isActive,
    authorizeMiddleware.authorize("canAccess"),
    async (c:Context) => {
    const result = await expenseService.getExpense(c.req.param("id"))

    return c.json(
        Response.success("Success get expense", HTTP_STATUS.OK, result)
    )
})

expenseRoute.get("/",    
    accessMiddleware.authenticate, 
    accessMiddleware.isActive,
    async (c:Context) => {
    const payload = c.get("payload") as JWTPayload
    const limit = Number(c.req.query("limit")) || 10;
    const offset = Number(c.req.query("offset")) || 0;
    const sort = (c.req.query("sort") as "asc" | "desc") || "desc";
    const order_by = (c.req.query("order_by") as any) || "createdAt";
    
    const filters: GetExpensesOptions["filters"] = {};
    
    const {category, name, min_amount, max_amount, start_date, end_date, date} = c.req.query()
   
    if (category) filters.category = category;
    if (name) filters.name = name;
    if (min_amount) filters.minAmount = Number(min_amount);
    if (max_amount) filters.maxAmount = Number(max_amount);
    if (start_date) filters.startDate = start_date;
    if (end_date) filters.endDate = end_date;
    if (date) filters.date = date;
    
    const {expenses, totalExpenses, meta} = await expenseService.getExpenses(payload.id, {limit, offset, sort, order_by, filters: Object.keys(filters).length > 0 ? filters : undefined})

    return c.json(
        Response.success("Success get expenses", HTTP_STATUS.OK, {totalExpenses, expenses}, meta)
    )
})


    
export default expenseRoute;