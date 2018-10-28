module.exports = function(passport){
	var bkfd2Password = require("pbkdf2-password");
	var hasher = bkfd2Password();
	var conn = require('../../config/mysql/db')();
	var route = require('express').Router();

	route.post(
		'/login',
	  passport.authenticate(//passport.authenticate라는 미들웨어를 통해서 로그인
	  	'local', //local strategy가 실행된다는 의미
	  	{ //위의 new LocalStrategy가 실행
	  		successRedirect: '/topic',
	      failureRedirect: '/auth/login',//원래는 아래 who are you였음
	      failureFlash: false//로그인에 실패하면 딱 한 번만 보여주는 메시지(flash로 했을 때)
	    }
	  )
	);
	route.get(
		'/facebook', //첫 번째 왕복
		passport.authenticate(
			'facebook',
			{scope: 'email'}
		)
	);//라우트가 2개임(타사 인증)
	route.get('/facebook/callback',//두 번째 왕복
	  passport.authenticate(
	  	'facebook',
	  	{
	  		successRedirect: '/topic',
	  	  failureRedirect: '/auth/login'
	  	}
	  )
	);
	route.post('/register', function(req, res){
		hasher({password: req.body.password}, function(err, pass, salt, hash){
			var user = {
				authId:'local:'+req.body.username,
				username: req.body.username,
				password: hash,
				salt: salt,
				displayName: req.body.displayName
			};
			var sql = 'INSERT INTO users SET ?';
			conn.query(sql, user, function(err, results){//users테이블에 행이 추가되면 콜백 실행
				if(err){
					console.log(err);
					res.status(500);
				} else {
					req.login(user, function(err){
						req.session.save(function(){
							res.redirect('/topic');
						});//회원가입이 되고 바로 로그인되어 사용할 수 있도록 구현
					});
				}
			});
		});
	});

	route.get('/register', function(req, res){
		var sql = 'SELECT id, title FROM topic';
		conn.query(sql, function(err, topics, fields){//fields는 사실 없어도 됨(topics는 원래 rows)
			res.render('auth/register', {topics: topics});
		});
	});
	route.get('/login', function(req, res){
		var sql = 'SELECT id, title FROM topic';
		conn.query(sql, function(err, topics, fields){//fields는 사실 없어도 됨(topics는 원래 rows)
			res.render('auth/login', {topics: topics});
		});
	});//p태그를 이용하는 이유는 줄바꿈을 하기 위해서
	route.get('/logout', function(req, res){
		req.logout();//세션에 있는 데이터를 패스포트가 제거해줌
		req.session.save(function(){//작업이 끝난 후 조금 더 안전하게 웰컴페이지로 리다이렉션
			res.redirect('/topic');
		});
	});

	return route;
}
