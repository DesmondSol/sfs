MM.define('M',['http','template'],function(r,i,http,template){
	const $http = new http();
	const Mtemplate = template[1];
	var _templates = {
		'toast': `<div class="alert alert-{{theme}} alert-fixed _alert_toast {{classes}}" id="{{id}}">
        <div class="container">
        	{{#if icon}}
	          <div class="alert-icon">
	            <i class="material-icons">{{icon}}</i>
	          </div>
	        {{/if}}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true"><i class="material-icons">clear</i></span>
          </button>
          {{html}}
        </div>
      </div>`,
    "modal": `<div class="modal fade" id="{{id}}" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
      	{{html}}
      </div>
    </div>
  </div>`,
	};

	var M = new (function M(){})();

	M.AutoInit = function AutoInit(){

	};

	M.toast = function Toast(op){
		var options = $.extend({}, {
			html: "",
			icon: null,
      displayLength: 4000,
      classes: "",
      theme: "info",
      completeCallback: function(){},
    }, op),currentBottom = 10;

		if(toastr[options.theme]){
			toastr[options.theme](options.html,null,{
				"timeOut": options.displayLength,
				"positionClass": "toast-bottom-right",
			});
		} else {}
	};

	M.modal = function Modal(html){
		var $m,m = {html: html};
		var id = "modal_" + $(".modal").length;
		m.id = id;
		$('body').append(Mtemplate(_templates.modal,m,m,m));
		$("#"+id).modal();
		$m = $("#"+id);
		return $m;
	}

	M.modal.closeModalByID = function(id){
		$("#modal_"+id).modal();
	}

	M.Tabs = function Tabs(el){
		var $el;
    if(typeof el == "string"){
      $el = $(el);
    } else {
      if(el instanceof jQuery){
        $el = el;
      } else if(el instanceof HTMLElement){
        $el = $(el);
      } else {
        return false;
      }
    }
    return $el;
	}

	M.inputs = function TextInputs(){
	}

	M.templates = {
		chat: `
		<div class="message {{#if isUser}}me{{/if}}">
			{{#if isUser.equals(false)}}
				<a href="#userprofile&{{username}}">
					<img class="avatar-md" src="{{pp}}" data-toggle="tooltip" data-placement="top" title="{{name}}" alt="avatar">
				</a>
			{{/if}}
			<div class="text-main">
				<div class="text-group {{#if isUser}}me{{/if}}">
					<div class="text {{#if isUser}}me{{/if}}">
						<p>{{message}}</p>
					</div>
				</div>
				<span>{{time}}</span>
				<input type="input" style="width:0.0009;height:0.0009;opacity:0;">
			</div>
		</div>
		`,
		post: 
			`<div class="app-card">
				<div class="permissions">
					<h5>{{name}} #{{id_post}}</h5>
					<p>By <a href="#userprofile&{{username}}">{{fullname}}</a> 
            from {{university}}</p>
          <p>Visit: <a href="{{link}}">{{linktrimmed}}</a></p>
          <br>
          <a href="#post&{{id_post}}" class="btn attach"><i class="material-icons">info</i></a>
          {{#if isUser}}
          	<a href="#deletepost&post,{{id_post}}" class="btn attach"><i class="material-icons">delete</i></a>
					{{else}}
						<a href="#report&{{username}},{{id_post}},post" class="btn attach"><i class="material-icons">bug_report</i></a>
					{{/if}}
				</div>
			</div>
    `,
  	test:
  		`<div class="app-card">
				<div class="permissions">
					<h5>{{name}} #{{id_test}}</h5>
					<p>By <a href="#userprofile&{{username}}">{{username}}</a> 
            from {{university}}</p>
          <p>Visit: <a href="{{link}}">{{linktrimmed}}</a></p>
          <br>
          <a href="#test&{{id_test}}" class="btn attach"><i class="material-icons">info</i></a>
          {{#if isUser}}
          	<a href="#deletepost&test,{{id_test}}" class="btn attach"><i class="material-icons">delete</i></a>
					{{else}}
						<a href="#report&{{username}},{{id_test}},test" class="btn attach"><i class="material-icons">bug_report</i></a>
					{{/if}}
				</div>
			</div>`
	}

	window.empty = function(variable){
		if(!isset(variable)) return false;
		return variable == "" || variable == {} || variable == [] || variable == function(){};
	}
	window.isset = function(variable){
		return null != variable;
	}
	Array.prototype.append = Array.prototype.push;
	Array.prototype.prepend = Array.prototype.unshift;
	String.prototype.equals = Number.prototype.equals = Boolean.prototype.equals = Array.prototype.equals
	= function isEqual(variable){
		var bool = true;
		var m = this.valueOf();
		var notp = typeof m != 'string' && typeof m != 'number' && typeof m != 'boolean';
		if(m instanceof Array && typeof m == 'object' && notp){
			if(typeof variable != 'object' && !variable instanceof Array) return false;
			m.forEach(function(item,index){
				if(typeof variable[index] == 'function' && typeof item == 'function'){
					bool = bool && true;
				} else {
					if(!variable[index]) {bool = bool && false; return;};
					bool = bool && variable[index].equals(item);
				}
			});
		} else if(m instanceof Object && typeof m == 'object' && notp){
			if(typeof variable != 'object' || variable instanceof Array || notp == false) return false;
			for(var i in m){
				if(typeof variable[i] == 'function' && typeof m[i] == 'function'){
					bool = bool && true;
				} else {
					bool = bool && (i in variable && m[i].equals(variable[i]));
				}
			}
		} else if(!notp){
			bool = variable == m;
		} else {
			bool = variable == m;
		}


		return bool;
	}
	window.isFun = function(fn){
		return typeof fn == "function";
	}
	window.isNum = function(s){
		return typeof s == "number";
	}
	window.isNull = function(s){
		return typeof s == "null";
	}
	window.isStr = function(s){
		return typeof s == "string";
	}
	window.isBool = function(s){
		return typeof s == "boolean";
	}
	window.isUnd = function(s){
		return typeof s == "undefined";
	}
	window.trimLink = function(link){
		return link.split('//')[1].split('/')[0];
	}
	window.parsePost = function(about){
		about = about.replace(/\n/g,"<br>");
		return about;
	}
	window.parseData = function(data){
		var $data;
		if(data.toLowerCase().indexOf("error")){
			$data = data.replace(/\n/g,"<br>")
		} else {
			$data = data;
		}
		return $data;
	}
	window.httpreg = /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~+|!:,.;]*[-a-z0-9+&@#\/%?=~_|]/i;
	window.$log = function(text,theme,classes,callback,delay){
    var classesForToast = "theme_color";
    var disPLAYLEN = 4000;

    if(classes){
      classesForToast += " " + classes;
    } else {
      classesForToast = classesForToast;
    }

    if(delay){
      disPLAYLEN =  delay;
    } else {
      disPLAYLEN = 4000;
    }

    return M.toast({
      html: text,
      displayLength: disPLAYLEN,
      theme: theme ? theme : "info",
      classes: classesForToast,
      completeCallback: callback
    });
  };


  window.hash = function Hash($hash){
    if(Query()) Query(''); 
    if($hash){
       window.location.hash = $hash;
    } else {}
    var hash = window.location.hash.replace('#','');
    if(hash.match(/&/ig))
      hash = hash.split('&');
    else 
      hash = [hash];
    return hash;
  };
  window.Query = function($search){
    if($search){
       window.location.search = $search;
    } else {}
    var search = window.location.search.replace('?',''),srch;
    if(search == '') return null;
    if(search.match(/&/ig))
      srch = search.split('&');
    else 
      srch = [search];

    search = {};

    srch.forEach(function(q){
      var query = q.split('=');
      search[query[0]] =  query[1];
    });

    return search;
  };

	return M;
});