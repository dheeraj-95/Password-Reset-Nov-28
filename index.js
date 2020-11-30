require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 8080;
app
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.json())
    // .use(bodyParser.urlencoded({extended : true}))
    .use(express.static("public"))
    .get('/',(req,res) => {
        res.json({status : process.env.SECRET})
    })
    .listen(port)