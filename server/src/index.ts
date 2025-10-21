import { Hono } from "hono";
import onError from "./core/utils/error/on-error";
import routeNotFound from "./core/utils/error/on-notfound";
import userRoute from "./api/user/user.controller";
import tokenRoute from "./api/token/token.controller";
import expenseRoute from "./api/expense/expense.controller";
import spendingLimitRoute from "./api/speending-limit/spending-limit.controller";
import periodeLimitRoute from "./api/periode-limit/periode-limit.controller";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// user route
app.route("/api/user", userRoute);

// token route
app.route("/api/token", tokenRoute);

// expense route
app.route("/api/expense", expenseRoute);

// spending route
app.route("/api/spending", spendingLimitRoute);

// periode-limit route
app.route("/api/periode-limit", periodeLimitRoute);

// handler route
app.onError(onError);
app.notFound(routeNotFound);

export default app;
