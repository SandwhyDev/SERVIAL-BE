import express from "express"
import path from "path"
import { uploadProducts } from "../libs/product_upload"
import ps from "../prisma/connection"

const product_routes = express.Router()

product_routes.post("/product_create", uploadProducts.single("image"),async(req,res)=>{
    try {
        const data = await req.body
        const file = await req.file
        const findTitle = await ps.products.findUnique({
            where : {
                title : data.title
            }
        })

        if(findTitle){
            res.status(400).json({
                success : true,
                msg : "nama product sudah ada"
            })
        }
        const result = await ps.products.create({
            data : {
                title : data.title,
                deskripsi : data.deskripsi,
                harga : parseInt(data.harga),
                berat : parseInt(data.berat),
                categories_id : parseInt(data.categories_id),
                photo : {
                    create : {
                        filename : file.filename,
                        location : path.join(__dirname,`../static/uploads/product/${file.filename}`)
                    }
                }
            }
        })

        res.status(200).json({
            success : true,
            msg : "berhasil tambah product"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

product_routes.get("/product_read", async(req,res)=>{
    try {
        const result = await ps.products.findMany()

        res.status(200).json({
            success : true,
            query : result
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

export default product_routes