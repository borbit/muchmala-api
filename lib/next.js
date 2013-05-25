var express = require('express');
var cmn = require('muchmala-cmn');

module.exports = function(redis) {
  var puzzles = new cmn.db.Puzzles(redis);
  var app = express();

  app.get('/next/:puzzleid', function(req, res, next) {
    var puzzleId = req.params.puzzleid;

    puzzles.getPuzzleIndex(puzzleId, function(err, index) {
      if (err) return next(err);
      if (index === null)
        return next(new Error('Puzzle ' + puzzleId + ' does not exist'));

      var op = {
        start: index + 1
      , stop: index + 1
      };

      puzzles.getIDs(op, function(err, ids) {
        if (err) return next(err);
        if (ids.length) return res.end(ids[0]);
          
        puzzles.getFirstPuzzleId(function(err, id) {
          if (err) return next(err);
          res.end(id);
        })
      });
    });
  });

  return app;
};