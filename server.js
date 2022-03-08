import express from "express"
import cors from "cors"
import env from "dotenv"
import cookieParser from "cookie-parser"
import user_routes from "./routes/user_routes"
import auth_pages_routes from "./routes/auth_pages_routes"
import admin_routes from "./routes/admin_routes"
import product_routes from "./routes/products_routes"
import categories_routes from "./routes/categories_routes"
env.config()

const app = express()
const { PORT } = process.env

//middleware
app.use(cors())
app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//routes
app.use("/api", user_routes)
app.use("/api", auth_pages_routes)
app.use("/api", admin_routes)
app.use("/api", product_routes)
app.use("/api", categories_routes)

//listener
app.listen(PORT, () => {
  console.log(`
    > LISTENED TO PORT ${PORT}
    `)
})
