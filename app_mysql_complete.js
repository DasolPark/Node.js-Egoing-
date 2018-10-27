var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: _storage });
var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
	host	: 'localhost',
	user 	: 'root',
	password: '111111',
	database: 'o2'
});
conn.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));//미들웨어가 가로챈다.
app.locals.pretty = true;
//유저가 올린 파일을 보게 하려면
app.use('/user', express.static('uploads')); 
app.set('views', './views_mysql');
app.set('view engine', 'pug');
app.get('/upload', function(req, res){
	res.render('topic/upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
	res.send('Uploaded: '+req.file.filename);
});
app.get('/topic/add', function(req, res){//new에서 add로 변경
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('add', {topics: topics});
	});
});
app.post('/topic/add', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.description;

	var sql = 'INSERT INTO topic(title, description, author) VALUES(?, ?, ?)';
	conn.query(sql, [title, description, author], function(err, result, fields){
		if(err){
			res.status(500).send('Internal Server Error');
			// res.sendStatus(500, 'Internal Server Error');//새로운 방식 테스트해보기
			console.log(err);
		} else {
			res.redirect('/topic/'+result.insertId);
		}
	});
});
app.get(['/topic/:id/edit'], function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){//fields는 사실 없어도 됨(topics는 원래 rows)
		// res.send(topics);//이렇게 쓰면 [object]가 3개 나옴
		var id = req.params.id;
		if(id){
			var sql = 'SELECT * FROM topic WHERE id=?';
			conn.query(sql, [id], function(err, topic, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('edit', {topics: topics, topic: topic[0]})//topic[0]을 한 이유는 id=?에서 한 가지 값에 매치된 것을 가져올 것이니까
				}
			});
		} else {
			console.log(err);
			res.status(500).send('Internal Server Error');
		} 
	});
});
app.post(['/topic/:id/edit'], function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var id = req.params.id;//
	var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
	conn.query(sql, [title, description, author, id], function(err, result, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		} else {
			// res.send(result);
			res.redirect('/topic/'+id);
		}
	});
});
app.get(['/topic/:id/delete'], function(req, res){
	var sql = 'SELECT id, title FROM topic';
	var id = req.params.id;
	conn.query(sql, function(err, topics, fields){
		var sql = 'SELECT * FROM topic WHERE id=?';
		conn.query(sql, [id], function(err, topic){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			} else {
				if(topic.length === 0){//존재하지 않는 데이터를 삭제하지 않도록
					console.log('There is no id.');
					res.status(500).send('Internal Server Error');
				}
				// res.send(topic);
				res.render('delete', {topics: topics, topic: topic[0]});
			}
		});
	});
});
app.post(['/topic/:id/delete'], function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM topic WHERE id=?';
	conn.query(sql, [id], function(err, result){
		// res.send(result);
		res.redirect('/topic/');
	});
});
app.get(['/topic', '/topic/:id'], function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){//fields는 사실 없어도 됨(topics는 원래 rows)
		// res.send(topics);//이렇게 쓰면 [object]가 3개 나옴
		var id = req.params.id;
		if(id){
			var sql = 'SELECT * FROM topic WHERE id=?';
			conn.query(sql, [id], function(err, topic, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('view', {topics: topics, topic: topic[0]})//topic[0]을 한 이유는 id=?에서 한 가지 값에 매치된 것을 가져올 것이니까
				}
			});
		} else {
			res.render('view', {topics: topics});//topics는 원래 files였음(원래는 파일을 읽어왔으니까)
		}
	});
});
app.listen(3000, function(){
	console.log('Connected, 3000 port!');
});