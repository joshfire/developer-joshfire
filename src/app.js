Joshfire.define(['joshfire/app', 'joshfire/class', 'joshfire/utils/router', 'src/tree.data', 'templates_compiled/js/header', 'templates_compiled/js/footer', 'templates_compiled/js/global', 'templates_compiled/js/content'], function(App, Class, Router, Data, tHeader, tFooter, tPage, tContent) {
  //Joshfire.debug=true;
  return Class(App, {
    uiTree: {
      'id': 'root',
      'type': 'panel',
      'template': tPage,
      'children': [
        {
          'id': 'header',
          'type': 'panel',
          'innerTemplate': tHeader,
          'htmlId': 'branding'
        },
        {
          'id': 'content',
          'type': 'panel.manager',
          'template': tContent,
          'requirePrefix': 'src/pages/',
          'htmlId': 'content'
        },
        {
          'id': 'footer',
          'htmlId': 'colophon',
          'innerTemplate': tFooter,
          'type': 'panel'
        }
      ]
    },

    latestFrameworkVersion: 'dev',
    dataClass: Data,
    id: 'JoshfireWww',

    routes: [
      ['doc', 'doc'],
      ['doc/', 'doc'],
      ['doc/:version/api/*path', 'api'],
      ['doc/:version/*path', 'doc'],
      ['', 'index'],
      ['support', 'support']
    ],

    setup: function(callback) {
      var self = this;

      this.ui.fetch('/content', false, function(err, elt) {
        self.router = new Router(self, self.routes, {
          manager: elt.element
        });

        callback(null, true);
      });
    }
  });
});