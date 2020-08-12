var express = require('express')
var app = express();
var fs = require('fs');

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
const engines = require('consolidate');
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

//dinh nghia cac routes
//localhost:5000
app.get('/',function(req,res){
    fs.readFile(fileName,'utf8',function(err,data){
        let ds = data.split('\n');
        let result = [];
        for(i=0;i<ds.length;i++){
            let nameX = ds[i].split(';')[0];
            let emailX = ds[i].split(';')[1];
            result.push({name:nameX,email:emailX});
        }
        res.render('index',{model:result});
    })
})
app.get('/register',function(req,res){
    res.render('register');
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var fileName = 'users.txt';
app.post('/doRegister',function(req,res){
    let name = req.body.txtName;
    let email = req.body.txtEmail;
    let data = name + ';' + email +'\n';
    fs.appendFile(fileName,data,function(error){
        res.redirect('/');
    })

})

var server = app.listen(5000);