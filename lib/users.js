var express = require('express');
var cmn = require('muchmala-cmn');

var MAX_NAME_LENGTH = 20;

module.exports = function(redis) {
  var users = new cmn.db.Users(redis);
  var app = express();

  app.put('/users/:userid', function(req, res, next) {
    if (!req.body.name) {
      return next(new Error('User name is absent'));
    }

    var name = req.body.name;
    var uid = req.params.userid;

    users.getUser(uid, function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('User ' + uid + ' does not exist'));
      if (name.length > MAX_NAME_LENGTH) {
        name = name.substr(0, MAX_NAME_LENGTH);
      }

      user.name = name;
      users.updateUser(uid, user, function(err) {
        if (err) return next(err);
        res.json({name: name});
      });
    });
  });

  return app;
};