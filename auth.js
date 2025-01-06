const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const {USERS} = require("./db");


require("dotenv").config();
const refresh_tokens = new Set();

const MAIN_SECRET = process.env.MAIN_SECRET
const AUTH_SECRET = process.env.AUTH_SECRET

app.use(express.json());

app.post("/register", async(req,res)=>{
    try{
        const {username} = req.body;
        const user = {username}
        res.status(201).json({message: "data has been saved successfully"});
    } catch(err){
        res.status(400).json({message:err.message})
    }
})

app.post("/token", async(req,res)=>{
    const refresh_token = req.body.token;
    console.log(refresh_token)
    if(!refresh_tokens.has(refresh_token))
        return res.status(401).json({message:"You need to login"})

    jwt.verify(refresh_token, process.env.MAIN_SECRET, (err,data)=>{
        if(err)
            return res.status(400).json({message:"Forbidden"});
        console.log(data)
        const userInfo = { username: data.username }; 
        console.log(userInfo)
        const token = generateToken({ user: userInfo });
        return res.status(201).json({message:"You are verified"});
    })
})

app.delete("/logout", async(req,res)=>{
    const refresh_token = req.body.refresh_token;
    if(!refresh_tokens.has(refresh_token))
        return res.status(400).message({message: "Nhi degi.....   entry"});
    refresh_tokens.delete(refresh_token);
    res.status(200).json({message: "Tum toh logout kar gaye"})
})

app.post("/login", async(req,res)=>{
    try{
        console.log(req.body);
        const {username,role} = req.body;
        const user = USERS.find(u=> u.username === username);
        if(!user)
            res.json({message: "Username doesn't exist"});

        const userInfo ={username:user.username, role: user.role};
        const token_data = {user:userInfo};

        const refresh_token = jwt.sign(userInfo, MAIN_SECRET);
        refresh_tokens.add(refresh_token)
        const token = generateToken(token_data)
        
        res.status(201).json({auth_token: token, refresh_token: refresh_token});
    } catch(err){
        res.status(400).json({message:err.message})
    }
})

function generateToken(data){
    return jwt.sign(data, AUTH_SECRET, {expiresIn:"20s"})
}

app.listen(process.env.AUTH_PORT, ()=>{
    console.log("Connected to authentication server", `http://localhost:${process.env.AUTH_PORT}/`);
})
