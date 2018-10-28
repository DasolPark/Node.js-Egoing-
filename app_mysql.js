var app = require('./config/mysql/express')();//함수니까 ()도 쓰는게 정석
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);//바로 위의 passport를 주입
app.use('/auth/', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3003, function(){
	console.log('Connected, 3003 port!');
});
