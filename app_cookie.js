const express = require('express');
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.get('/count', function(req, res){
	if(req.cookies.count)
		var count = parseInt(req.cookies.count);//쿠키값은 사실 문자 -> 숫자로
	else
		var count = 0;
	count = count+1;
	res.cookie('count', count);
	res.send('count: '+ count);
});
app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
});
