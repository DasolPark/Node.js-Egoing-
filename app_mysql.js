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
	password: '',
	database: 'o2'
});
conn.connect();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));//미들웨어가 가로챈다.
app.locals.pretty = true;
//유저가 올린 파일을 보게 하려면
app.use('/user', express.static('uploads')); 
app.set('views', './views_file');
app.set('view engine', 'pug');
app.get('/upload', function(req, res){
	res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
	console.log(req.file);
	res.send('Uploaded: '+req.file.filename);
});
app.get('/topic/new', function(req, res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('new', {topics:files});
	});
});
app.get(['/topic', '/topic/:id'], function(req, res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		const id = req.params.id;
		// id 값이 있을 때
		if(id){
			fs.readFile('data/'+id, 'utf8', function(err, data){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				res.render('view', {topics:files, title:id, description:data});
			});
		}else{
			// id 값이 없을 때
			res.render('view', {topics:files, title:'Welcome', description:'Hello JavaScript for server'});
		}
	});
});
app.post('/topic', function(req, res){
	const title = req.body.title;
	const description = req.body.description;
	fs.writeFile('data/'+title, description, function(err){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.redirect('/topic/'+title);
	});
});
app.listen(3000, function(){
	console.log('Connected, 3000 port!');
});