module.exports = function(allowedHosts) {
  return function(req, res, next) {
    if (~allowedHosts.indexOf(req.headers.origin)) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, X-HTTP-Method-Override');
      req.method == 'OPTIONS' ? res.send(200) : next();
    } else {
      next();
    }
  };
};