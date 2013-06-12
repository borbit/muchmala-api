var redis = require('redis-url');
var express = require('express');
var cmn = require('muchmala-cmn');

var board = require('./lib/board');
var users = require('./lib/users');
var sign = require('./lib/sign');
var rand = require('./lib/rand');
var prev = require('./lib/prev');
var next = require('./lib/next');
var cors = require('./lib/cors');

exports.createServer = function(config, cb) {
  var redisClient = redis.createClient(config.redis);
  var app = express();

  app.use(cors([
    'http://localhost:8002'
  , 'http://192.168.0.100:8002'
  , 'http://muchmala.com:8002'
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
  app.use(prev(redisClient));
  app.use(next(redisClient));
  
  app.listen(config.port, config.host, cb);
};