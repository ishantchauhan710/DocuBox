const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = expressAsyncHandler(async(req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.userId).select("-password");
            req.user = user;
            next();
        } catch(error) {
            res.status(401);
            console.log(error.message);
            throw new Error(`Authorization failed, invalid token`);
        }
    }

    if(!token) {
        res.status(401);
        throw new Error("No token found");
    }
});

module.exports = {authMiddleware};