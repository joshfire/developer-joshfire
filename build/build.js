var build = {
    baseUrl: '../',
    name: 'joshfireWww',
    dir: '../export-optimized/',
    modules: [
      {
          name: 'www',
          adapter: 'browser',
          js: {
              'include': [
              'src/app',
              
              //Require'd in app.web so not autodetectable
              'joshfire/adapters/browser/utils/datasource',
              'joshfire/adapters/browser/utils/navigation',
              'joshfire/adapters/browser/uielements/panel.manager',
              
              //TODO src/pages/* support
              'src/pages/doc',
              'src/pages/index',
              'src/pages/support',
              
              'src/vendor/highlight',
              
              'src/app.web'
              ]
          }
      }
    ]
};
