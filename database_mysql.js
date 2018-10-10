var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

conn.connect();
/*
var sql = "SELECT * FROM topic";
conn.query(sql, function(err, rows, fields){
	if(err){
		console.log(err);
	}else{
		for(var i=0; i<rows.length; i++){
			console.log(rows[i].author);
		}
	}
});
*/
/*
const sql = 'INSERT INTO topic(title, description, author) VALUES(?, ?, ?)';
const params = ['Supervisor', 'Watcher', 'graphitte'];
conn.query(sql, params, function(err, rows, fields){
	if(err){
		console.log(err);
	}else{
		console.log(rows.insertId);
	}
});
*/
/*
const sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
const params = ['NPM', 'leezche', '1', ];
conn.query(sql, params, function(err, rows, fields){
	if(err){
		console.log(err);
	}else{
		console.log(rows);
	}
});
*/
const sql = 'DELETE FROM topic WHERE id=?';
const params = [1];
conn.query(sql, params, function(err, rows, fields){
	if(err){
		console.log(err);
	}else{
		console.log(rows);
	}
});
conn.end();