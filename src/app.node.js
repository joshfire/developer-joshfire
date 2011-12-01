Joshfire.define(['src/app', 'joshfire/class', 'joshfire/vendor/underscore'], function(App,Class,_) {  
  var fs = Joshfire.nodeRequire('fs');
  var contentpath = 'public/content/';

  return Class(App, {
    _getContentFile: function(path, callback) {
      var self = this;

      if (self.ui.isDirectory(path)) {
        fs.readdir(contentpath + path, function(err, files) {
          callback(null, _.map(files, function(file) {

            return {
              'id': file.replace(/\.html$/, '')
            };
          }));
        });
      } else {
        fs.readFile(contentpath + path + '.html', 'utf-8', function(err, cnt) {
          if (err) return callback(err);

          callback(null, cnt);
        });
      }
    }
  });
});