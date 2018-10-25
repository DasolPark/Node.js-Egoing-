var app = require('./config/mysql/express')();//함수니까 ()도 쓰는게 정석
var passport = require('./config/mysql/passport')(app);

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


var auth = require('./routes/mysql/auth')(passport);//바로 위의 passport를 주입
app.use('/auth/', auth);

app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
});
//connect.sid를 통해 서버에 저장되게 하여 사용할 수 있다
//내용은 메모리에 저장되어 있음, node app_session.js를 껐다 키면 초기화됨
//실제 개발할 때는 DB에 저장해야함