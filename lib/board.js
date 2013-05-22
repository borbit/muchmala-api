var express = require('express');
var cmn = require('muchmala-cmn');
var  _ = require('lodash');

module.exports = function(redis) {
  var boards = new cmn.Boards(redis);
  var users = new cmn.db.Users(redis);
  var app = express();

  app.get('/board/:name/:uid', function(req, res, next) {
    var name = req.params.name;
    var uid = req.params.uid;

    if (!boards[name]) {
      return next(new Error('Board ' + name + ' does not exist'));
    }

    boards[name](function(err, list) {
      if (err) return next(err);
      if (!list.length) return res.json([]);

      var uids = _.map(list, function(i) {
        return i.member;
      });

      users.getUsers(uids, function(err, users) {
        if (err) return next(err);

        _.each(list, function(i) {
          var user = users[i.member];
          user.id == uid && (i.me = true);
          i.member = user.name;
        });

        res.json(list);
      });
    });
  });

  return app;
};