MM.define('http',[],function(){

  function err404(file){
    throw new Error(file + " Not Found");
  }

	function http(file){
    if(file){
      return this.get(file);
    } 

    if(this == null){
      return null;
    }
  }

  http.prototype = {
    get: function(file){
      var that = this,returned;
      new Promise(function(){
        that.open(file,function(){
          if (this.readyState == 4) {
            if (this.status == 200) {returned =  this.responseText;}
            if (this.status == 404) {returned =  "File not found.";err404(file);}
          }
        });
      });
      return returned;
    },

    open: function(target, readyfunc, xml, method){
      var that = this;
      var httpObj;
      return new Promise(function(){
        if (!method) {method = "GET"; }
        if (window.XMLHttpRequest) {
          httpObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
          httpObj = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
          return;
        }
        if (httpObj) {
          if (readyfunc) {httpObj.onreadystatechange = readyfunc;}
          httpObj.open(method, target, false);
          httpObj.send(null);
        }
      });
    },

    getJson: function (file, func) {
      var that = this,JsonObject;
      that.open(file, function () {
        if (this.readyState == 4 && this.status == 200) {
          func(JSON.parse(this.responseText));
          JsonObject = JSON.parse(this.responseText);
        } else if(this.status == 404){
          err404(file);
          JsonObject = 404;
        } else {
          JsonObject = this.status;
        }
      });
      return JsonObject;
    },

    getXml: function (file, func) {
      var that = this,XMLDoc;
      that.open(file, function () {
        if (this.readyState == 4 && this.status == 200) {
          func(this.responseXML);
          XMLDoc = this.responseXML;
        } else if(this.status == 404){
          err404(file);
          XMLDoc = 404;
        } else {
          XMLDoc = this.status;
        }
      });

      return XMLDoc;
    },

    http: XMLHttpRequest,

    ajax: $.ajax,
  };

  return http;
});