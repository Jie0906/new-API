var express = require('express');
var bodyparser = require('body-parser');
var engine = require('ejs-locals');
var app = express();
var admin = require("firebase-admin");

var serviceAccount = require("./clear-wind-255714-firebase-adminsdk-evcrk-18979360bd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://clear-wind-255714.firebaseio.com"
});
app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
var firedata = admin.database();

app.use(express.static('public')); //增加靜態檔案

app.get('/',function(req,res){
    firedata.ref('todos').once('value',function(snashot){
        var data = snashot.val();
        var title = data.title;
        var content = data.content;
        res.render('index',{
            'title': title
        })
    })
})

app.post('/addtodo',function(req,res){
    var content = req.body.content;
    console.log(content);
    var contentRef = firedata.ref('todos').push();
    contentRef.set({
        "content" : content})
        .then(function(){
        firedata.ref('todos').once('value',function(snashot){
            res.send(
                {
                    'sucess' : true,
                    'content' : snashot.val(),
                    'message' : '請求成功!'
                });
        })
    })
})


var port = process.env.port || 3000;
app.listen(port);