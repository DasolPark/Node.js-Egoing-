const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	//if(파일의 형식이 이미지면){
  		//cb(null, 'uploads/images');
  	//}else if(파일의 형식이 텍스트면)
  		//cb(null, 'uploads/texts');
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
  	//if(파일이 이미 존재한다면){
 		//cb(null, file.originalname에 동일 이름의 파일 중에 가장 큰 숫자를 입력)	
  	//}else{
  		//cb(null, file.originalname);
  	//}
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: _storage });
const fs = require('fs');
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