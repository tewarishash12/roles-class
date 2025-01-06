require("dotenv").config()
const jwt = require("jsonwebtoken");
const { ROLES } = require("../db");

function authMiddleware(req, res, next) {
    console.log(req.headers)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(400).json({ message: "Login karle pehle" })
    jwt.verify(token, process.env.MAIN_SECRET, (err, userinfo) => {
        if (err)
            return res.status(400).json({ message: err.message });
        console.log(userinfo)
        req.user = userinfo;
        next();
    })
}

function authAdmin(req,res,next) {
    console.log("Role from user",req.user);
    console.log("Role from database", ROLES.ADMIN);
    if(req.user.role !== ROLES.ADMIN){
        res.status(401).json({message: "UnAuthorized Access"})
    }
    next();
}

module.exports = { authMiddleware,authAdmin }