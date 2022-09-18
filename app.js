const express = require('express');
const app = express();
var userRouter = require('./user/userController');
var authController = require('./auth/authController')
var db = require('./dbcconnect');

app.use('/users',userRouter);
app.use('/auth',authController);

module.exports = app;
//module.exports = userRouter;
//module.exports = authController;