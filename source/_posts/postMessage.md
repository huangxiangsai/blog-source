---
title: HTML5 Cross-Document Messaging(postMessage)
tags: [HTML5,postMessage]
date: 2016.02.17
---

window.postMessage是html5的新特性之一，
可以使用它来向其它的window对象发送消息，不管这个window对象是属于同源或不同源。

通过Cross-Document Messaging允许浏览器**windows, tabs, and iFrames**之间跨域通讯。

我们使用`postMessage()`方法去发送一条信息。

**postMessage发送信息**

postMessage需要接受两个参数

*	**message** 要发送的信息，可以是`string`也可以`object`
*	**targetOrigin** 接受信息的窗口的地址，这地址由接受窗口的protocol, port and hostname组成 
也可以使用`*`来匹配任意的URL，但这会存在安全问题。

这postMessage方法是被**要接受信息的window所调用**。

例如我们可以使用

```
var new_wd = window.open('http://demos.devsai.com');

```

打开一个新tab,
'window.open'返回的就是新打开的`window`对象,
所以就可以这样来给新打开的window、tab窗口发送信息,

```
new_wd.postMessage('hello demos','http://demos.devsai.com/postmessage/receiver.html');

```

**window接受信息**

如上述例子，可以在`http://demos.devsai.com/postmessage/receiver.html`中添加如下代码:

```
	var receiverHandler = function(e){
		if (e.origin !== "http://www.devsai.com")//判断是哪个域过来的信息
      		return;
		console.log(e.data);//接收到的信息
	}

	window.addEventListener('message',receiverHandler);
	
```


接收的窗口除了使用`window.open`打开的以外，还可以是iframe窗口,我们可以通过以下代码获得iframe的window对象，
并对iframe发送信息.

```
	var iframe_win = document.getElementById('recevier').contentWindow;
	iframe_win.postMessage('hello iframe','http://demos.devsai.com/postmessage/receiver.html');
	##
```

**浏览器的支持**
现在主流的浏览器都是支持`postMessage()`，也包括IE8+,但在IE8、IE9中还是有限制的，只能在docuemnt与iframe之间通讯才可使用`postMessage()`,想要在跨window或者tab之间通讯必须是IE10+.



| IE 			| FIREFOX 		|	CHROME		| SAFARI		| OPERA 		|
| :------------:| :------------:| :------------:| :------------:| :------------:|
|	8+			|	3.0+ 		|	1.0+ 		|	4.0+ 		|	9.5+ 		|

最后，<a href="/demo/postmessage/sender.html" target="_blank">想看DEMO,在这里穿越</a>

DEMO也放在了github上，想要看code的同学，<a href="https://github.com/huangxiangsai/postMessage-demo" target="_blank">点击这里</a>
