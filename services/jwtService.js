require('dotenv').config({ path: '../.env' })

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const createToken = (email) => {
    return jwt.sign({
        exp : Math.floor(Date.now() / 1000) + (30 * 60),
        email
    },secret, 
    // { expiresIn : Math.floor(Date.now() / 1000) + (60 * 60)}
)};

const validateToken = (token) => {
    try{
        const decoded = jwt.verify(token, secret);
        // console.log(decoded);
        return decoded;
    }catch(err) {
        console.error(err);
        return false;
    }
}

module.exports = {createToken, validateToken}