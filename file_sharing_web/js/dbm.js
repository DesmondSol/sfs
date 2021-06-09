/**
 * @author kevinj045/mohammed
 * @version 3.1.7
 * This file is for the serverside javascript, this is the database manager,
 * This file will take care of: posting,logging in,registering...
 * i could make it a java class like:

	class DBM{
		constructor(){
			...
		}
		login(username,password){
			...
		}
	}
	
 * but it may not be compatible everyhere like Function.prototype
 * you can edit it if you want
*/
MM.define('DBM',['http','template','M'],function(r,i,http,template,M){
	const Template = template[1];
	const $http = new http();
	const _INIT = this;
	const _mydir = window.BaseDir;
  const log = console.log;

	function DBM(){
		this.init.apply(this,arguments);
	}

	function DBMProto(){
		var proto = this;
		proto.init = function(){

		}
		proto.login = function(username,password,done){
			proto._showLoading('Logging in');
      $.ajax({
        url: _mydir+"_php/login/api/login_api.php",
        method: "POST",
        data: "submitted=true&username="+username+"&password="+password,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
		}

		proto.post = function(name,link,type,cat,about,done){
			proto._showLoading('Posting post');
			var data = "submitted=true&"+
      "name="+name+"&about="+about+"&catagory="+cat+
      "&link="+link+"&type="+type;
      $.ajax({
        url: _mydir+"_php/share/api.php",
        method: "POST",
        data: data,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
		}

    proto.test = function(name,link,year,type,cat,subject,about,done){
      var data = "act=post&submitted=true&"+
      "name="+name+"&about="+about+"&catagory="+cat+"&subject="+subject+
      "&link="+link+"&type="+type+"&year="+year;
      $.ajax({
        url: _mydir+"_php/tests/api.php",
        method: "POST",
        data: data,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
    };

    proto.tests = function(done){
      $.ajax({
        url: _mydir+"_php/tests/api.php",
        method: "POST",
        data: "act=get",
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
    };

		proto.register = function(nm,em,uni,un,pwd,done){
			proto._showLoading('Registering User');
      var data = "submitted=true&name="+nm+"&email="+em+"&university="
      +uni+"&username="+un+"&password="+pwd;
      $.ajax({
        url: _mydir+"_php/login/api/register_api.php",
        method: "POST",
        data: data,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
		}

		proto.confirm = function(code,done){
			proto._showLoading('Confirming Code');
      $.ajax({
        url: _mydir+"_php/login/api/confirm_api.php",
        method: "GET",
        data: "submitted=true&code="+code,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
		}

		proto.resetpwd = function(email,done){
			proto._showLoading('Sending Email');
			$.ajax({
        url: _mydir+"_php/login/api/resetpwd_api.php",
        method: "POST",
        data: "submitted=true&email="+email,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
		}

		proto.chpwd = function(oldpwd,newpwd,done){
			proto._showLoading('Changing Passord');
			$.ajax({
        url: _mydir+"_php/login/api/chpwd_api.php",
        method: "POST",
        data: "submitted=true&oldpwd="+oldpwd+"&newpwd="+newpwd,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        done(parseData(data));
      });
		}

    proto.isStarred = function(username,done){
      $.ajax({
        url: _mydir+"_php/stars/star_api.php",
        method: "GET",
        data: "act=isstarred&user="+username,
        cache: false
      }).done(function(data){
        done(data == "true" ? true : false);
      });
    }

    proto.getuseracc = function(username,done){
      proto._showLoading('Getting User Account');
      $.ajax({
        url: _mydir+"_php/stars/star_api.php",
        method: "GET",
        data: "act=getuseracc&user="+username,
        cache: false
      }).done(function(data){
        proto._hideLoading();
        var user = JSON.parse(data);
        if(user == null){
          user = {
            name: null,
            email: null,
            pp: "default",
            username: null
          };
        } else {}
        if(user.pp){
          user.pp = user.pp == "custom" ? _mydir+"userprofiles/"+username
          +"/pp.png" : _mydir+"res/avatar.png";
        } else {
          user.pp = _mydir+"res/avatar.png";
        }
        user._mydir = _mydir;
        proto.isStarred(username,function(is){
          user.isStarred = is;
          done(user);
        });
      });
    }

    proto.star = function(username,done){
      $.ajax({
        url: _mydir+"_php/stars/star_api.php",
        method: "GET",
        data: "act=star&user="+username,
        cache: false
      }).done(function(data){
        done(parseData(data));
      });
    }

    proto.unstar = function(username,done){
      $.ajax({
        url: _mydir+"_php/stars/star_api.php",
        method: "GET",
        data: "act=unstar&user="+username,
        cache: false
      }).done(function(data){
        done(parseData(data));
      });
    }

    proto.sendMessage = function($user,msg,done){
      var uname = $user.username;
      var name = $user.name;
      var email = $user.email;
      var pp = $user.pp.replace(_mydir,'');
      var id = $user.id_user;
      var data = "act=send&pp="+pp+"&username="+uname+"&name="+name+"&message="+msg+"&id="+id+"&email="+email;
      $.ajax({
        url: _mydir+"_php/chats/api.php",
        method: "POST",
        data: data,
        cache: false
      }).done(function(data){
        done(data);
      });
    }

    proto.deleteMessage = function(time,msg,done){
      var uname = $user.username;
      var name = $user.name;
      var email = $user.email;
      var pp = $user.pp;
      var id = $user.id_user;
      var data = "act=send&pp="+pp+"&username="+uname+"&name="+name+"&message="+msg+"&id="+id+"&email="+email;
      $.ajax({
        url: _mydir+"_php/chats/api.php",
        method: "POST",
        data: data,
        cache: false
      }).done(function(data){
        done(data);
      });
    }

    proto.chatMessages = function(done){
      var ajax = $.ajax({
        url: _mydir+"_php/chats/api.php",
        method: "POST",
        data: "act=get",
        cache: false
      }).done(function(data){
        done(data);
      });
      return ajax;
    }

    proto.search = function(list,query,done){
      list.append(`
        <div class="list-group buddings">
          <button class="btn filterMembersBtn active" filter="posts">Posts</button>
          <button class="btn filterMembersBtn" filter="tests">Tests</button>
          <button class="btn filterMembersBtn" filter="users">Users</button>
        </div>
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="posts">
          <div class="main-list">
            <div id="list--posts" class="list-group"></div>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="tests">
          <div class="main-list">
            <div id="list--tests" class="list-group"></div>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="users">
          <div class="main-list">
            <div id="list--users" class="list-group"></div>
          </div>
        </div>
      </div>
      `);
      function filter(query,posts,users,tests){
        var _posts = posts.filter(function(post){
          var statement = post.name.toLowerCase().indexOf(query[0].toLowerCase()) > -1;
          if(query.id){
            statement = post.id_post == query.id;
          }
          if(query.username){
            statement = statement && post.username.toLowerCase().indexOf(query.username.toLowerCase()) > -1;
          }
          if(query.subject){
            statement = statement && post.subject.toLowerCase().indexOf(query.subject.toLowerCase()) > -1;
          }
          if(query.catagory){
            statement = statement && post.catagory.toLowerCase().indexOf(query.catagory.toLowerCase()) > -1;
          }
          if(!query.catagory && !query.subject && !query.id && !query.username){
            statement = post.name.toLowerCase().indexOf(query[0].toLowerCase()) > -1;
          }
          return statement;
        });
        var _users = users.filter(function(user){
          var statement = user.name.toLowerCase().indexOf(query[0].toLowerCase()) > -1;
          if(query.id){
            statement = user.id_user == query.id;
          }
          if(query.username){
            statement = statement && user.username.toLowerCase().indexOf(query.username.toLowerCase()) > -1;
          }
          if(query.subject && !query.username){
            statement = statement && false;
          }
          if(query.catagory && !query.username){
            statement = statement && false;
          }
          if(!query.catagory && !query.subject && !query.id && !query.username){
            statement = user.name.toLowerCase().indexOf(query[0].toLowerCase()) > -1;
          }
          return statement;
        });
        var _tests = tests.filter(function(test){
          var statement = test.name.toLowerCase().indexOf(query[0].toLowerCase()) > -1;
          if(query.id){
            statement = test.id_test == query.id;
          }
          if(query.username){
            statement = statement && test.username.toLowerCase().indexOf(query.username.toLowerCase()) > -1;
          }
          if(query.subject){
            statement = statement && test.subject.toLowerCase().indexOf(query.subject.toLowerCase()) > -1;
          }
          if(query.catagory){
            statement = statement && test.catagory.toLowerCase().indexOf(query.catagory.toLowerCase()) > -1;
          }
          if(!query.catagory && !query.subject && !query.id && !query.username){
            statement = test.name.toLowerCase().indexOf(query[0].toLowerCase()) > -1;
          }
          return statement;
        });
        display(_posts,_users,_tests);
      }
      function display(posts,users,tests){
        proto._showLoading('Searching');
        posts.forEach(function(post){
          $("#list--posts").append(Template(`
            <a href="#post&{{id_post}}" class="item-sup">
              <div class="data">
                <h5>{{name}}</h5>
                <p>{{username}} from {{university}}</p>
              </div>
            </a>
          `,post,post,post));
        });
        users.forEach(function(user){
          var username = user.username;
          user.pp = user.pp == "custom" ? _mydir+"userprofiles/"+username
          +"/pp.png" : _mydir+"res/avatar.png";
          $("#list--users").append(Template(`
            <a href="#userprofile&{{username}}" class="item-sup">
              <img class="avatar-md" src="{{pp}}" data-toggle="tooltip" data-placement="top" title="{{username}}" alt="avatar">
              <div class="status">
                <i class="material-icons online">fiber_manual_record</i>
              </div>
              <div class="data">
                <h5>{{name}}</h5>
                <p>From {{university}}</p>
              </div>
            </a>
          `,user,user,user));
        });
        tests.forEach(function(test){
          $("#list--tests").append(Template(`
           <a href="#test&{{id_test}}" class="item-sup">
              <div class="data">
                <h5>{{name}}</h5>
                <p>{{username}} from {{university}}</p>
              </div>
            </a>
          `,test,test,test));
        });
        if(posts.length == 0){
          $("#list--posts").html('No Posts With the Search Parameters');
        } else {}
        if(users.length == 0){
          $("#list--users").html('No Users With the Search Parameters');
        } else {}
        if(tests.length == 0){
          $("#list--tests").html('No Tests With the Search Parameters');
        } else {}
        if(users.length == 0 && posts.length == 0 && tests.length == 0){
          list.html('No Results With the Search Parameters');
        }
        $('.filterMembersBtn').off('click');
        $('.filterMembersBtn').on('click',function(){
          $('.tab-content .tab-pane').removeClass('active');
          $("#"+ $(this).attr('filter')).addClass('active');
          $(this).parent().find('button').removeClass('active');
          $(this).addClass('active');
        });
      }
      function parseQuery(query){
        query = query.replace(/%20/ig,' ');
        query_2 = [new String()];
        var query_split = query.split(' ');
        query_split.forEach(function(q,i){
          if(/^@(\w+)/.test(q)){
            var _key = q.split('@')[1].split(':')[0];
            var _val = q.split('@')[1].split(':')[1];
            query_2[_key] = _val;
          } else {
            query_2[0] += (i == 0 ? q : (i == query_split.length ? q : " "+q));
          }
        });
        return query_2;
      }
      $.ajax(_mydir+"_php/share/de.php").done(function(e){
        var posts = JSON.parse(e);
        $.ajax(_mydir+"_php/login/users.php").done(function(e){
          var users = JSON.parse(e);
          proto.tests(function(e){
            var tests = JSON.parse(e);
            filter(parseQuery(query),posts,users,tests);
            $("#SearchInput").val(query.replace(/%20/ig,' '));
            proto._hideLoading();
          });
        });
      });
    }

    proto.getUsers = function(done){
      proto._showLoading('Getting Users');
      $.ajax(_mydir+"_php/login/users.php?sort=true").done(function(e){
        proto._hideLoading();
        var users = JSON.parse(e);
        done(users);
      });
    }

    proto.deletePost = function(type,id,username,done){
      proto._showLoading('Deleting Post');
      type = type == "test" ? "tests" : "share";
      $.ajax({
        url: _mydir+"_php/"+type+"/api.php",
        method: "POST",
        data: "act=delete&id="+id+"&username="+username,
        cache: false
      }).done(function(e){
        if(!done) done = function(e){};
        proto._hideLoading();
        done(e);
      });
    }

    proto.report = function(username,message,id,type,name,link,from,done){
      proto.postComment(username,message,id,type,name,link,from,'report',done);
    }
    proto.comment = function(username,message,id,type,name,link,from,done){
      proto.postComment(username,message,id,type,name,link,from,'comment',done);
    }

    proto.postComment = function(username,message,id,type,name,link,from,act,done){
      proto._showLoading('Posting Comment');
      var data = "act="+act+"&id="+id+"&name="+name+"&link="+link
      +"&type="+type+"&message="+message+"&username="+username+"&from="+from;
      $.ajax({
        url: _mydir+"_php/comments.php",
        method: "POST",
        data: data,
        cache: false
      }).done(function(e){
        if(!done) done = function(e){};
        proto._hideLoading();
        done(e);
      }); 
    }


		proto._showLoading = function(loadingtext){
			swal(loadingtext + "...");
			swal.disableButtons();
		}
		proto._hideLoading = function(){
			swal.enableButtons();
			swal.close();
		}
	}

	DBM.prototype = new DBMProto();

	return DBM;
});