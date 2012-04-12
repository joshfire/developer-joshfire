Joshfire.define(['src/page.common', 'joshfire/class', 'joshfire/vendor/underscore','templates_compiled/js/partial_doc_navigation'], function(Page, Class, _, templateNavigation) {  
  return Class(Page,{
    render: function(args, callback) {
      var self = this;

      //Force latest
      //args.params.version = "dev";

      console.log('PARAMS',args);
      if (!args.params.path) args.params.path = '';
      
      if (args.params.version == 'latest' || !args.params.version) {
        return callback(null, this.redirect('/doc/' + this.app.latestFrameworkVersion + '/' + args.params.path));
      }
      
      this.app.ui.element('/header').setState('selectedPage', 'doc');
      this.app.ui.element('/header').refresh();
      
      //Default if empty path or directory : index
      if (args.params.path.match(/(^|\/)$/)) {
        args.params.path += 'index';
      }

      this.app.data.fetch('/' + args.params.version + '/' + args.params.path, false, function(err, data) {
        if (err) {
          return callback({"code":404},"No such page :/");
        }
        
        self.buildIndex(args.params.path,args.params.version,function(err,indexContent) {
          console.warn("got cnt",indexContent);
          data.content+=indexContent;
          
          // Replace all links /doc/XXX with /doc/dev/XXX depending on the version we're browsing.
          data.content = data.content.replace(/\/doc\/([^\"\']+)/g, '/doc/' + args.params.version + '/$1');

          callback(null, data.content);
          
        });

      });
    },
    
    buildIndex: function(currentPath, version, callback) {
      var self = this;
      
      this.app.data.fetch('/' + version + "/index",false,function(err,data) {
        if (err) return callback(err);
        
        currentPath = "/doc/"+currentPath.replace(/index$/,"");
        
        //slice(1) to ignore the FAQ link
        var links = _.uniq(data.content.match(/\/doc\/([^\"\']+)/g).slice(1));
        
        var position = _.indexOf(links,currentPath);
        console.warn("page position is ",currentPath,position,links);
        //Page not found, we don't know how to navigate...
        if (position==-1) {
          return callback(null,"");
        }
        
        var nav = {
          prev:{
            url:position==0?"":links[position-1]
          },
          next:{
            url:position==(links.length-1)?"":links[position+1]
          }
        };
        
        self.getDocPageTitle(nav.prev.url.substring(5),version,function(err,titleBefore) {
          self.getDocPageTitle(nav.next.url.substring(5),version,function(err,titleAfter) {
            
            nav.prev.title = titleBefore;
            nav.next.title = titleAfter;
            
            callback(null,templateNavigation(nav));
            
          });
        });
        
      });
    },
    
    getDocPageTitle:function(fullPath,version,callback) {
      
      if (!fullPath.length) return callback(null,"");
      
      console.warn("fetch",'/'+version+'/' + fullPath);
      
      this.app.data.fetch('/'+version+'/' + fullPath,false,function(err,data) {
        
        if (err || !data || !data.content) {
          return callback(null,"");
        }
        
        var m = data.content.match(/\<h1\>(.*?)\<\/h1\>/);
        console.warn("title match",fullPath,m);
        if (m) {
          return callback(null,m[1]);
        }
        callback(null,"");
      });
    },
    
    enhance: function() {
      this.__super();

      Joshfire.require(['src/vendor/highlight', 'joshfire/vendor/jquery'], function(hljs, $) {
        $('pre code').each(function(i, e) {
          hljs.highlightBlock(e, '    ');
        });
        
      });
    }
  });
});