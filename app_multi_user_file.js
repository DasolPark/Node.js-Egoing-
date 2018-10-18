var express = require('express');
var session = require('express-session');//메모리에만 저장
var FileStore = require('session-file-store')(session);//express-session에 의존한다는 의미
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret: '1234SADF@#%fdjgkl',//session id를 심을 때, 키같은 것
  resave: false,//세션id를 새로 접속할 때마다 재발급하지 않는다
  saveUninitialized: true,//세션을 id를 세션을 실제로 사용하기 전까지는 발급하지 말아라
  store: new FileStore()
}))
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
	delete req.session.displayName;//JavaScript 명령(delete)
	res.redirect('/welcome');//현재 세션정보는 메모리에 저장 즉, 껐다키면 사라짐(DB저장 필요)
});
app.get('/welcome', function(req, res){
	if(req.session.displayName){//로그인에 성공 했다면, 해당 사용자의 개인화된 화면을 보여줄 수 있다
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
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
app.post('/auth/login', function(req, res){
	var uname = req.body.username;
	var pwd = req.body.password;
	for(var i=0; i<users.length; i++){
		var user = users[i];
		if(uname === user.username){
			return hasher({password:pwd, salt: user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					req.session.displayName = user.displayName;//session으로 굽는다
					req.session.save(function(){
						res.redirect('/welcome');
					});
				} else {
					res.send('Who are you? <a href="/auth/login">login</a>');
				}
			});
		}
		//if(uname === user.username && sha256(pwd,) === user.password){
		//	req.session.displayName = user.displayName;//세션 dpn에 user.dpn을 저장
		//	return req.session.save(function(){//세션이 안전하게 저장된 것을 확인한 후에 실행
		//		res.redirect('/welcome');//redirect만으로는 이 반복문이 멈추지 않음 그래서 return 추가				
		//	});
		//} 
	}
	res.send('Who are you? <a href="/auth/login">login</a>');
});
var users = [//비밀번호 111111로 했음
	{
		username: 'egoing',
		password: 'oGyGyN7iLuv4DqEvJ/kLMSS2M50ednsLA+MFrhGLYYBzyqY/LOEkcNRzU812pe6ht+3w7RkKp+vHAjQpeg6K3RVHDS2gHblB8X+F/i1xgSOcbe2xXUnqHnV+2JYEq1mhpS1iWDZwYIT1PYNjZeyYOJN4A6s6oTIXRTibNrVi4VQ=',
		salt:'mvFaptKoXVqPxkwzMnlDF04PRfBY9rabSx2J/hGaWta98fK8CVDb2VKXodsiAKyFx6yDD1kM8rz7YTup0FGj1Q==',
		displayName:'Egoing'
	}
];
app.post('/auth/register', function(req, res){
	hasher({password: req.body.password}, function(err, pass, salt, hash){
		var user = {//k8805, 1234, K5
			username: req.body.username,
			password: hash,
			salt: salt,
			displayName: req.body.displayName
		};
		users.push(user);//실제로 구현할 때는 같은 아이디 중복을 제거해야함
		req.session.displayName = req.body.displayName;
		req.session.save(function(){
			res.redirect('/welcome');
		});
	});
});
app.get('/auth/register', function(req, res){
	var output = `
	<h1>Register</h1>
	<form action="/auth/register" method="post">
		<p>
			<input type="text" name="username" placeholder="username">
		</p>
		<p>
			<input type="password" name="password" placeholder="password">
		</p>
		<p>
			<input type="text" name="displayName" placeholder="displayName">
		</p>
		<p>
			<input type="submit">
		</p>
	</form>
	`;
	res.send(output);
});
app.get('/auth/login', function(req, res){
	var output = `
	<h1>Login</h1>
	<form action="/auth/login" method="post">
		<p>
			<input type="text" name="username" placeholder="username">
		</p>
		<p>
			<input type="password" name="password" placeholder="password">
		</p>
		<p>
			<input type="submit">
		</p>
	</form>
	`;
	res.send(output);
});//p태그를 이용하는 이유는 줄바꿈을 하기 위해서
/*
app.get('/tmp', function(req, res){
	res.send('result : '+req.session.count);//읽어올 수도 있다
});
*/
app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
});
//connect.sid를 통해 서버에 저장되게 하여 사용할 수 있다
//내용은 메모리에 저장되어 있음, node app_session.js를 껐다 키면 초기화됨
//실제 개발할 때는 DB에 저장해야함