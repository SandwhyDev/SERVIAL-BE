import multer from "multer";
import path from "path"

export const uploadStorage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, path.join(__dirname, `../static/uploads/product`))
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() +  file.originalname)
    }
})

export const uploadProducts = multer({storage : uploadStorage})