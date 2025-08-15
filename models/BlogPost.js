// backend/models/BlogPost.js
const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: {
                type: String,
                required: true
        },
        tags: [{ type: String, trim: true,default:[] }],
        imageUrl: String,
        author: { type: mongoose.Schema.Types.ObjectId,ref:"User",required: true },
        readTime: { type: Number, default: 5 },
        publishedAt: { type: Date, default: Date.now },
        isShow: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);