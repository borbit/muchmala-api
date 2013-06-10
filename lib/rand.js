var express = require('express');
var cmn = require('muchmala-cmn');
var _ = require('lodash');

module.exports = function(redis) {
  var puzzles = new cmn.db.Puzzles(redis);
  var app = express();

  app.get('/rand', function(req, res, next) {
    puzzles.getPuzzlesCount(function(err, count) {
      if (err) return next(err);
      
      var index = _.random(0, count-1);
      var op = {
        start: index
      , stop: index
      };

      puzzles.getPuzzlesIDs(op, function(err, ids) {
        if (err) return next(err);
        res.json(ids[0]);
      });
    });
  });

  return app;
};