const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "You must be authorized first"
        })
    }
}