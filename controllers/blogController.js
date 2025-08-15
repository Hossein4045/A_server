const BlogPost=require('../models/blogPost');
const mongoose = require("mongoose");


exports.getBlogs=async (req,res)=>{

    try {
        const {q,tags,page,limit}=req.query;
        const filter={}
        const pageNum=page!==undefined?(page-1)*limit:0;
        if(tags){
            filter.tags={$in:[tags]};
        }
        if(q){
            filter.$or=[
                {title: {$regex: q}},
                {description: {$regex: q}},
            ]
        }

        const blogs=await BlogPost.find(filter)
            .skip(pageNum).limit(limit)
            .sort({publishedAt:-1})
            .populate("author","name email imageUrl")
        res.json({
            length:blogs.length,
            blogs,
        });

    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}
exports.getOneBlog= async (req,res)=>{
    const {id}=req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(500).json({
                success:false,
                message:"id is not valid",

            })
        }

        const blog=await BlogPost.findById(id).populate("author","name email imageUrl");

        res.status(200).json({
            success:true,
            blog,
        })

    }catch (e) {
        res.status(500).json({ message: "Server error", error: e.message });
    }
}

exports.createBlog=async (req, res) => {
    try{
        const { title, description, author,tags,readTime } = req.body;
        const imageUrl=req.file ? `/uploads/${req.file.filename}` :null;
        const newBlog=new BlogPost({
            title,
            description,
            tags:tags?tags.split(",").map(tag=>tag.trim()):[],
            author,
            imageUrl:imageUrl || null,
            readTime:readTime||5,
        })
        await newBlog.save();
        const populatedBlog=await BlogPost.findById(newBlog._id).populate("author","name email imageUrl");
        res.status(201).json({
            success:true,
            data:{
                blog:populatedBlog,
            },
            message: "مقاله با موفقیت ایجاد شد"
        })

    }
    catch (e) {
        res.status(500).json({ success:false,message: "خطا در ایجاد مقاله", error: e.message });
    }

}

exports.updateBlog=async (req, res) => {
    try {
        console.log(req.file)
        const { title, description,tags,readTime } = req.body;
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(500).json({
                success:false,
                message:"id is not valid",

            })
        }
        if (req.file) {
            blog.imageUrl = `/uploads/${req.file.filename}`;
        }

        const imageUrl=req.file ? `/uploads/${req.file.filename}` :null;
        console.log(imageUrl)

        const blog=await BlogPost.findByIdAndUpdate(id,{
            $set:{
                title,
                description,
                tags:tags?tags.split(",").map(tag=>tag.trim()):[],
                imageUrl:imageUrl ,
                readTime:readTime||5,
            }
        },{
            new:true
        });

        res.status(201).json({
            success:true,
            data:{
                blog,
            }
        })
    }
    catch (e) {
        res.status(500).json({ success:false,message: "خطا در آپدیت مقاله", error: e.message });
    }
}


exports.deleteBlog=async (req, res) => {
    try{
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(500).json({
                success:false,
                message:"id is not valid",

            })
        }
        const x=await BlogPost.findById(id);
        if (x==null){
            res.status(404).json({
                success:false,
                message:"blog not found",
            })
        }
        const blog=await BlogPost.findByIdAndDelete(id);
        res.status(201).json({
            success:true,
            data:{},
            message:"blog deleted successfully",
        })

    }catch(err){
        res.status(500).json({ success:false,message: "خطا در پاک کردن مقاله", error: err.message });
    }
}





