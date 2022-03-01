import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()

export const jwtSign = (payload) => {
  return jwt.sign(payload, process.env.API_SECRET)
}

export const jwtVerif = async (req, res, next) => {
  try {
    let authHeader = await req.headers["authorization"]

    if (!authHeader) {
      res.status(404).json({
        success: false,
        msg: "unathorized user",
      })
      return
    }

    let token = await authHeader.split(" ")[1]
    let checkToken = await jwt.verify(token, process.env.API_SECRET)

    if (!checkToken) {
      res.status(404).json({
        success: false,
        msg: "jwt mal format",
      })
      return
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "jwt mal format",
    })
  }
}
