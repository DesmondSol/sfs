window.MM = new (function ModuleManager() {

  window.onerror = function(a,b,c,d){
    window.toastr.error(a+" at "+b+" on line  "+c+":"+d,'Error',{
      "positionClass": "toast-bottom-right"
    });
  }
  
  this.modules = new (function Modules(){
    this.__proto__ = new (function ModulesProto(){
      var p = this;
      p.add = function AddModule(name,value){
        modules[name] = value;
      };
      p.remove = function AddModule(name){
        delete modules[name];
      };
    })();
  })();
  var modules = this.modules;

  // require a module
  function require(name) {
    return modules[name];
  }

  // import a script
  function _import(name,from) {
    var _m = require(name);
    if(_m == null){
      var script = document.createElement('script');
      script.src = from;
      $(script).appendTo('head');
      _m = require(name);
    } else {}
    return _m;
  }

  // define a module
  function define(name, dependencies, implementation) {
    var deps = [require,_import];
    for (var i = 0; i < dependencies.length; i++) {
      deps.push(modules[dependencies[i]]);
    }
    modules.add(name,implementation.apply(implementation, deps));
  }

  this.__proto__ = new (function ModuleManagerProto(){
    this.require = require;
    this.define = define;
    this.import = _import;
  })();

})();
