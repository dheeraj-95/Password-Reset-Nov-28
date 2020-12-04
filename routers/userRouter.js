require('dotenv').config({path :'../.env'})
const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')
// const User = mongoose.model("User")

// const crypto = require('crypto')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET;

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: { 
      user: process.env.EMAIL, 
      pass: process.env.EMAIL_PASSWORD
  } 
})

const mailDetails = {
    from: '"Hey dude 👻" <noreply@dheeraj.com>', 
    to:'dheerajlinak@gmail.com',
    subject:"password reset",
    text : 'test',
    html:`
    <p>You requested for password reset</p>
    `
}

transporter.sendMail(mailDetails, (err,info) => {
    if(err) 
        console.log(err)
    else {
        console.log('sent successfully');
    }
})


// router.post('/signup',(req,res)=>{
//   const {name,email,password,pic} = req.body 
//   if(!email || !password || !name){
//      return res.status(422).json({error:"please add all the fields"})
//   }
//   User.findOne({email:email})
//   .then((savedUser)=>{
//       if(savedUser){
//         return res.status(422).json({error:"user already exists with that email"})
//       }
//       bcrypt.hash(password,12)
//       .then(hashedpassword=>{
//             const user = new User({
//                 email,
//                 password:hashedpassword,
//                 name,
//                 pic
//             })
    
//             user.save()
//             .then(user=>{
//                 // transporter.sendMail({
//                 //     to:user.email,
//                 //     from:"no-reply@insta.com",
//                 //     subject:"signup success",
//                 //     html:"<h1>welcome to instagram</h1>"
//                 // })
//                 res.json({message:"saved successfully"})
//             })
//             .catch(err=>{
//                 console.log(err)
//             })
//       })
     
//   })
//   .catch(err=>{
//     console.log(err)
//   })
// })


// router.post('/signin',(req,res)=>{
//     const {email,password} = req.body
//     if(!email || !password){
//        return res.status(422).json({error:"please add email or password"})
//     }
//     User.findOne({email:email})
//     .then(savedUser=>{
//         if(!savedUser){
//            return res.status(422).json({error:"Invalid Email or password"})
//         }
//         bcrypt.compare(password,savedUser.password)
//         .then(doMatch=>{
//             if(doMatch){
//                 // res.json({message:"successfully signed in"})
//                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
//                const {_id,name,email,followers,following,pic} = savedUser
//                res.json({token,user:{_id,name,email,followers,following,pic}})
//             }
//             else{
//                 return res.status(422).json({error:"Invalid Email or password"})
//             }
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     })
// })


// router.post('/reset-password',(req,res)=>{
//      crypto.randomBytes(32,(err,buffer)=>{
//          if(err){
//              console.log(err)
//          }
//          const token = buffer.toString("hex")
//          User.findOne({email:req.body.email})
//          .then(user=>{
//              if(!user){
//                  return res.status(422).json({error:"User dont exists with that email"})
//              }
//              user.resetToken = token
//              user.expireToken = Date.now() + 3600000
//              user.save().then((result)=>{
//                  transporter.sendMail({
//                      to:user.email,
//                      from:"no-replay@insta.com",
//                      subject:"password reset",
//                      html:`
//                      <p>You requested for password reset</p>
//                      <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
//                      `
//                  })
//                  res.json({message:"check your email"})
//              })

//          })
//      })
// })


// router.post('/new-password',(req,res)=>{
//     const newPassword = req.body.password
//     const sentToken = req.body.token
//     User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
//     .then(user=>{
//         if(!user){
//             return res.status(422).json({error:"Try again session expired"})
//         }
//         bcrypt.hash(newPassword,12).then(hashedpassword=>{
//            user.password = hashedpassword
//            user.resetToken = undefined
//            user.expireToken = undefined
//            user.save().then((saveduser)=>{
//                res.json({message:"password updated success"})
//            })
//         })
//     }).catch(err=>{
//         console.log(err)
//     })
// })