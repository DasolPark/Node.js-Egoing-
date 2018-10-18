var express = require('express');
var app = express();

var p1 = require('./routes/p1')(app);//기존에 route만 반환하던 것이 이젠 함수가 됐음
app.use('/p1', p1);

var p2 = require('./routes/p2')(app);
app.use('/p2', p2);

app.listen(3003, function(req, res){
	console.log('Connected');
});