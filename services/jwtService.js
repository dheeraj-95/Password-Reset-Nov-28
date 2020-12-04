const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const createToken = (username) => {
    return jwt.sign({
        username
    },secret, 
    { expiresIn : 60}
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