var sum = require('./lib/sum');
// function sum(a, b){
// 	return a+b;
// }
//require('./lib/sum');이 위의 함수로 치환된다고 생각하면 됨
console.log(sum(1, 2));

var cal = require('./lib/calculator');
console.log('cal sum', cal.sum(1, 2));
console.log('cal avg', cal.avg(1, 2));