import express from "express"
import path from "path"
import { uploadProducts } from "../libs/product_upload"
import ps from "../prisma/connection"

const product_routes = express.Router()

// PRODUCT CREATE
product_routes.post("/product_create", uploadProducts.single("image"), async (req, res) => {
  try {
    const data = await req.body
    const file = await req.file
    const findTitle = await ps.products.findUnique({
      where: {
        title: data.title,
      },
    })

    if (findTitle) {
      res.status(400).json({
        success: true,
        msg: "nama product sudah ada",
      })
      return
    }
    const result = await ps.products.create({
      data: {
        title: data.title,
        deskripsi: data.deskripsi,
        harga: parseFloat(data.harga),
        berat: parseInt(data.berat),
        satuan_berat: data.satuan_berat,
        categories: data.categories,
        photo: {
          create: {
            filename: file.filename,
            location: `http://localhost:9000/uploads/product/${file.filename}`,
          },
        },
      },
    })

    res.status(200).json({
      success: true,
      msg: "berhasil tambah product",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// PRODUCT READ
product_routes.get("/product_read", async (req, res) => {
  try {
    const count_prouduct = await ps.products.count()
    const result = await ps.products.findMany({
      include: {
        photo: {
          select: {
            filename: true,
            location: true,
          },
        },
      },
    })

    res.status(200).json({
      success: true,
      total_data: count_prouduct,
      query: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// PRODUCT READ UNIQUE
product_routes.get("/product_read/:title", async (req, res) => {
  try {
    const result = await ps.products.findUnique({
      where: {
        title: req.params.title,
      },
      include: {
        photo: {
          select: {
            filename: true,
            location: true,
          },
        },
      },
    })

    res.status(200).json({
      success: true,
      query: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default product_routes
