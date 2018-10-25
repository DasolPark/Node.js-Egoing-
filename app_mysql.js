const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: _storage });
const fs = require('fs');
const mysql = require('mysql');
const conn = mysql.createConnection({
	host	: 'localhost',
	user 	: 'root',
	password: '111111',
	database: 'o2'
});
conn.connect();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));//미들웨어가 가로챈다.
app.locals.pretty = true;
//유저가 올린 파일을 보게 하려면
app.use('/user', express.static('uploads')); 
app.set('views', './views/mysql');
app.set('view engine', 'pug');
app.get('/upload', function(req, res){
	res.render('topic/upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
	res.send('Uploaded: '+req.file.filename);
});
app.get('/topic/add', function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.qeury(sql, function(err, topics, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('topic/add', {topics: topics});
	});
});
app.post('/topic/add', function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var sql = 'INSERT INTO topic (title, description, author)	VALUES(?, ?, ?)';
	conn.qeury(sql, [title, description, author], function(err, result, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		} else {
			res.redirect('/topic/'+ result.insertId);
		}
	});
});
app.get(['/topic/:id/edit'], function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.qeury(sql, function(err, topics, fields){
		var id = req.params.id;
		if(id){
			var sql = 'SELECT * FROM topic WHERE id=?';
			conn.qeury(sql, [id], function(err, topic, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('topic/edit', {topics: topics, topic:topic[0]});
				}
			});
		} else {
			console.log('There is no id.');
			res.status(500).send('Internal Server Error');
		}
	});
});
app.post(['/topic/:id/edit'], function(req, res){
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var id = req.params.id;
	var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE= id=?';
	conn.query(sql, [title, description, author, id], function(err, results, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		} else {
			res.redirect('/topic/'+id);
		}
	});
});
app.get('topic/:id/delete', function(req, res){
	var sql = 'SELECT id, title FROM topic';
	var id = req.params.id;
	conn.query(sql, function(err, topics, fields){
		var sql = 'SELECT * FROM topic WHERE id=?';
		conn.query(sql, [id], function(err, topic){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			} else {
				if(topic.length === 0){
					console.log('There is no record');
					res.status(500).send('Internal Server Error');
				} else {
					res.render('topic/delete', {topics: topics, topic:topic[0]});
				}
			}
		});
	});
});
app.post('/topic/:id/delete', function(req ,res){
	var id = req.params.id;
	var sql = 'DELETE FROM topic WHERE id=?';
	conn.query(sql, [id], function(err, result){
		res.redirect('/topic/');
	});
});
app.get(['/topic', '/topic/:id'], function(req, res){
	var sql = 'SELECT id, title FROM topic';
	conn.query(sql, function(err, topics, fields){
		var id = req.params.id;
		if(id){
			var sql = 'SELECT * FROM topic WHERE id=?';
			conn.query(sql, [id], function(err, topic, fields){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('topic/view', {topics: topics, topic: topic[0]});
				}
			});
		} else {
			res.render('topic/view', {topics: topics});
		}
	});
});
app.listen(3000, function(){
	console.log('Connected, 3000 port!');
});