const bcrypt = require('bcrypt');

const saltRounds = 10;

const generateHash = (plainTextPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, saltRounds)
            .then(hash => {
                resolve(hash);
            })
            .catch(err => reject(err))
    });
};

const validateHash = (plainTextPassword, passwordHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, passwordHash)
            .then(result => resolve(result))
            .catch(err => reject(err))
    });
};

module.exports = { generateHash, validateHash };