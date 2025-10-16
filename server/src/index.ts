import { Hono } from 'hono'
import onError from './core/utils/error/on-error'
import routeNotFound from './core/utils/error/on-notfound'
import userRoute from './api/user/user.controller'
import tokenRoute from './api/token/token.controller'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// user route
app.route("/api/user", userRoute)

// token route
app.route("/api/token", tokenRoute)

// handler route
app.onError(onError)
app.notFound(routeNotFound)

export default app
