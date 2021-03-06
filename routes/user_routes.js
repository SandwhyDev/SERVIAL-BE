import express from "express"
import moment from "moment"
import { comparePassword, hashPassword } from "../libs/hashing"
import { jwtSign } from "../libs/jwt"
import ps from "../prisma/connection"

const user_routes = express.Router()

// CREATE USER
user_routes.post("/user_create", async (req, res) => {
  try {
    const data = await req.body

    const findEmail = await ps.users.findUnique({
      where: {
        email: data.email,
      },
    })

    if (findEmail) {
      res.status(404).json({
        success: false,
        msg: "email sudah digunakan",
      })
      return
    }

    const result = await ps.users.create({
      data: {
        email: data.email,
        password: hashPassword(data.password),
      },
    })

    res.status(200).json({
      success: true,
      msg: "berhasil register",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

//user login
user_routes.post("/user_login", async (req, res) => {
  try {
    const data = await req.body
    const findUser = await ps.users.findUnique({
      where: {
        email: data.email,
      },
    })

    if (!findUser) {
      res.status(404).json({
        success: false,
        msg: "email salah",
      })
      return
    }

    const cekPassword = await comparePassword(data.password, findUser.password)

    if (!cekPassword) {
      res.status(400).json({
        success: false,
        msg: "password salah",
      })
      return
    }

    const cookie_date = new Date(moment().add(1, "day"))
    const token = await jwtSign(
      {
        app_name: "servial.com",
        user_id: findUser.id,
        user_name: findUser.username,
        user_mail: findUser.email,
        req_date: moment().format("DD:MM:YYYY hh:mm:ss z"),
      },
      process.env.API_SECRET
    )

    res.cookie("_user", token, {
      expires: cookie_date,
    })

    res.status(200).json({
      success: true,
      msg: "berhasil login",
      token: token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// USER LOGOUT
user_routes.get("/user_logout", async (req, res) => {
  try {
    res.clearCookie("_user")

    res.status(200).json({
      success: true,
      msg: "berhasil logout",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// USER READ
user_routes.get("/user_read", async (req, res) => {
  try {
    const countData = await ps.users.count()
    const result = await ps.users.findMany()
    res.status(200).json({
      success: true,
      total_data: countData,
      query: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// USER DELETE
user_routes.delete("/user_delete/:id", async (req, res) => {
  try {
    const { id } = await req.params
    const findId = await ps.users.findUnique({
      where: {
        id: parseInt(id),
      },
    })
    if (!findId) {
      res.status(400).json({
        success: false,
        msg: "user tidak ditemukan",
      })
      return
    }

    const result = await ps.users.delete({
      where: {
        id: parseInt(id),
      },
    })

    res.status(201).json({
      success: true,
      msg: "berhasil delete user",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default user_routes
