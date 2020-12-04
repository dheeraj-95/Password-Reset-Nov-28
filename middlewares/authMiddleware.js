const {validateToken} = require('../services/jwtService')

const authMiddleWare = (req, res, next) => {
    if(validateToken(req.cookies.jwt)) {
        next();
    } else {
        res.status(401).send("Un authorized from middleware")
    }
}

module.exports = authMiddleWare