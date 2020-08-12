const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://binhdq:TULac9iYmA5B6pvi@cluster0-lkrga.mongodb.net/StudentDB";
//localhost:3000/student
app.get('/student',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    let results = await dbo.collection("Student").find({}).toArray();
    res.render('allStudent',{model:results});
})

//user submit form
app.post('/doSearch',async (req,res)=>{
    let inputName = req.body.txtName;
    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    let results = await dbo.collection("Student").find({name:inputName}).toArray();
    res.render('allStudent',{model:results});

})

app.get('/insert',(req,res)=>{
    res.render('insert');
})
app.post('/doInsert',async (req,res)=>{
    let inputName = req.body.txtName;
    let inputWeight = req.body.txtWeight;
    let newStudent = {name : inputName, weigh:inputWeight};

    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    await dbo.collection("Student").insertOne(newStudent);
    res.redirect('/student');

})
app.get('/delete',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("Student").deleteOne(condition);
    res.redirect('/student');

})
const PORT = process.env.PORT || 3000;
var server=app.listen(PORT,function() {});

