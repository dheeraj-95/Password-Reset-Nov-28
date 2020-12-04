require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/userRouter');
const mongoose  = require('mongoose')
const MONGOURI = process.env.MONGO_URL;

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true

})
mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo Db")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})


const port = process.env.PORT || 8080;
app
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended : true}))
    // .use(express.static("public"))
    .get('/',(req,res) => {
        res.json({status :"Hello From Backend"})
    })
    .use('/user',userRouter)
    .listen(port)