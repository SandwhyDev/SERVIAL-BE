import express from "express"
import { comparePassword, hashPassword } from "../libs/hashing"
import { jwtSign } from "../libs/jwt"
import ps from "../prisma/connection"
import env from "dotenv"
import moment from "moment"
env.config()

const admin_routes = express.Router()

admin_routes.post("/admin_create", async (req, res) => {
  try {
    const data = await req.body
    const findUsername = await ps.admin.findUnique({
      where: {
        username: data.username,
      },
    })

    if (findUsername) {
      res.status(404).json({
        success: false,
        msg: "username sudah ada",
      })
      return
    }
    const result = await ps.admin.create({
      data: {
        username: data.username,
        password: hashPassword(data.password),
      },
    })

    res.status(200).json({
      success: false,
      msg: "berhasil buat admin",
      query: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

admin_routes.post("/admin_login", async (req, res) => {
  try {
    const data = await req.body
    const findUsername = await ps.admin.findUnique({
      where: {
        username: data.username,
      },
    })

    if (!findUsername) {
      res.status(404).json({
        success: false,
        msg: "username tidak ditemukan",
      })
      return
    }

    const cekPassword = await comparePassword(
      data.password,
      findUsername.password
    )

    if (!cekPassword) {
      res.status(404).json({
        success: false,
        msg: "password salah",
      })
      return
    }

    res.cookie(
      "_admin",
      {},
      {
        expires: new Date(moment().add(1, "d")),
      }
    )

    res.status(200).json({
      success: true,
      msg: "berhasil login",
      token: jwtSign(
        {
          app_name: "servial.com",
          admin_id: findUsername.id,
          admin_username: findUsername.username,
        },
        process.env.API_SECRET
      ),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

admin_routes.get("/admin_read", async (req, res) => {
  try {
    const result = await ps.admin.findMany()
    res.status(200).json({
      success: false,
      //   msg: "berhasil buat admin",
      query: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default admin_routes
