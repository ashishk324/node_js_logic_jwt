const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const jwt =require('jsonwebtoken');
const config = require('../config')
const bcrypt = require('bcryptjs');
//const User= require('../user')
const session = require('express-session');
const user = require('../user/user');
const { LocalStorage } = require('node-localstorage');
var localStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch')


router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());


router.post('/registerUser',(req,res)=>{
   var encrptedPassword= bcrypt.hashSync(req.body.password,7);
   user.create({
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

router.post('/login',(req,res)=>{
    user.findOne({email:req.email},(err,response)=>{
        if(err){
            res.statusCode(500).send("Error Occured while validating");
        }
        console.log(req.body);
        console.log("response is "+response);
       const isPasswordValid= bcrypt.compareSync(req.body.password,response.password)
        if(!isPasswordValid) {
            res.statusCode(401).send({auth:false,token:null})
        } else {
            var userToken=jwt.sign({id : response._id},config.secret,{
                expiresIn:86400
            });
            
            localStorage.setItem('authToken',userToken);
            res.statusCode(200).send({auth:true,token:userToken,loggedin : true});
        }

        //if(req.user)
    });
})

router.get('/loggedInUser',(req,res)=>{
    var token=req.headers['x-access-token'];
    //var token = localStorage.getItem('authToken');
    console.log('token'+token);
    if(!token){
        res.status(401).send("User not authorized");
    }
    jwt.verify(token,config.secret,(err,decodedUser)=>{
        console.log("decoded user is "+decodedUser.id)
        if(err){
            console.log(err)
            res.status(500).send("Token is invalid")
        }
        user.findById(decodedUser.id,{password:0},(err,userDetails)=>{
            console.log("user from DB is  "+userDetails.name)
            if(err){
                console.log(err);
                res.status(500).send('we could not find the user in the DB');
            }

            if(!userDetails){
                res.status(404).send('User not found in DB');
            }
            res.status(200).send(userDetails)
        });
    });
})

module.exports = router;