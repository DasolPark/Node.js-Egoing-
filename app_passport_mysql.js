var express = require('express');
var session = require('express-session');//메모리에만 저장
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

const mysql = require('mysql');
const conn = mysql.createConnection({
	host	: 'localhost',
	user 	: 'root',
	password: '111111',
	database: 'o2'
});
conn.connect();

var app = express();
app.set('views', './views/mysql');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret: '1234SADF@#%fdjgkl',//session id를 심을 때, 키같은 것
  resave: false,//세션id를 새로 접속할 때마다 재발급하지 않는다
  saveUninitialized: true,//세션을 id를 세션을 실제로 사용하기 전까지는 발급하지 말아라
  store: new MySQLStore({
  	host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'o2'
  })
}));
app.use(passport.initialize());
app.use(passport.session());//인증할 때 세션을 사용하겠다(반드시 app.use(session({})))뒤에 나와야한다
app.get('/count', function(req, res){
	if(req.session.count){
		req.session.count++;
	} else {
		req.session.count = 1;
	}
	//req.session.count = 1;//저장뿐만 아니라
	res.send('count : '+req.session.count);
});
app.get('/auth/logout', function(req, res){
	req.logout();//세션에 있는 데이터를 패스포트가 제거해줌
	req.session.save(function(){//작업이 끝난 후 조금 더 안전하게 웰컴페이지로 리다이렉션
		res.redirect('/welcome');
	});
});
app.get('/welcome', function(req, res){
	if(req.user && req.user.displayName){//로그인에 성공 했다면, 해당 사용자의 개인화된 화면을 보여줄 수 있다
		res.send(`
			<h1>Hello, ${req.user.displayName}</h1>
			<a href="/auth/logout">logout</a>
		`);
	} else {
		res.send(`
			<h1>welcome</h1>
			<ul>
				<li><a href="/auth/login">login</a></li>
				<li><a href="/auth/register">Register</a></li>
			</ul>
		`);
	}
});
passport.serializeUser(function(user, done) {//딱 한 번 실행됨
	console.log('serializeUser', user);
  done(null, user.authId);//해당 사용자를 구별할 수 있는 식별자를 두 번째 인자로 보냄
});//세션에 등록되고, 따라서 다음에 방문할 때도 이름을 기억함

passport.deserializeUser(function(id, done) {//이미 등록되어있으면 이 func이 실행됨
	console.log('deserializeUser', id);
	var sql = 'SELECT * FROM users WHERE authId=?';
	conn.query(sql, [id], function(err, results){//[id]에는 authId가 들어와서 local:을 써줄 필요 없음
		if(err){
			console.log(err);
			done('There is no user.');
		} else {
			done(null, results[0]);
		}
	});
});
passport.use(new LocalStrategy(
	function(username, password, done){//done은 함수를 담아주기로 약속되어 있음
		var uname = username;
		var pwd = password;
		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, ['local:'+uname], function(err, results){
			console.log(results);
			if(err){
				return done('There is no user.');
			}
			var user = results[0];
			return hasher({password:pwd, salt: user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					console.log('LocalStrategy', user);
					done(null, user);//serializeUser가 실행됨
				} else {
					done(null, false);//pwd가 틀렸음(그럼 그냥 메시지 없이 끝임 false라서)
				}
			});
		});
	}
));
passport.use(new FacebookStrategy({
    clientID: '277743539519773',
    clientSecret: '23228d7e4ecdba916cb22b1e891b6e71',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 
    'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile);//어떤 정보가 있는지 아는게 중요
  	var authId = 'facebook: '+profile.id;
  	var sql = 'SELECT * FROM users WHERE authId=?';
  	conn.query(sql, [authId], function(err, results){
  		if(results.length > 0){//있다면 results값은 0보다 큼
  			done(null, results[0]);
  		} else {
  			var newuser = {//users에 사용자가 없을 때 push
  				'authId': authId,//local의 username과 다르게 authId임
  				'displayName': profile.displayName,
  				'email': profile.emails[0].value
  			};
  			var sql = 'INSERT INTO users SET ?';
  			conn.query(sql, newuser, function(err, results){
  				if(err){
  					console.log(err);
  					done('Error');
  				} else {
  					done(null, newuser);
  				}
  			});
  		}
  	});  	
  }
));
app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
});
//connect.sid를 통해 서버에 저장되게 하여 사용할 수 있다
//내용은 메모리에 저장되어 있음, node app_session.js를 껐다 키면 초기화됨
//실제 개발할 때는 DB에 저장해야함