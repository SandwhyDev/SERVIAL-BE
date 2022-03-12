import multer from "multer"
import path from "path"

export const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `../static/uploads/blogs`))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  },
})

export const upload_blog = multer({ storage: uploadStorage })
