console.log(process.cwd());

Joshfire.require(['src/app.node', 'joshfire/app.factory'], function(App, Factory) {
  //Joshfire.debug=true;
  var express = Joshfire.nodeRequire('express');
  var fs = Joshfire.nodeRequire('fs');
  var expressApp = express.createServer();
  var appFactory = new Factory({}, App, {});
  expressApp.use(express.bodyParser()); // needed to access req.body
  var joshfireAppMiddleware = function(req, res, next) {
    appFactory.buildInstance({
      'location': 'http://' + req.headers.host + '/' + req.url,
      'uri': req.url,
      'body': req.body || null,
      'headers': req.headers || null
      // 'query': todo = add query
    }, function(err, app) {
      if (err) {
        //todo catch only error about "no route matched"
        next();
        return;
      }

      app.render(function(err, code, headers, html) {
        res.send(html, headers, code);
      });
    });
  };

  //Don't serve images inside the doc with the app
  var imgBypassMiddleware = function(req, res, next) {
    if (req.url.match(/\/doc\/.*\.(jpg|png|gif)/)) {
      var fp = 'public/content/' + req.url.substring(5);
      res.sendfile(fp);
    } else {
      next();
    }
  };
  
  var logFile = fs.createWriteStream("/var/log/node-developer-joshfire.log",{"flags":"a"});
  expressApp.use(express.logger({ format: ':date :status :method :url :response-time :referrer :user-agent :remote-addr', stream:logFile}));


  expressApp.use(express.static('public/'));
  // maybe use http://groups.google.com/group/express-js/browse_thread/thread/90af66b91d268d1e/5937188832405a2f?lnk=gst&q=static#5937188832405a2f here
  expressApp.use(imgBypassMiddleware);
  expressApp.use(joshfireAppMiddleware);
  expressApp.listen(40022);
});