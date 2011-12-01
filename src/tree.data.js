Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore'], function(Class, DataTree, _) {
  return Class(DataTree, {
    fetch: function(path, query, callback) {
      var self = this;

      //directories = /index
      if (this.app.data.isDirectory(path)) {
        path+="index";
      }

      this.app._getContentFile(path, function(err, cnt) {
        if (err) return callback(err);

        callback(null, {
          'id': path, //.replace(/^.*\//, ''),
          'content': cnt
        });
        
      });
    }
  });
});