const jwt = require("jsonwebtoken");

const authenticate=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    const token=authHeader?.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: 'دسترسی رد شد، توکن وجود ندارد.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ذخیره اطلاعات کاربر در درخواست
        next(); // ادامه به روت بعدی
    } catch (err) {
        return res.status(403).json({ message: 'توکن نامعتبر یا منقضی شده است.' });
    }
}


module.exports = authenticate;