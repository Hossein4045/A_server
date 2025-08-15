const User = require('../models/user');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken')



const adminList=["hosseinhasani508@gmail.com"]


exports.signup = async (req, res) => {
    const { name,email, password } = req.body;

    try {
        const existingUser = await User.findOne({email:email});

        if (existingUser) {
            return res.status(400).json({message: 'User already exist'});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password:hashedPassword,
            role:adminList.includes(email) ? "admin" : "user",
        })
        await user.save();

        const token = jwt.sign(
            {userId: user._id,email:user.email,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(200).json({
            message: "successfully created user",
            token,
            user:{
                id:user._id,
                name:user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        });

    }catch (error) {
        res.status(500).json({ message: "خطا در سرور", error: error.message });
    }
}

// 🔐 ورود کاربر
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user=await User.findOne({email:email});
        if (!user) {
            return res.status(400).json({message:"email or password is wrong"});
        }

        const isMatch=await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message:"email or password is wrong"});
        }

        const token=jwt.sign(
            {userId: user._id,email:user.email,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(200).json({
            message: "successfully logged in",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            }
        })


    }catch (error) {
        res.status(500).json({ message: "خطا در سرور", error: error.message });
    }
}


exports.getUser = async (req, res) => {
    try{
       const token=req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "دسترسی رد شد، توکن وجود ندارد." });

        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById({_id:decoded.userId}).select("-password");


        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        //if (user.role!=="admin") return res.status(401).json({message:"access denied !!"});


        res.status(200).json(user)

    }catch(err){
        res.status(403).json({
            message:"invalid token",
        })
    }
}