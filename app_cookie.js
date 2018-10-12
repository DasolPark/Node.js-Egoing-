const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser('dagfadsg234@#FHB#@%'));

const products = {//나중에 이 부분은 DB가 대체
	1:{title:'The history of web 1'},
	2:{title:'The next web'}
};
app.get('/products', function(req, res){
	var output = '';
	for(var name in products){
		output += `
		<li>
			<a href="/cart/${name}">${products[name].title}</a>
		</li>`
	}
	res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});
/*
cart = {
	1:2,
	2:1
	3:0
}
*/
app.get('/cart/:id', function(req, res){
	var id = req.params.id;
	if(req.signedCookies.cart){
		var cart = req.signedCookies.cart;
	}else{
		var cart = {};
	}
	if(!cart[id]){
		cart[id] = 0;
	}
	cart[id] = parseInt(cart[id])+1;
	res.cookie('cart', cart, {signed:true});
	res.redirect('/cart');
});
app.get('/cart', function(req, res){
	const cart = req.signedCookies.cart;
	if(!cart){
		res.send('Empty!');
	}else{
		var output = '';
		for(var id in cart){
			output += `<li>${products[id].title} (${cart[id]})</li>`;
		}
	}
	res.send(`
		<h1>Cart</h1>
		<ul>${output}</ul>
		<a href="/products">Products List</a>`);
});

app.get('/count', function(req, res){
	if(req.signedCookies.count)
		var count = parseInt(req.signedCookies.count);//쿠키값은 사실 문자 -> 숫자로
	else
		var count = 0;
	count = count+1;
	res.cookie('count', count, {signed:true});
	res.send('count: '+ count);
});
app.listen(3003, function(){
	console.log('Connected 3003 port!!!');
});
