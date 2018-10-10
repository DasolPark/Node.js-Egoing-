const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/*이 코드로 대체 가능
var server = http.createServer(function(req, res){//port로 사용자가 들어왔을 때 어떤 내용을 출력할 것이냐? -> 익명함수
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World\n');
});
server.listen(port, hostname, function(){//listen이 성공하면 callback실행됨
  console.log(`Server running at http://${hostname}:${port}/`);//port를 째려봄
});
*/