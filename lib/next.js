var express = require('express');
var cmn = require('muchmala-cmn');

module.exports = function(redis) {
  var puzzles = new cmn.db.Puzzles(redis);
  var app = express();

  app.get('/next/:puzzleId', function(req, res, next) {
    var puzzleId = req.params.puzzleId;

    puzzles.getPuzzleIndex(puzzleId, function(err, index) {
      if (err) return next(err);
      if (index === null)
        return next(new Error('No puzzle with id ' + puzzleId));

      index++;

      puzzles.getPuzzlesCount(function(err, count) {
        if (err) return next(err);
        if (index == count) index = 0;
        
        puzzles.getPuzzleIdByIndex(index, function(err, id) {
          if (err) return next(err);
          res.json(id);
        });
      });
    });
  });

  return app;
};