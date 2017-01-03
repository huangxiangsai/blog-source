---
layout: draft
title: Javascript中被忽视的形参与实参
data: 2016-08-08
tag: [javascript]
---

```
var a = 1;
var f = function(_a){
	var _a1 = _a;
	console.log(_a,_a1);
}
f(a);


var arr = [1,2,3];
var f1 = function(_arr){
	_arr[0] = '_arr';
	console.log(_arr);
}
f1(arr);
console.log(arr);

var obj = {a : 1 , b : 2};
var f2 = function(_obj){
	_obj.a = '_obj';
	console.log(_obj);
}
f2(obj);
console.log(obj);

var x = 1 , y = 2;
var f3 = function(_x , _y){
	console.log(_x,arguments[0] ===  _x);
	console.log(_y,arguments[1] ===  _y);
}
f3();
f3(x,y);

var x = 1 , y = 2;
var f4 = function(_x , _y){
	_x = 3;
	_y = 4;
	console.log(_x,arguments[0] ===  _x);
	console.log(_y,arguments[1] ===  _y);
}
f4();
f4(x,y);
```
