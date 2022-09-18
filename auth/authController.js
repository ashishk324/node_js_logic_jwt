const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const jwt =require('jsonwebtoken');
const config = require('../config')
const bcrypt = require('bcryptjs');
const User= require('/user/user')
const session = require('express-session')


router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


router.post('/registerUser',(req,res)=>{
   var encrptedPassword= bcrypt.hashSync(req.body.password,7);
    User.create({
        name : req.body.name,
        email: req.body.email,
        password : encrptedPassword
    }, (err,user)=>{
        if(err){
            console.log("error occured");
            res.status(500).send('There is error in DB connection');
        }
     var token=   jwt.sign({id:user._id},config.secret,{
        expiresIn: 86400
     });
     res.send({auth:true,token: token});
    });


});

module.exports = router;