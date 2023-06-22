require("dotenv").config()
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require("../models/Users");

const userRouter = express.Router();

userRouter.post("/register", async(req, res) => {
    const {username, password, email} = req.body;
    try {
        const user = await UserModel.findOne({username});

        if (user) {
           return res.json({message: "User already exists"})
        }
        const hashPwd = await bcrypt.hash(password, 10)
        const newUser = new UserModel({username, password: hashPwd, email})
        await newUser.save()
        res.json({message: "User Registered Successfully"})
    }catch(e) {
        res.json({message: e.message})
    }
});

userRouter.post("/login", async(req, res) => {
    const {username, password} = req.body;
    try {
        const user = await UserModel.findOne({username});
        if (!user) {
            return res.json({message: "User does not exist!"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.json({message: "Username or Password Is Incorrect!"})
        }
        const token = jwt.sign({id: user._id}, process.env.PRIVATE_SECRET_KEY)
        res.json({token, userID: user._id, username: user.username})
    }catch(e) {
        res.json({message: e.message})
    }
});

module.exports=userRouter;