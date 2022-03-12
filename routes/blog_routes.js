import express from "express"
import { upload_blog } from "../libs/blog_upload"
import ps from "../prisma/connection"

const blog_routes = express.Router()

// CREATE BLOG
blog_routes.post("/blog_create", upload_blog.single("image"), async (req, res) => {
  try {
    const data = await req.body
    const file = await req.file
    const findTitle = await ps.blogs.findUnique({
      where: {
        title: data.title,
      },
    })

    if (findTitle) {
      res.status(400).json({
        success: false,
        msg: "judul sudah ada",
      })
      return
    }
    const result = await ps.blogs.create({
      data: {
        title: data.title,
        body: data.body,
        banner: {
          create: {
            filename: file.filename,
            location: `http://localhost:9000/uploads/blogs/${file.filename}`,
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      msg: "berhasil tambah blog",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// READ BLOG
blog_routes.get("/blog_read", async (req, res) => {
  try {
    const total_data = await ps.blogs.count()
    const result = await ps.blogs.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        banner: {
          select: {
            filename: true,
            location: true,
          },
        },
      },
    })

    res.status(200).json({
      success: true,
      total_data: total_data,
      query: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// READ UINQUE BLOG
blog_routes.get("/blog_read/:title", async (req, res) => {
  try {
    const result = await ps.blogs.findUnique({
      where: {
        title: req.params.title,
      },
      include: {
        banner: {
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

// DELETE MANY BLOG
blog_routes.delete("/blogs_delete_many", async (req, res) => {
  try {
    const deleteMany = await ps.blogs.deleteMany()

    res.status(200).json({
      success: true,
      query: deleteMany,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default blog_routes
