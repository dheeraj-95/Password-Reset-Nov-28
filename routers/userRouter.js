require('dotenv').config({ path: '../.env' })
const express = require('express')
const userRouter = express.Router()

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const nodemailer = require('nodemailer')

const url = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleWare = require('../middlewares/authMiddleware');
const {generateHash, validateHash} = require('../services/hashingService');
const {createToken, validateToken} = require('../services/jwtService');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

userRouter
    .post('/signup', async (req, res) => {
        const { name, email, password } = req.body;

        const client = await mongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db('usersdb');
        const user = db.collection('users');

        const existingUser = await user.findOne({ email: email })
        if (existingUser) {
            res.status(422).json({ error: "User already exists with this email" });
        } else {
            generateHash(password)
                .then(hash => {
                    const options = { upsert: true };
                    user.findOneAndUpdate({ email }, { $set: { password: hash } }, options);
                    res.status(201).json({ message: 'User Registered Successfully' });
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })

        }
    });

userRouter
    .post('/signin', async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(422).json({ error: "please add email or password" })
        }

        const client = await mongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db('usersdb');
        const user = db.collection('users');

        const existingUser = await user.findOne({ email: email })
        if (!existingUser) {
            res.status(422).json({ error: "Invalid Email or password" });
        }
        else {
            validateHash(password, existingUser.password).then(hashResult => {
                if(hashResult){
                    const token = createToken(email);
                    res.cookie('jwt',token, {
                        maxAge : 100000000,
                        httpOnly : true,
                        secure : true
                    })
                    res.status(200).json({status : 'Login Successfull..!!'});
                }else {
                    res.status('401').json({error : 'Unauthorized..!!'});
                }
            })
            .catch(err => {
                console.log(err);
                res.status('401').json({error : 'Unauthorized..!!'});
            });
        }
    })

userRouter
    .get('/logout', (req, res) => {
        res.clearCookie('jwt');
        res.status(200).json({type : 'success',message : 'Logged Out'});
    })

userRouter
    .post('/reset-password', async (req, res) => {
        const { email } = req.body
        if (!email) {
            return res.status(422).json({ error: "please add email" })
        }

        const client = await mongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db('usersdb');
        const user = db.collection('users');

        const existingUser = await user.findOne({ email: email })
        if (!existingUser) {
            return res.status(422).json({ error: "User dont exists with that email" })
        } else {
            const token = createToken(email);
            user.findOneAndUpdate({ email: email }, { $set: { password: token } })

            const resetUrl = `https://password-reset-heroku.herokuapp.com/auth/${token}`

            const mailOptions = {
                to: `${email}`,
                from: "no-replay@dheeraj.com",
                subject: "Password Reset Link",
                html: `
                <p>You requested for password reset</p> <br>click in this <a href="${resetUrl}">link</a> to reset password <br>
                Link Expires in 30 minutes.
                `
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if (err)
                    console.log(err);
                else {
                    res.json({ message: `Password Reset link sent to ${email}` });
                }
            });
        }
    });


userRouter.get('/auth/:token', async (req, res) => {
    const token = req.params.token
    const decoded = validateToken(token)

    if (decoded) {
        let client = await mongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db('usersdb');
        const user = db.collection('users');
        user.findOneAndUpdate({
            email: decoded.email
        }, {
            $set: {
                confirmed: true
            }
        }, (err, result) => {
            if (result) {
                res.redirect('');
            }
        });
    }
    else {
        res.json({
            error: `Password Reset failed.`
        });
    }
});


userRouter.post('/passwordreset', async (req, res) => {
    const {
        password,
        email
    } = req.body;
    let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); 
    const db = client.db('usersdb');
    const user = db.collection('users');

    user.findOne({
        email: email
    }, (err, User) => {
        if (User == null) {
            res.json({
                message: 'No User found with ' + email + ' !!!'
            });
        } else {
            let token = User.confirmed
            if (token) {

                generateHash(password)
                    .then(hash => {
                        user.findOneAndUpdate({ email: email }, { $set: { password: hash, confirmed: false } });
                        res.status(200).json({ message: 'Password reset Successful' });
                    })
                    .catch(err => {
                        console.log(err);
                        res.json(err);
                    })
            }else {
                res.json({error : err});
            }
        }
    })
});


userRouter.get('/checklogin', function (req, res) {
    const {jwt} = req.cookies
    console.log(jwt);
    const decoded = validateToken(jwt)
    if (decoded) {
        res.json({
            type : "success",
            message: 'Login Successful..',
            user: decoded.email
        });
    } else {
        res.json({
            message: 'Invalid Login..'
        });
    }
});

module.exports = userRouter