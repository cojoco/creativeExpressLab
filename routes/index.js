var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('./public/auth.html', { title: 'Express' });
});

router.get('/home', ensureAuthenticated, function(req, res) {
  console.log(req.user.username);
  res.sendfile('./public/home.html');
});

router.post('/addComment', ensureAuthenticated, function(req, res) {
  console.log("entered POST addComment route");
  console.log(req.body);
  var reqObj = req.body;
  console.log(reqObj);
  MongoClient.connect("mongodb://localhost/creativeExpress", function(err, db) {
    if(err) throw err;
    db.collection('movies')
      .update(
        {name:reqObj.movieTitle},/*This should find the movie object by title*/
        {$push: { comments: {text:reqObj.commentText,user:reqObj.user}}},/*This should define what to push in the document's array*/
        function(err, records) {
          res.writeHead(200);
          res.end("");
      });
  }); 
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

var jsonParser = bodyParser.json();
module.exports = router;
