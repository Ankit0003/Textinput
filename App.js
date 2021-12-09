var express = require("express");
var app = express();
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const http = require("http");
const fs = require("fs");
var request = require("request");
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/sentence",{useNewUrlParser:true},{useUnifiedTopology:true});
var MongoClient = require('mongodb').MongoClient;
var nameSchema = new mongoose.Schema({
  sentence: String,
});
var quest = mongoose.model('sentence',nameSchema);
var url = "mongodb://localhost:27017/";

const homeFile = fs.readFileSync("index.html", "utf-8");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"/index.html"));

  function myFun(item,index)
  {
    var sent = req.body.sentence;
 
    console.log(item.sentence);
  }
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
  //  var dbo = db.db("sentence");
    //Find the first document in the customers collection:
  /*  quest.findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.sentence);
      db.close();
    });*/

    quest.find({},function(err, result){
      if(err) throw err;
      result.forEach(myFun);
     
      db.close();
    });
  });
});

app.post("/addquestion",(req,res)=>{
  var info={
    sentence:req.body.sentence
  };
  
  var me = new quest(info);
  me.save(function(err){
    if(err)
    {
      console.log("error occured!")
    }
    else
    {
      console.log("Done!");
    }
  });
 
  res.redirect('/');

});

module.exports = quest;


app.listen(3000, () => {
  console.log("Server listening");
});