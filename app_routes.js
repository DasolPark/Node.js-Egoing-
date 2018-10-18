var express = require('express');
var app = express();

var p1 = require('./routes/p1');
app.use('/p1', p1);///p1으로 들어오는 모든 요청은 라우터로 위임

var p2 = require('./routes/p2');
app.use('/p2', p2);

app.listen(3003, function(req, res){
	console.log('Connected');
});