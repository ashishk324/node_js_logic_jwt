const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json());
var User = require('./user');
const user = require('./user');

router.get('/',(req,response)=>{
 user.find({},(err,usersList)=>{
    if(err){
        return response.status(500).send("There was problem retrieving the usersList")
    }
     response.status(200).send(usersList);
 })


})
module.exports = router;