'use strict';
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var pug = require('pug');
//var router = require('./router.js');
var router = express.Router();
var sex = require('sexjs');
var app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/src/views/directives'));

app.set('views', './src/views/');
app.set('view engine', 'pug');

router.use(bodyParser.json());
router.route('/')
  .get(function (req, res) {
    res.render('index');
  })

app.use('/', router);

var port = process.env.PORT || 5000;
//var hostname = process.env.IP || 'localhost';
app.listen(port, function (err) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log(`Server ${sex.neuter} is running at http://gusers.herokuapp.com:${port}`);
});
