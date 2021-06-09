/*
 * Every part of the app comes here to be compiled.
*/
(function Init(){
  if(!window.location.hash) window.location.hash = "home";
  const _INIT = this;
  const _mydir = window.BaseDir;
  const log = console.log;
  const template = MM.require('template');
  const http = MM.require('http');
  const DBM = MM.require('DBM');
  const dbm = new DBM();
  const M = MM.require('M');
  const Routes = MM.require('Routes');
  M.AutoInit();
  const modal = function LeanModal(html){
    var $m = M.modal(html);
    return $m;
  };
  const $http = new http();
  const Template = template[0];
  const MTemplate = template[1];
  const ActionSheet = MM.require('ActionSheet');
  const _profile_template = function(view){
    return $http.get(_mydir+'_views/profile_template.php?view='+view);
  };
  const isLoggedIn = (function(){
    if(typeof window.isLoggedIn == "string" && Number(window.isLoggedIn) != NaN)
      return Boolean(Number(window.isLoggedIn))
    else if(window.isLoggedIn == "")
      return Boolean(false);
    else 
      return Boolean(window.isLoggedIn)
  })();
  const user = window.___user___;
  const view = function(view){
    return _mydir + "_views/"+view+".php";
  };
  const getPosts = function(callback){
    var returns = [];
    $.ajax(_mydir+"_php/share/de.php").done(function(e){
      returns = JSON.parse(e);
      if(isFun(callback)){
        callback(returns);
      } else {}
    });
    return returns;
  };
  //setPPs();
  const ctnr = $("#main-content");
  const tabs = $("#Tabs");
  const Mtabs = M.Tabs(tabs);
  const btns = ['profile-btn'];
  const ctx = new (function Ctx(){
    var ctx =  this;
    ctx.site = {
      name: window.SiteName,
      logo: window.SiteLogo,
    };
    ctx.currentvars = {
      username: "",
      email: "",
      name: "",
      university: ""
    };
    ctx.user = user;
    // You Can Put the catagories here
    ctx.catagories = {
      "social":[
        {
          "value": "antropology",
          "name": "antropology",
          "title": "Antropology"
        },{
          "value": "archaeology",
          "name": "archaeology",
          "title": "Archaeology"
        },{
          "value": "economics",
          "name": "economics",
          "title": "Economics"
        },{
          "value": "geography",
          "name": "geography",
          "title": "Geography"
        },{
          "value": "history",
          "name": "history",
          "title": "History"
        },{
          "value": "law",
          "name": "law",
          "title": "Law"
        },{
          "value": "lignuistics",
          "name": "lignuistics",
          "title": "Lignuistics"
        },{
          "value": "politics",
          "name": "politics",
          "title": "Politics"
        },{
          "value": "psychology",
          "name": "psychology",
          "title": "Psychology"
        },{
          "value": "sociology",
          "name": "sociology",
          "title": "Sociology"
        }
      ],
      "natural": [
        {
          "value": "ict",
          "name": "ict",
          "title": "Computer Science"
        },{
          "value": "biology",
          "name": "biology",
          "title": "Biology"
        },{
          "value": "chemistry",
          "name": "chemistry",
          "title": "Chemistry"
        },{
          "value": "physics",
          "name": "physics",
          "title": "Physics"
        },{
          "value": "astronomy",
          "name": "astronomy",
          "title": "Astronomy"
        },{
          "value": "earthsci",
          "name": "earthsci",
          "title": "Earth Science"
        }
      ]
    };
  })();
  const routes = Routes(ctx,_mydir,user,getPosts,view,user,isLoggedIn,
    MTemplate,Template,$http,M,dbm,http,template,log,_profile_template,ActionSheet);

  function DisplayManager(routes){
    this.routes = routes;
  }

  DisplayManager.prototype = {
    path: function(path,query){
      var that = this;
      var routes = that.routes;
      var _query = query ? query : null;
      var route = routes.find(function(route){
        return route.path == path;
      });
      if(!route) return;
      that.display(route,_query);
    },
    getPage: function(url,template,isphp){
      var page = $http.get(url);
      var _html = template ? MTemplate(page,ctx,ctx,ctx) : page;
      return _html;
    },
    onchange: function(route,query){
      var that = this;
      var _title_template = `
      <div class="top-nav" id="___current_title">
        <div class="container">
          <div class="col-md-12">
            <div class="inside">
              <a href="#"><img class="avatar-md" src="${ctx.site.logo}" alt="SiteLogo"></a>
              <div class="data">
                <h5><a href="#">{{title}}</a></h5>
              </div>
            </div>
          </div>
        </div>
      </div>`;
      $('[data-toggle="tooltip"]').tooltip();
      if(route.transparent){
        if(ctnr.hasClass('withbg')){
          ctnr.removeClass('withbg')
        }
      } else {
        if(!ctnr.hasClass('withbg')){
          ctnr.addClass('withbg')
        }
      }
      if(route.title){
        document.title = SiteName+"/"+route.title; 
        ctnr.prepend(MTemplate(_title_template,route,route,route));
        route.ctitle = route.title;
      } else {
        document.title = SiteName;
        route.ctitle = SiteName;
      }
      if(that.currentRoute){
        if(that.currentRoute.onexit && isFun(that.currentRoute.onexit)){
          that.currentRoute.onexit();
        } else {}
      }
      M.inputs();
    },
    display: function(route,_query){
      var that = this;
      that.currentRoute = route;
      var temp = route.template != null ? route.template : true;
      var isphp = route.php != null ? route.php : false;
      var page = that.getPage(route.url,temp,isphp);
      ctnr.html(page);
      that.onchange(route,_query);
      ctnr.trigger('page:change');
      route.setHtml = function(html,callback){
        if(!callback) callback = function(){};
        ctnr.html(html);
        callback.call(route,_query,that);
      };
      route.setTitle = function(html,callback){
        if(!callback) callback = function(){};
        $("#___current_title").find('.inside h5 a').html(html);
        callback.call(route,_query,that);
      };
      if(route.oninit && $.isFunction(route.oninit)){
        route.oninit.call(route,_query,that);
      } else {}
      tabs.find('a').removeClass('active');
      tabs.find('[href="#'+hash()[0]+'"]').addClass('active');
    },
    init: function(type){
      var that = this;
      if(type && type == 'tabs'){
        that.routes.forEach(function(route){
          ctnr.append(`
            <div id="page_${route.path}">
              ${that.getPage(route.url)}
            </div>
          `);
        });
      } else {
        tabs.find('a').click(function(){
          var $ths = $(this),
              $href = $ths.attr('href');
          hash($href);
        });
      }
    },
    _init: function(){
      this.path.apply(this,hash());
    }
  };


  var _displayManager = new DisplayManager(routes);

  function LoginManager(){

  }

  LoginManager.prototype = {
    _link: function(){
      tabs.find('a').removeClass('active');
    },
    openLogin: function(){
      this._link();
      hash('login/login');
    },
    openRegister: function(){
      this._link();
      hash('login/register');
    },
    openCHpwd: function(){
      this._link();
      hash('login/chpwd');
    },
    openResetPwd: function(){
      this._link();
      hash('login/resetpwd');
    },
    openProfile: function(){
      this._link();
      hash('profile');
    }
  };

  var _loginManager = new LoginManager();

  function Page(dm,lm){
    this.dm = dm;
    this.LM = lm;
  }

  Page.prototype = {
    init: function(){
      var that = this;
      that.dm.init('hash');

      window.addEventListener('popstate',function(){
        that.dm._init();
      });
      that.dm._init();
      that.elements();
    },
    elements: function(){
      var that = this;
      $('.userprofile').click(function(){
        if(isLoggedIn){
          that.LM.openProfile();
        } else {
          that.LM.openLogin();
        }
      });
    }
  };

  function Back(){
    window.history.back();
  }

  function Forward(){
    window.history.forward();
  }

  function Reload(){
    window.location.reload();
  }


  var _page = new Page(_displayManager,_loginManager);
  _page.init();




  // This one is for you
  var JavaManager = (function JavaManager(){
    class MainActivity{
      startActivity(path){
        hash(path);
      };
      currentActivity(){
        return _displayManager.currentRoute;
      };
      closeActivity(){
        ctnr.empty();
      };
      setActivityTitle(title){
        $("#___current_title").html(title);
        document.title = title;
      };
      on(handler,fn){
        if(handler == 'p:c') handler = 'page:change';
        ctnr.on(handler,fn);
      };
      off(handler){
        if(handler == 'p:c') handler = 'page:change';
        ctnr.off(handler);
      };
      back(){Back()};
      forward(){Forward()};
      write(html,callback){
        ctnr.html(html);
        if(isFun(callback)){
          callback.call(this);
        } else {}
      };
    };
    class System{
      constructor(){
        this.out = {
          println: function(html,type){
            var $html = html;
            if(type == 'card'){
              $html = '<div class="container-fluid">'+
                        '<div class="card">'
                          +html+
                        '</div>'+
                      '</div>';
            } else {}
            ctnr.append($html);
            return $html;
          },
          print: function(text,type){
            return this.println(text.replace(/</ig,'&lt;'));
          }
        }
      }
      newHtmlElement(el){
        return $(document.createElement(el));
      }
      newNodeText(text){
        return document.createTextNode(text);
      }
      ctx(){
        return ctx;
      }
      cntr(){
        return ctnr;
      }
      template(tmp,obj){
        return MTemplate(tmp,obj,obj,obj);
      }
    };
    var info = {
      user: user,
      site: ctx.site,
      basedir: _mydir
    };
    var Java = MM.require('Java');
    MM.define('WebView',[],function(){
      function WebView(src,id){
        var $ifr = $('<iframe />',{
          src: src,
          id: id ? id : ""
        });
        $ifr.onloadurl = $ifr[0].onload;
        $ifr.loadUrl= function(src){
          $ifr.attr('src',src);
        };
        $ifr.toView = function(){
          $ifr.appendTo(ctnr);
        };
        return $ifr;
      }
      return WebView;
    });
    MM.define('FileUtils',[],function(){
      class FileUtils{
        getFile(file){
          return $http.get(file);
        }
        getJson(file){
          return $http.getJson(file,function(){});
        }
        getXml(file){
          return $http.getXml(file,function(){});
        }
      }
      return FileUtils;
    });
    MM.define('ThemeManager',[],function(){
      class ThemeManager{
        constructor(){
          this.themes();
        };
        themes(){
          var thm = this;
          // Theme Manager Init
          $('.theme-changer').each(function(){
            var $ths = $(this),
                $icon = $ths.find('i'),
                $icondark = $icon.data('dark'),
                $iconlight = $icon.data('light');

            $ths.click(function(e){
              e.preventDefault();
              thm.toggleTheme(ResetIcon);
            });
            function ResetIcon(theme){
              if(theme == 'dark'){
                $icon.text($icondark);
              } else {
                $icon.text($iconlight);
              }
            };
            $.ajax('_php/theme_manager.php?act=get').done(function(data){
              ResetIcon(data);
            });
          });
        };
        toggleTheme(done){
          var thm = this;
          thm.startAnim();
          $.ajax('_php/theme_manager.php?act=get').done(function(data){
            if(data == 'dark'){
              $.ajax('_php/theme_manager.php?act=set&theme=light');
            } else {
              $.ajax('_php/theme_manager.php?act=set&theme=dark');
            }
            var theme = data == 'dark' ? 'light' : 'dark';
            var $currentTheme = info.basedir+"css/theme-"+theme+".css";
            $("#ThemeCss").attr('href',$currentTheme);
            done(theme);
          });
        };
        startAnim(){
          $("body").append('<div class="point-to-page active" id="ThemeHider"></div>');
          var $thhider = $("body").find("#ThemeHider");
          setTimeout(function() {
            $thhider.removeClass('active');
          }, 700);
          setTimeout(function() {
            $thhider.remove();
          }, 1200);
        };
      };
      return ThemeManager;
    });
    var JavaActivity = Java.call(_page,MainActivity,new System(),routes,info);
    var Main = new JavaActivity(new MainActivity());
    delete MM.modules.FileUtils;
    delete MM.modules.WebView;
    delete MM.modules.ThemeManager;
    return Main;
  })();
  delete window.MM;
  //$log('Page Loaded');
})();