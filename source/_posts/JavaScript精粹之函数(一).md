---
title: JavaScript精粹之函数(一)
date: 2014-11-02 16:36:59
tags: [前端,JavaScript]
description: "在javascript中函数真的是神通广大的很。它除了可以作为一般的函数使用外，我们还可以当对象的方法使用，也可以像这样`function MyClass(){}`，看这名字你们应该知道这是什么了，对的，函数也可以构造成类来使用。对于不同的声明方式，函数的调用也是不一样的。"
---



在javascript中函数真的是神通广大的很。它除了可以作为一般的函数使用外，我们还可以当对象的方法使用，也可以像这样`function MyClass(){}`，看这名字你们应该知道这是什么了，对的，函数也可以构造成类来使用。对于不同的声明方式，函数的调用也是不一样的。

# 函数的形式
函数有下面几种声明方式：

*   直接声明 
	> 例如 ：function add(a,b){....}
		

*   变量声明
	> 例如 ：var add = function(a,b){...}

*	对象方法声明
	> 例如 ：
	> var obj = {
	>     add:function(a,b){...}
	>}

*	类声明
	> 例如 ： function Add(a,b){...}  

# 函数的调用模式
*	作为对象方法调用(The Method Invocation Pattern)
		
	通常我们会上述的**对象方法声明**来创建一个对象，然后我们就可以这样来调用对象的方法了：

```
		
obj.add(1,2);
//或者
obj[add](1,2);
```
		
这里的函数绑定在了对象上，函数成了对象的属性，这种作为对象的属性来调用，我们一般就叫作方法调用。此时，函数中`this`指的就是对象本身。我们经常看到的链式调用`myInfo.setName("xiao").setAge(33).setWeigth(65)`就是通过返回`this`来实现的。

例如:

```

var myInfo = {
	setName:function(name){
		console.log(name);
		return this;
	},
	setAge:function(age){
		console.log(age);
		return this;
	},
	setWeight:function(weight){
		console.log(weight);
		return this;
	}
}

//invoke :
myInfo.setName("sai").setAge(27).setWeight(65);
```

*	一般函数调用(The Function Invocation Pattern)
	
```
var sub = add(1,2);
```
	  	
这种形式的函数是绑定在全局对象上。我们应该知道在函数内部使用的变量，除了声明函数是定义的参数变量或使用`var`声明的变量外，都是全局变量（也是全局对象的属性）。比如：有个全局变量`a`有函数内部使用，我们可以直接使用它`a`或者作为全局对象的属性使用：`this.a`。

函数体内的变量有这样的特点，比如：在函数体内有变量`name`，如果该变量是在函数体内声明的（也就是用`var`或作为形参）那么`name`就是函数体内声明的变量，如果没有在函数体内声明，会自动的访问全局变量`name`。又如果在函数体内已经声明的变量`name`，但还是想使用全局的变量`name`，那么就需要这样使用`this.name`，在这种形式调用的函数体内this指的就是全局对象。

```
var name = "huang";
function myInfo1(name){
	console.log("part varibale name: "+name);
	console.log("global varibale name: "+this.name);
}
myInfo1("sai");	
// print out : 
//	part varibale name: sai
//	global varibale name: huang

function myInfo2(){
	var name = "sai";
	console.log("part varibale name: "+name);
	console.log("global varibale name: "+this.name);
}
myInfo2();
// print out : 
//	part varibale name: sai
//	global varibale name: huang

function myInfo3(){
	console.log("part varibale name: "+name);
	console.log("global varibale name: "+this.name);
}
myInfo3();
// print out : 
//	part varibale name: huang
//	global varibale name: huang
```
		

*	作为构造函数调用(The Constructor Invocation Pattern)
	
	这种形式，可以看成是java中的类对象，通过new 来构建类对象的实例。
	javascript可以把函数当作对象使用。所以在javascript声明一个类对象和声明函数是一样的。
	区别在于：我们如果要把函数当作类对象使用，那我们一般在定义函数名称的时候会使首字母大写。
		

```
function MyInfo(name){
	this.name = name;
}
```

然后我们可以像添加对象的属性一样，来给我们创建的类添加公共的属性或方法。

```
MyInfo.prototype.getName = function(){
	return this.name;
}
```
使用new来实现化一个类对象：

```
var my = new MyInfo("sai");

my.getName(); // print out : sai
my.name;	  // print out : sai
```

`my.name`是不是觉得和使用javascript中的一般的对象是一样的啊。所以说，在javascript除了几种基本的类型外，其他都是对象。其实javascript中已经内置了几个这种形式的类对象。比如：`new Date()`、`new Array()`、`new String()`等等。 

*	指定对象方法调用(The Apply Invocation Pattern)
	
	javascript中函数是可以有方法的，这个在前面的介绍中我们应该就知道了。 这里要说的是其中的一个方法，名叫`apply`，它的主要作用就是让函数能在其他的对象使用。
	该方法需要两个参数，第一个参数做为我们要调用的函数的宿主（即需要的对象）,第二个参数是调用
	函数时所须的参数（以数组的形式）。
	
```
var otherPeople = {
	name : "other"
}
myInfo1.apply(otherPeople,"xiao bao");
// print out :
//	part varibale name: xiao bao
//	global varibale name: other
```

此时，myInfo1声明中使用的_this_指的就不是**全局对象**了，而是**otherPeople**。

说到`apply`当然要提一下`call`，它的作用和`apply`是一样的。但call除了第一个参数是宿主对象外，后面的参数个数不限且这些参数会作为被调用的函数的参数使用。
