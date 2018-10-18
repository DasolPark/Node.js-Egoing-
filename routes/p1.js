var express = require('express');
var route = express.Router();

route.get('/r1', function(req, res){
	res.send('Hello /p1/r1');
});
route.get('/r2', function(req, res){
	res.send('Hello /p1/r2');//그래도 주소에는 /p1/r2로 써야 웹페이지 작동
});
module.exports = route;