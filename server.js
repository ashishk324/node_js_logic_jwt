var express = require('express');
var app = require('./app');
//var app = express();
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static('./public'))


app.get('/',(req,response)=>{
   response.send('running');
});

app.listen(4012,(err,data)=>{
    console.log('server is running')
});