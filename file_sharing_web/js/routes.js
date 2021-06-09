/*
	
	So sorry, but this one may be hard

*/


MM.define('Routes',[],function(r,i){
  function routes(ctx,_mydir,user,getPosts,view,user,isLoggedIn,
  	MTemplate,Template,$http,M,dbm,http,template,log,_profile_template,ActionSheet){
		return [
  {
    "path": "home",
    "url": view('home'),
    "title": "Home",
    "transparent": true
  },{
    "path": "catagories",
    "url": view('cat'),
    "title": "Catagories",
    "displayEntries": function(json,query,list){
    	var that = this;
      list.empty();
      function append(post){
        dbm.getuseracc(post.username,function(_user){
          post.fullname = _user.name;
          post.pp = _user.pp;
          post.isUser = post.username == user.username;
          post.linktrimmed = trimLink(post.link);
          list.append(MTemplate(M.templates.post,post,post,post));
        });
      }
      function display(catagory,type,arr){
        arr.forEach(function(post,index){
          if(catagory != "all" && type != "all"){
            if(post.type == type && post.catagory == catagory){
              append(post);
            } else {}
          } else {
            append(post);
          }
        });
      }
      if(json instanceof Array){
        if(query){
          display(query.split('/')[0],query.split('/')[1],json);
          if(query != 'all/all') that.setTitle(that.ctitle+'/'+query);
        } else {
          display('all','all',json);
        }
      } else {}
    },
    "oninit": function(query){
    	var sort = "reverse";
      const _list = $("#list");
      var q = query;
      if(!query) q = null;
      var that = this;
      $('.fiterBtn').off('click');
      $('.fiterBtn').on('click',function(){
        $('.tab-content .tab-pane').removeClass('active');
        $("#"+ $(this).attr('filter')).addClass('active');
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
      });
      $('.fiterBtnAll').click(function(){
      	$('.tab-content .tab-pane').removeClass('active');
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
      });
      $('.sortBtn').off('click');
      $('.sortBtn').on('click',function(){
      	sort = $(this).attr('sort');
      	$('.sortBtn').removeClass('active');
      	$(this).addClass('active');
      	GetPosts();
      });
      function GetPosts(){
	      getPosts(function(e){
	        var a;
	        e = e.sort(function(a,b){
	        	return b.id_post - a.id_post;
	        });
	        if(sort == "reverse"){
	          a = e;
	        } else {
	          a = e.reverse();
	        };
	        that.displayEntries(a,q,_list);
	      });
	    }
	    GetPosts();
    }
  },{
    "path": "post",
    "title": "Post",
    "url": view('post'),
    "oninit": function(query){
      getPosts(function(e){
        var post = e.find(function(post){
          return post.id_post == query;
        });
        $("#post").html(`
        	<div class="app-card">
        		<div class="permissions">
        			<h5>${post.name}</h5>
        			${parsePost(post.about)}
        		</div>
        	</div>
        	`);
        $("#post").append(`
          <br><br>
          <div>
            <a href="#iframe&${post.link}" class="btn button w-100">
              View Link
            </a>
            <br>
            <br>
            <a href="${post.link}" class="btn button w-100">
              Open Link
            </a>
          </div>`);
      });
    }
  },{
    "path": "cont",
    "url": view('cont'),
    "title": "Contribute",
    "oninit": function(){
      const _form = $("#share_form");
      function displayEntries(type){
        if(ctx.catagories[type]){
          $("#type").empty();
          ctx.catagories[type].forEach(function(c,i){
            $("#type").append(`
              <option value="${c.value}">${c.title}</option>
            `);
          });
        } else {}
      }
      $("#catagory").on('change',function(){
        displayEntries($(this).val());
      });
      $("#type").on('change',function(){
      	var type = $(this).val();
      	var link = $("#link");
      	if(type == 'ict'){
      		link.attr('placeholder','Google Drive/GitHub Link');
      	} else {
      		link.attr('placeholder','Google Drive Link');
      	}
      });
      displayEntries('natural');
      _form.off('submit');
      _form.on('submit',function(e){
        var _name = $("#filename").val();
        var _link = $("#link").val();
        var _cat = $("#catagory").val();
        var _about = $("#about").val().trim().replace(/</ig,'&lt;');
        var _type = $("#type").val();
        e.preventDefault();
        if(!httpreg.test(_link)){
          $log('The link is not a valid url','error');
          $("#link").focus();
          return;
        } else {}
        dbm.post(_name,_link,_type,_cat,_about,function(e){
          var a = JSON.parse(e);
          if(a[0] == "ERROR"){
            $log(a[1],'error');
          } else {
            $log('Posted!! just a matter of time till it show up');
            hash('catagories');
          }
        });
      });
    }
  },{
    "path": "login/login",
    "url": view('login'),
    "title": "Login",
    "oninit": function(query){
      const _form = $("#login_form");
      var _uname = $("#username");
      var _password = $("#password");
      if(query && query.match(',')){
        query = query.split(',');
        _uname.val(query[0]);
        _password.val(query[1]);
        $log('Just Submit now');
      } else {}
      $("#forgot_password").click(function(e){
        e.preventDefault();
        if(_uname.val().trim() == "") hash('login/resetpwd');
        dbm.getuseracc(_uname.val(),function(user){
          if(user.email){
            hash('login/resetpwd&'+user.email);
          } else {
            hash('login/resetpwd');
          }
        });
      });
      _form.off('submit');
      _form.on('submit',function(e){
        e.preventDefault();
        var _un = _uname.val();
        var _pwd = _password.val();
        dbm.login(_un,_pwd,function(e){
          var a = JSON.parse(e);
          if(a[0] == "ERROR" && a.length > 3 && a[2] == 'error_from_auth'){
            $log(a[1],'error');
          } else {
            hash('home');
            window.location.reload();
          }
        });
      });
    }
  },{
    "path": "login/register",
    "url": view('register'),
    "title": "Register",
    "oninit": function(){
      const _form = $("#register_form");
      var _uname = $("#username");
      var _email = $("#email");
      var _name = $("#name");
      var _password = $("#password");
      var _university = $("#university");
      _form.off('submit');
      _form.on('submit',function(e){
        e.preventDefault();
        var _un = _uname.val();
        var _pwd = _password.val();
        var _em = _email.val();
        var _nm = _name.val();
        var _uni = _university.val();
        dbm.register(_nm,_em,_uni,_un,_pwd,function(e){
          log(e);
          var a = JSON.parse(e);
          if(a[0] == "ERROR" && a.length > 3 && a[2] == 'error_from_auth'){
            $log(a[1],'error');
          } else {
            hash('login/confirm&'+a[0]);
          }
        });
      });
    }
  },{
    "path": "login/confirm",
    "url": view('confirm'),
    "title": "Confirm Account Code",
    "oninit": function(query){
      const _form = $("#confirmation_form");
      _form.off('submit');
      _form.on('submit',function(e){
        e.preventDefault();
        dbm.confirm($("#code").val(),function(e){
          var a = JSON.parse(e);
          if(a[0] == "ERROR"){
            $log(a[1],'error');
          } else {
            $log('Just login with your information now');
            hash('login/login');
          }
        });
      });
      if(query){
        $("#code").val(query);
        _form.trigger('submit');
      } else {}
    }
  },{
    "path": "login/resetpwd",
    "url": view('resetpwd'),
    "title": "Reset Password",
    "oninit": function(query){
      const _form = $("#resetpwd_form");
      _form.off('submit');
      if(query) $("#email").val(query);
      _form.on('submit',function(e){
        var email = $("#email").val();
        e.preventDefault();
        dbm.resetpwd(email,function(e){
          log(e);
          var a = JSON.parse(e);
          if(a[0] == "ERROR"){
            $log(a[1],'error');
          } else {
            hash('login/login');
            $log('Email sent');
          }
        });
      });
    }
  },{
    "path": "login/chpwd",
    "url": view('chpwd'),
    "title": "Change Password",
    "oninit": function(){
      const _form = $("#changepwd_form");
      _form.off('submit');
      _form.on('submit',function(e){
        var oldpwd = $("#oldpwd").val();
        var newpwd = $("#newpwd").val();
        e.preventDefault();
        dbm.chpwd(oldpwd,newpwd,function(e){
          var a = JSON.parse(e);
          if(a[0] == "ERROR"){
            $log(a[1],'error');
          } else {
            $log('Password Updated');
            hash('home');
          }
        });
      });
    }
  },{
    "path": "login/logout",
    "url": view('logout'),
  },{
    "path": "aboutus",
    "url": view('about'),
    "transparent": true,
    "title": "About Us"
  },{
    "path": "chats",
    "url": view('chats'),
    "title": "Chats",
    "oninit": function(){
    	var currentMsgs = [];
    	var messages = $("#Messages");
    	var msgi = $("#MessageInput");
      msgi.insertText = function(text){
        var theValue = msgi.val();
        msgi.val(theValue + " " + text);
      }
    	var btn = $("#Send");
      var emoticons = $('.emoticons');
      emoticons.off('click');
      emoticons.each(function(){
        $(this).click(function(){
          var ac = new ActionSheet([
            {
              text: "<b>Bold</b>",
              onclick: function(){
                msgi.insertText('@bold:text');
              },
            },{
              text: "Link",
              onclick: function(){
                msgi.insertText('@link:url,text');
              },
            },{
              text: "<del>Deleted</del>",
              onclick: function(){
                msgi.insertText('@del:text');
              },
            },{
              text: "<u>Underline</u>",
              onclick: function(){
                msgi.insertText('@underline:text');
              },
            },{
              text: "<i>Italic</i>",
              onclick: function(){
                msgi.insertText('@italic:text');
              },
            },{
              text: "User",
              onclick: function(){
                msgi.insertText('@user:username');
              },
            },{
              text: "Date",
              onclick: function(){
                msgi.insertText('@date:day');
              },
            },{
              text: "Post",
              onclick: function(){
                msgi.insertText('@post:id');
              },
            },{
              text: "Test",
              onclick: function(){
                msgi.insertText('@test:id');
              },
            },
          ],{
            onclose: function(sheet){
              sheet.remove();
            }
          }).open();
        });
      });
    	btn.click(function(){
    		var msg = msgi.val();
    		dbm.sendMessage(user,msg,function(e){
    			var a = JSON.parse(e);
          if(a[0] == "ERROR"){
            $log(a[1],'error');
          } else {
            msgi.val('');
          }
    		});
    	});
    	function parseMsg(msg){
				var _msg,_msgs,
				_words = "",_links = "",_spds = "",
				pds = "",fs,lt,s,parsed = "";
				_msg = msg.replace(/\n/ig,' \n')
									.replace(/&lt;br>/ig,'\n')
									.replace(/#@br@#/ig,'\n');

				var httpPattern = /\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~+|!:,.;]*[-a-z0-9+&@#\/%?=~_|]/i;
				var atPattern = /^@(\w+)\:(\w+)/i;

				var keys = ["link","italic","post","test","user","underline","del","bold","date"];
				var _key_fn = {
					link: function(word){
						var _word = word.split(',');
						if(!_word[1]) _word[1] = 'Link';
						if(httpPattern.test(_word[0])){
							_word = '<a href="'+_word[0]+'"> '+_word[1]+' </a> ';
						} else {
							_word = '<a href="http://'+_word[0]+'"> '+_word[1]+' </a> '
						}
						return _word;
					},
					italic: function(word){
						var _word = '<i> '+word+' </i> ';
						return _word;
					},
					post: function(word){
						var _word = '<a href="#post&'+word+'">'+word+'</a>';
						return _word;
					},
					test: function(word){
						var _word = '<a href="#test&'+word+'">'+word+'</a>';
						return _word;
					},
					user: function(word){
						var _word = '<a href="#userprofile&'+word+'">'+word+'</a>';
						return _word;
					},
					underline: function(word){
						var _word = '<u> '+word+' </u> ';
						return _word;
					},
					del: function(word){
						var _word = '<del> '+word+' </del> ';
						return _word;
					},
					bold: function(word){
						var _word = '<b> '+word+' </b> ';
						return _word;
					},
					date: function(word){
						var _word = new Date();
						var tm = new Manager.TM();
						if(word == 'day'){
							_word = tm.getDayName(tm.time.day());
						} else if(word == 'year'){
							_word = tm.time.fullYear();
						} else if(word == 'full'){
							_word = tm.time.locD();
						} else {
							_word = new Date();
						}

						return _word;
					}
				};

				function parseKey(word){
					var _word = word.replace(/@/ig,'').split(':');
					if(_word[2]){
						_word[1] = _word[1] + ":" + _word[2];
					} else {}
					return [_word[0].toLowerCase(),_word[1]]
				}

				_msgs = _msg.split(' ');
				if(_msgs.length > 0){
					_msgs.forEach(function(word,index){
						var _word = word + " ";
						if (atPattern.test(word)){
							keys.forEach(function(key,index){
								var _key = parseKey(word);
								if(_key[0] == key){
									_word = _key_fn[key](_key[1]);
								} else {}
							});
						} else if(httpPattern.test(word)){
							_word = '<a href="'+word+'"> '+word+' </a> ';
							_links += _word;
						} else {
							_words += _word;
						}
						_spds += _word;
					});
					pds = _spds;
				} else {
					pds = _msg;
				}

				parsed = pds.replace(/\n/ig,'<br>');

				return parsed;
			}
    	function getTime(tstr){
				var regex = /(\w+):(\w+):(\w+)/;
				var _tstr = tstr.split(' '),r;
				if(regex.test(_tstr[3])){
					r = _tstr[3];
				} else {
					_tstr.forEach(function(timestr){
						if(regex.test(timestr)){
							r = timestr;
						} else {}
					});
				}
				r = r.split(":");
				r = r[0]+":"+r[1];
				return r;
			}
			function focusLast(i){
				messages.children().last().find('input').focus();
				msgi.focus();
			}
    	function appendMsg(msg,i){
      	msg.user = user;
      	msg.isUser = (msg.username == user.username);
      	msg._mydir = _mydir;
      	msg.time = getTime(msg.ctime);
      	msg.message = parseMsg(msg.message);
      	messages.append(MTemplate(M.templates.chat,msg,msg,msg));
      	focusLast(i);
      }
    	dbm.chatMessages(function(e){
    		var a = JSON.parse(e);
        if(a[0] == "ERROR"){
          $log(a[1],'error');
        } else {
        	currentMsgs = a;
        	function LoadAll(){
	        	window.ChatsTimeOut = setInterval(function(){
	        		if(window.ChatsTimeOut.ajax) window.ChatsTimeOut.ajax.abort('null');
	        		window.ChatsTimeOut.ajax = dbm.chatMessages(function(e){
	    					var a = JSON.parse(e);
	    					if(a.length != currentMsgs.length){
	  							if(currentMsgs.length > a.length){
	  								LoadAll();
	  							} else if (a.length > currentMsgs.length) {
	  								var len = currentMsgs.length,newOnes = [];
	  								currentMsgs = a;
	  								for (var i = len; i < a.length; i++) {
	  									newOnes.append(a[i]);
	  								}
	  								newOnes.forEach(appendMsg);
	  							} else {}
	    					} else {};
	    				});
	        	},3000);
	        	messages.empty();

	          currentMsgs.forEach(appendMsg);
	        };
	        LoadAll();
        }
    	});
    },
    "onexit": function(){
    	clearInterval(window.ChatsTimeOut);
    }
  },{
    "path": "profile",
    "url": view('profile'),
    "title": "Profile",
    "oninit": function(){
    	if(!isLoggedIn){
    		hash('login/login');
    		return;
    	};
      dbm.getuseracc(user.username,function(_user){
        var _html = _profile_template('profile');
        _html = MTemplate(_html,_user,_user,_user);
        $("#__profile").html(_html);
        $("#profile-picture").click(function(){
          var url = _mydir+'_php/uploadpp.php';
          var types = 'jpg,png,gif,webp,img,jpeg,ico,svg';
          hash('upload&'+types+'\\'+url+'\\single');
        });
      });
    }
  },{
    "path": "userprofile",
    "url": view('profile'),
    "title": "User Profile",
    "oninit": function(query){
      dbm.getuseracc(query,function(_user){
        if(_user.username == user.username){
          hash('profile');
        } else {
          var _html = _profile_template('userprofile');
          _html = MTemplate(_html,_user,_user,_user);
          $("#__profile").html(_html);
          $('.openavatar').click(function(){
          	window.open(this.src);
          });
        }
      });
    }
  },{
    "path": "upload",
    "url": view('upload'),
    "oninit": function(query){
      var accepts = query.split('\\')[0];
      var url = query.split('\\')[1];
      var multi = query.split('\\')[2];
      var dz = $("#dropzoneContr");
      var Dz = dz.dropzone({
        url: url,
        success: function(e){
          hash('profile');
          window.location.reload();
        },
        error: function(a,e){
          $log(a+" "+e,'error')
        },
        width: dz.width(),
        height: dz.height(),
        uploadMode: multi,
        text: 
          `<div class="dz-default dz-message">
            <div class="dz-icon icon-wrap icon-circle icon-wrap-md"> 
            <i class="fa fa-cloud"></i> </div>
            <div>
              <p class="dz-text">Drop files to upload</p>
              <p class="text-muted">or click to pick manually</p>
          </div>
          </div>`,
        border: "none",
        allowedFileTypes: accepts
      });
    }
  },{
    "path": "star/star",
    "url": view('empty'),
    "oninit": function(query){
      dbm.star(query,function(){
        $log('Starred '+query);
        hash("userprofile&"+query);
      });
    }
  },{
    "path": "star/unstar",
    "url": view('empty'),
    "oninit": function(query){
      dbm.unstar(query,function(){
        $log('Unstarred '+query,"error");
        hash("userprofile&"+query);
      });
    }
  },{
    "path": "search",
    "url": view('search'),
    "oninit": function(query){
      if(query){
        dbm.search($("#list"),query,function(){});
      } else {}
      $("#SearchInput").on('keydown',function(e){
      	var keyboardKey = e.which || e.keyCode;
        if(keyboardKey == 13){
        	hash('search&'+ $("#SearchInput").val());
        } else {}
      });
    },
    "title": "Search"
  },{
    "title": "Contribute/Test",
    "path": "cont/sharetest",
    "url": view('share_test'),
    "oninit": function(){
      const _form = $("#share_form");
      function displayEntries(type){
        if(ctx.catagories[type]){
          $("#subject").empty();
          ctx.catagories[type].forEach(function(c,i){
            $("#subject").append(`
              <option value="${c.value}">${c.title}</option>
            `);
          });
        } else {}
      }
      $("#catagory").on('change',function(){
        displayEntries($(this).val());
      });
      displayEntries('natural');
      _form.off('submit');
      _form.on('submit',function(e){
        var _name = $("#filename").val();
        var _link = $("#link").val();
        var _cat = $("#catagory").val();
        var _about = $("#about").val().trim().replace(/</ig,'&lt;');
        var _type = $("#type").val();
        var _subject = $("#subject").val();
        var _year = $("#year").val();
        e.preventDefault();
        if(!httpreg.test(_link)){
          $log('The link is not a valid url','error');
          $("#link").focus();
          return;
        } else {}
        dbm.test(_name,_link,_year,_type,_cat,_subject,_about,function(e){
          var a = JSON.parse(e);
          if(a[0] == "ERROR"){
            $log(a[1],'error');
          } else {
            $log('Posted!! just a matter of time till it show up');
            hash('tests');
          }
        });
      });
    }
  },{
    "title": "Tests",
    "path": "tests",
    "url": view('tests'),
    "oninit": function(){
      const list = $("#list");
      dbm.tests(function(e){
        var a = JSON.parse(e);
        if(a[0] == "ERROR"){
          $log(a[1],'error');
        } else {
          a.forEach(function(test){
            test.isUser = test.username == user.username;
            test.linktrimmed = trimLink(test.link);
            list.append(MTemplate(M.templates.test,test,test,test))
          });
        }
      });
    }
  },{
    "path": "iframe",
    "url": view("iframe"),
    "oninit": function(query){
      if(!query) hash("home");
      if(!httpreg.test(query)) hash('home');
      $("#iframe").attr('src',query);
    }
  },{
    "path": "test",
    "title": "Test",
    "url": view('post'),
    "oninit": function(query){
      dbm.tests(function(e){
        var a = JSON.parse(e);
        if(a[0] == "ERROR"){
          $log(a[1],'error');
        } else {
          var test = a.find(function(test){
            return test.id_test == query;
          });
          $("#post").html(`
        	<div class="app-card">
        		<div class="permissions">
        			<h5>${test.name}</h5>
        			${parsePost(test.about)}
        		</div>
        	</div>
        	`);
          $("#post").append(`
            <br><br>
            <div>
              <a href="#iframe&${test.link}" class="btn button w-100">
                View Link
              </a>
              <br>
              <br>
              <a href="${test.link}" class="btn button w-100">
                Open Link
              </a>
            </div>`);
        }
      });
    }
  },{
    "title": "Ranks",
    "path": "ranks",
    "url": view('ranks'),
    "oninit": function(){
      dbm.getUsers(function(users){
      	$("#list").empty();
        users.sort(function(a,b){
          return b.posts - a.posts && b.stars - a.stars;
        });
        users.forEach(function(user,index){
          user.index = (index + 1);
          user.pp = user.pp == "custom" ? _mydir+"userprofiles/"+user.username
          +"/pp.png" : _mydir+"res/avatar.png";
          $("#list").append(MTemplate(`
            <a href="#userprofile&{{username}}" class="item-sup">
              <img class="avatar-md" src="{{pp}}" data-toggle="tooltip" data-placement="top" title="{{username}}" alt="avatar">
              <div class="data">
                <h5>{{name}}</h5>
                <p>From {{university}}</p>
              </div>
            </a>
          `,user,user,user));
        });
      }); 
    }
  },{
    "path": "deletepost",
    "url": view('empty'),
    "oninit": function(query){
      if(!query) Back();
      query = query.split(',');
      var type = query[0];
      var id = query[1];
      var setHtml = this.setHtml;
      var fn = {
        post: function(done){
          getPosts(done);
        },
        test: function(done){
          dbm.tests(function(e){
            done(JSON.parse(e));
          });
        }
      };
      if(type in fn){
        fn[type](function(items){
          var item = items.find(function(item){
            return item["id_"+type] == id;
          });
          if(!item){
            Back();
            $log('No Post/test with the given id','error');
            return;
          };
          if(!item.username == user.username){
            $log('This is not ur post','error');
            return;
          };
          setHtml(MTemplate(`
            <div class="container-fluid">
              <div class="card">
                <h3>Delete {{name}}?</h3>
                <p>Are you sure to delete {{name}}?</p>
                <button class="btn button w-100 bg-danger DeleteButton">
                  Delete It!!
                </button>
                <br><br>
                <button class="btn button w-100 CancelButton">
                  Cancel
                </button>
              </div>
            </div>
          `,item,item,item),function(){
            $(".DeleteButton,.CancelButton").click(function(){
              Back();
              $(".DeleteButton,.CancelButton").off('click');
            });
            $(".DeleteButton").click(function(){
              dbm.deletePost(type,id,item.username);
            });
          });
        });
      } else {
        $log("An Error Occured",'error');
      }
    }
  },{
    "path": "report",
    "url": view("empty"),
    "title": "Report",
    "oninit": function(query){
      if(!query) {Back(); return;};
      var q = query.split(',');
      var uname = q[0];
      var id = q[1];
      var type = q[2];
      var fn = {
        post: function(done){
          getPosts(done);
        },
        test: function(done){
          dbm.tests(function(e){
            done(JSON.parse(e));
          });
        }
      };
      var setHtml = this.setHtml;
      if(type != "post" && type != "test") {Back(); return;};
      if(fn[type]){
        fn[type](function(items){
          var item = items.find(function(item){
            return item["id_"+type] == id;
          });
          log(item);
          if(!item) {Back(); return;};
          setHtml(MTemplate(`
            <div class="container-fluid">
              <div class="container content">
                <h3>Report {{name}}</h3>
                <form id="form_comment">
                  <div class="field">
                    <textarea id="msg" name="msg" type="text" class="form-control"
                    placeholder="Message..."></textarea>
                  </div>

                  <button class="btn button w-100" type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          `,item,item,item),function(){
            $('#form_comment').on('submit',function(e){
              e.preventDefault();
              dbm.report(item.username,
              $("#msg").val(),id,type,item.name,item.link,user.username,function(e){
                Back();
                $log('Reported ' + item.name);
                $('#form_comment').off('submit');
              });
            });
          });
        });
      } else {
        $log('An Error Occured','error');
      }
    }
  }
	];
	}

	return routes;
});