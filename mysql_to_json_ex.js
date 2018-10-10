//mysql to json file example

var mysql = require('mysql');
// http://nodejs.org/docs/v0.6.5/api/fs.html#fs.writeFile
var fs = require('fs');

var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '111111',
   database: 'o2'
});

connection.connect();
const sql = 'SELECT * FROM topic';
connection.query(sql, function(err, results, fields) {
    if(err){
    	console.log(err);
    }else{
	    fs.writeFile('./tableTojson/topic_table', JSON.stringify(results), function (err) {
	      if(err){
	      	console.log(err);
	      }
	      console.log('Saved!');
	    });
	}

    connection.end();
});