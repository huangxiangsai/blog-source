# Up and going - 01

一个程序基本构成部分是，变量、循环、条件判断、函数。

ECMAScript是JS的规范

JS的类型：

* string
* number
* boolean
* null or undefined
* object
* symbol(ES6)

判断类型的方法： typeof(xx)， 而`typeof(null) == 'object'` 比较怪。

`typeof` 返回的会是上述的六种类型的其中一种的字符串，另外当变量是一个函数时，`typeof`还可能返回一个`function`字符串。


**变量声明提升**

虽然有这种特性，但还是建议变量要再作用域最顶部去声明。

**函数声明提升**

函数声明也会提升。但函数在声明前就去调用还是能被接受的。


**作用域嵌套**

变量只在声明了的作用域内有效，不在作用域内使用，将会报错`ReferenceError: xxx is not defined`

在未声明情况下，就进行变量赋值，会有两种情况
1. 将会再顶层域下创建一个变量
2. `strict use`严格模式下将报错`xx is not defined`.

ES6里的`let`声明变量的作用域与`var`不同，`let`为块级作用域，只在当前的`{...}`使用,并且同一作用域内变量不能重复声明。

```
if(true){
    var a = 1
}
console.log(a)
```

```
if(true){
    let a = 1
}
console.log(a)
```


**条件语句**

条件语句有`if`,`switch...case`,`?...:...`


**strict mode**严格模式

```
"use strict"
```
可以在文件头部指定,也可以在某个函数内头部指定。

严格模式

* 不能使用未声明的变量

函数表达式

```
var foo = function(){

}
```

立即调用函数`IIFEs`

```
(function IIFE(){
    console.log('IIFEs')
})()
```

**Closure(闭包)**

使用闭包模仿私有属性或方法

据说，理论上讲，所有的函数都是闭包

实际上来说，闭包是作用域的延续，

比如一个变量被setTimeout内的函数引用了
比如一个变量被ajax的处理函数引用了
比如一个变量被返回的内部函数引用了

**原型**

不解释...

**this**

如果一个函数里引用了this,通常这个this指的是一个对象，但这个对象具体是什么，跟这个函数怎么被调用有关。

**polyfilling**

垫片，为了解决在老浏览器中无法使用JS新特色问题。 

对于新的语法，就没有办法polyfill了。

**no-JavaScript**

之前说的那些都是JavaScript自己的东西，但实际的开发中，有很大的部分不仅仅如此，比如开发浏览器页面，就会使用DOM API,以及浏览器的一些其他API。


### 最后

**up && going**

就像是javascript的快速入门，基本上每个重要的点都讲到了，但都没有对其展开。

而是各个技术点的展开,作为单独的章节，更详细的讲。