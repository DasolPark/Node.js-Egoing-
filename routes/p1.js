module.exports = function(app){//이제 exports는 함수임
	var express = require('express');
	var route = express.Router();

	route.get('/r1', function(req, res){
		res.send('Hello /p1/r1');
	});
	route.get('/r2', function(req, res){
		res.send('Hello /p1/r2');//그래도 주소에는 /p1/r2로 써야 웹페이지 작동
	});
	app.get('p3/r1', function(req, res){
		res.send('Hello p3/r1');
	});
	return route;
}//여기서도 app을 사용가능하게 해줌