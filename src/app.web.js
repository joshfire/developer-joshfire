Joshfire.require(['src/app', 'joshfire/class', 'joshfire/utils/datasource', 'joshfire/utils/navigation'], function(App, Class, DataSource, Navigation) {
  Joshfire.debug = true;
  var ds = new DataSource();
  var docApp = Class(App, {
    setup: function(callback) {
      var self = this;
      
      var anticipateHeaderRedirects = function(ev,data) {
        $("a",self.ui.element("/header").htmlEl).each(function(i,a) {
          if (a.href && a.href.indexOf("http://"+window.location.host+"/doc/latest/")===0) {
            a.href = a.href.replace("\/doc\/latest\/","/doc/"+self.latestFrameworkVersion+"/");
          }
        })
      };
      
      self.ui.element("/header").subscribe("afterInsert",anticipateHeaderRedirects);
      self.ui.element("/header").subscribe("afterRefresh",anticipateHeaderRedirects);
      

      this.__super(function(err) {
        if (err) return callback(err);
        self.navigation = new Navigation(self, {});
        callback();
      });
    },

    _getContentFile: function(path, callback) {
      if (this.ui.isDirectory(path)) {
        return callback('directory browsing not implemented');
      }

      ds.request({
        'url': '/content' + path + '.html',
        'cache': 3600
      },callback);
    }
  });

  Joshfire.onReady(function() {
    window._app = new docApp({
      'autoInsert': true
    });
  });
});