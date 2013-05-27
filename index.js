var redis = require('redis');
var express = require('express');
var cmn = require('muchmala-cmn');

var board = require('./lib/board');
var users = require('./lib/users');
var sign = require('./lib/sign');
var rand = require('./lib/rand');
var cors = require('./lib/cors');

exports.createServer = function(config, cb) {
  var redisClient = redis.createClient();
  var app = express();

  app.use(cors([
    'http://localhost:8002'
  , 'http://muchmala.dev'
  , 'http://muchmala.com'
  ]));

  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.errorHandler({
    showStack: true
  }));

  app.use(board(redisClient));
  app.use(users(redisClient));
  app.use(sign(redisClient));
  app.use(rand(redisClient));
  
  app.listen(config.port, config.host, cb);
};