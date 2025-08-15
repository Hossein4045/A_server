// backend/index.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const path = require("path");
const bodyParser = require('body-parser')

// token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk3MjY3YjcwYTg3MDU3NGFkNTk4YzQiLCJlbWFpbCI6ImhAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU0NzM2MjUxLCJleHAiOjE3NTUzNDEwNTF9.bubsMv3qwc8Atd5Rf3GzglZs_trFZAfE3EPZs32SQZQ

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use("/", express.static(path.join(__dirname, "public")));

// ✅ درست: سرو کردن فایل‌های استاتیک در سطح اپلیکیشن
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// اتصال دیتابیس
connectDB();

// روت‌ها
app.use("/api/blog", require("./routes/blog"));
app.use("/api/auth", require("./routes/auth"));
// تست
app.get("/", (req, res) => {
    res.send(`
    <h1>🚀 Atria Blog API</h1>
    <p>عکس‌ها: <a href="/uploads">/uploads</a></p>
  `);
});

// 404
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'منبع درخواستی یافت نشد',
        requestedUrl: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});