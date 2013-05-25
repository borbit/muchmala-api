var mailer = require('nodemailer');
var cmn = require('muchmala-cmn');
var express = require('express');
var async = require('async');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');

var EMAIL_TPL = path.join(__dirname, '../email/sign.ejs')
var EMAIL_FROM = 'Muchmala <no-reply@muchmala.com>';
var EMAIL_SUBJECT = 'Link to Sign in';

var AUTH_USER = 'muchmala.com@gmail.com'
var AUTH_PASS = 'muchmala';

module.exports = function(redis) {
  var sign = new cmn.db.Sign(redis);
  var users = new cmn.db.Users(redis);
  var emails = new cmn.db.Emails(redis);
  var app = express();
  
  var smtp = mailer.createTransport('SMTP', {
    service: 'Gmail', auth: {
      user: AUTH_USER
    , pass: AUTH_PASS
    }
  });

  app.post('/sign', function(req, res, next) {
    var rUserId = req.body.userId;
    var rUserEmail = req.body.userEmail;
    var user;

    if (!rUserId)
      return next(new Error('User id is absent'));
    if (!rUserEmail)
      return next(new Error('User email is absent'));

    async.waterfall([
      function(cb) {
        emails.getUserId(rUserEmail, cb);
      },
      function(userId, cb) {
        users.getUser(userId || rUserId, cb);
      },
      function(found, cb) {
        if (!found)
          return next(new Error('Cannot find user'));

        user = found;
        user.email = rUserEmail;
        users.updateUser(user.id, user, cb);
      },
      function(cb) {
        emails.addEmail(rUserEmail, user.id, cb);
      },
      function(cb) {
        sign.createHash(user.id, cb);
      },
      function(hash, cb) {
        sendSignEmail({
          name: user.name
        , email: user.email
        , hash: hash
        }, cb);
      }
    ], function(err) {
      if (err) return next(err);
      res.end();
    });
  });

  function sendSignEmail(op, cb) {
    fs.readFile(EMAIL_TPL, 'utf8', function(err, tpl) {
      if (err) return cb(err);

      var text = ejs.render(tpl, {
        name: op.name
      , hash: op.hash
      });

      smtp.sendMail({
        from: EMAIL_FROM
      , subject: EMAIL_SUBJECT
      , to: op.email
      , text: text
      }, cb);
    });
  }

  return app;
};