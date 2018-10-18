// function _sum(a, b){
// 	return a+b;
// }
// module.exports = function sum(a, b){
// 	return _sum(a+b);
// }
//위의 함수는 정상적으로 결과가 나온다
//하지만 이 sum.js내에서만 사용이 가능하다
//module.exports는 접점이자 인터페이스이다
moduel.exports = function sum(a, b){
	return a+b;
}