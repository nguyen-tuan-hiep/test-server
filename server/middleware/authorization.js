const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
    const jwtToken = req.header("token");
    if(!jwtToken) {
        return res.status(403).json("Not Authorized!");
    }
    try {
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = payload.user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(403).json("Not Authorized!");
    }
}