// backend/routes/blog.js
const express = require("express");
const router = express.Router();
const { getBlogs, createBlog, updateBlog, deleteBlog, getOneBlog} = require("../controllers/blogController");
const authenticate=require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const {adminAuth} = require("../middleware/adminAuth");

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "./public/uploads/");
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `blog-${uniqueSuffix}${ext}`);
    }
})

const upload = multer({
    storage,
});

router.get("/", getBlogs);

router.get("/:id", getOneBlog);

router.post("/",authenticate,adminAuth,upload.single("imageUrl"), createBlog);

router.put("/:id",authenticate,adminAuth,upload.single("imageUrl"), updateBlog);

router.delete("/:id",authenticate,adminAuth, deleteBlog);

module.exports=router;