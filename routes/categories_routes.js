import express from "express";
import ps from "../prisma/connection";

const categories_routes = express.Router()

categories_routes.post("/categories_create", async(req,res)=>{
    try {
        const data = await req.body
        const findTitle = await ps.categories.findUnique({
            where : {
                title : data.title
            }
        })

        if(findTitle){
            res.status(400).json({
                success : true,
                msg : "nama categories sudah ada"
            })
        }
        const result = await ps.categories.create({
            data : {
                title : data.title
            }
        })

        res.status(200).json({
            success : true,
            msg : "berhasil tambah categories"
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            error : error.message
        })
    }
})

categories_routes.get("/categories_read", async(req,res)=>{
    try {
        const result = await ps.categories.findMany()

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

export default categories_routes