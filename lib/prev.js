var express = require('express');
var cmn = require('muchmala-cmn');

module.exports = function(redis) {
  var puzzles = new cmn.db.Puzzles(redis);
  var app = express();

  app.get('/prev/:puzzleId', function(req, res, next) {
    var puzzleId = req.params.puzzleId;

    puzzles.getPuzzleIndex(puzzleId, function(err, index) {
      if (err) return next(err);
      if (index === null)
        return next(new Error('No puzzle with id ' + puzzleId));

      puzzles.getPuzzleIdByIndex(index - 1, function(err, id) {
        if (err) return next(err);
        res.json(id);
      })
    });
  });

  return app;
};