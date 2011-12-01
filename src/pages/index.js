Joshfire.define(['src/page.common', 'joshfire/class', 'joshfire/vendor/underscore', 'templates_compiled/js/page_index'], function(Page, Class, _, Tpl) {
  return Class(Page, {
    render: function(args, callback) {
      this.app.ui.element('/header').setState('selectedPage', 'index');
      this.app.ui.element('/header').refresh();
      callback(null, Tpl());
    }
  });
});