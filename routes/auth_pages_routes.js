import express from "express"
import env from "dotenv"
env.config()
import { jwtVerif } from "../libs/jwt"

const auth_pages_routes = express.Router()

auth_pages_routes.get("/auth_pages", jwtVerif, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      msg: "authorized user",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default auth_pages_routes
