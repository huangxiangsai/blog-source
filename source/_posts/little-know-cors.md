---
title : 你所不知道的跨域资源共享(CORS)
date : 2016-12-15
tags : [CORS,跨域资源共享]
description : "对网上现有的跨域资源共享中，讲到的简单请求部分，进行更为深入分析。"
---

# 写在前面

有没有一看到讲跨域资源共享的就不想再看的了，网上的跨域资源共享的博文，三天两头的就出一篇。

既然你已经进来看了，还请你稍稍忍耐下，继续往下看，或许你会发现和之前看到的有不一样的收获。

（亲，东西保您好，不好不要钱哦~~）

其实，之前看过我写的文章的同学可能知道，我写过一篇关于《跨域及跨域资源共享》（没有看过的同学，可以从这<a href="http://www.devsai.com/2016/11/24/talk-CORS/" target="_blank">进去</a>）。比较全面的介绍了跨域的多种解决方案，以及说明了跨域资源共享.

你们会不会想：那既然已经写过了，为什么又写一篇？ 是不是博主已经没啥东西可写了。

别急，接下来，让我跟你们慢慢道来。

# 你们所知道的

看过之前写的《跨域及跨域资源共享》或看过多篇CORS文章的同学可以选择性的跳过这一小段了。

就像你们看到过的相关的文章，讲跨域资源共享，一般讲其原理时，必定要讲到跨域资源共享的请求有两种（也有很多没有讲到）：

>	简单请求 （Simple Request）
>	预检测请求 (Preflight Request)

然后就会进一步的讲到，什么时候发只发简单请求，又什么时候会在发真实的请求前，先发预检测请求，普遍的都是这么说的（包括我之前写的也是）

以下几种情况时都满足时是简单请求

__request header 是简单的请求头__
	
>	Accept
>	Accept-Language
>	Content-Language
>	Last-Event-ID
>	Content-Type
>   等等非自定义的请求头

__request method 是下面的请求类型__

>	HEAD
>	GET
>	POST

__Content-Type 只限三个值__

>	application/x-www-form-urlencoded、multipart/form-data、text/plain


如果不满足以上条件的都会先发送预检测请求，即为`OPTIONS`请求类型的请求

几乎都是这么说的，差别只是描述方式不同，比例下面的别人写的：

![](/images/2016/cors/preflight01.png)

什么？ 不信， 那你随便搜索几篇相关的文章看看。


# 那么，这有什么问题

先来做个例子吧。

假设要实现带进度条的上传功能，接口不是同域上的，服务端已经给配置了支持跨域资源共享的响应头，那我们直接用XmlHttpRequest就可以了

javaScript代码大概如下：

```
var xhr = new XmlHttpRequest();
xhr.onreadystatechange = function() {
	// do something
}

xhr.upload.onprogress = function(){
	// do something
}

xhr.open('POST','http://127.0.0.1/upload');
var fd = new FormData();
fd.append('file',file);
xhr.send(fd);
```

然后上传文件并查看下请求

![](/images/2016/cors/preflight02.png)

What? 为什么会有两个请求啊。 是不是它不满足简单请求的要求（已不记得简单请求的同学往上再看看）

那么，我们来看看该真实请求的请求头

![](/images/2016/cors/preflight03.png)

简单请求要求：

| 要求点 			  | 实际内容        	  	| 是否满足 	  	  		| 
| :-------------:     | :-------------: 	| :-------------: 	        |
| 请求方式     | POST 	| 满足 	        |
| 请求头     | 都是非自定义的请求头 	| 满足 	        |
| Content-Type     | multipart/form-data 	| 满足 	        |

不是都满足了吗？那为什么，会有两个请求，为什么在发送真实请求前还发了`OPTIONS`方式的请求。

为什么！！！整个人感觉都不好了！！！

# 变个魔术

把上面的javaScript代码改动下:

```
var xhr = new XmlHttpRequest();
xhr.onreadystatechange = function() {
	// do something
}

xhr.open('POST','http://127.0.0.1/upload');
var fd = new FormData();
fd.append('file',file);
xhr.send(fd);
```

去掉了`xhr.upload.onprogress`，上传后再来看下请求及请求头：

![](/images/2016/cors/preflight05.png)

![](/images/2016/cors/preflight04.png)

只有一个请求，请求头内容还都一样。 (这到底是怎么回事...有种再也不相信爱情的赶觉了！！！)

看到这里的同学，有木有觉得博主在坑你们，放了两张相同的请求头截图就想糊弄。

俗话说得好，不试不知道，一试吓一跳，要不，你们也亲自试试，一试便知真假。

再次双手奉上<a href="https://github.com/huangxiangsai/web-upload-demo" target="_blank">demo</a>（喜欢的顺便点个赞哦~）。

# 分析问题

从上面的两小段JS看出，只是去除了上传的进度信息事件。也就是说加了进度事件就多发了个预检测请求。

那么，还有没有其他的事件了？添加其他的事件会不会也会发送预检测请求呢？

事件有`onerror`,`onloadstart`等等。经过博主的测试，上述答案是肯定的，添加其他事件后，确实也会发生预检测请求。

追求真理的同学们，在博主的demo里改改试试吧。


现在已经知道了问题的所在，由上传相关事件导致了跨域请求多发了预检测请求，说好的简单请求(Simple Request)呢~

博主抱着对问题刨根问底的精神，再次查看<a href="http://www.w3.org/TR/cors/#resource-requests" target="_blank">cors</a>相关文档，找到了如下的内容：

>	- If the following conditions are true, follow the simple cross-origin request algorithm:
>	
>	    - The request method is a simple method and the force preflight flag is unset.
>	
>	    - Each of the author request headers is a simple header or author request headers is empty.

通过这段，我们知道，原来除了我们所知道的简单请求的几大特征外，还提到了`force preflight flag`，这是什么鬼？

难道是因为设置了它？ 那么什么时候设置了`force preflight flag`?

上面我们知道了因为上传事件导致了发送预检测请求，会不会是上传监听事件的时候给设置了`force preflight flag`，
然后在<a href="http://www.w3.org/TR/2011/WD-XMLHttpRequest2-20110816/" target="_blank">XmlHttpRequest level 2</a> 中的找到了相关的内容，以证实我的猜测是正确的。


有下面几段内容：

>	force preflight flag
>		The upload events flag.

从这段可以知道，`force preflight flag`与`upload events flag`是对应的,看到这里就知道了，只要`upload events flag`被设置`true`

那么就等于`force preflight flag`被设置了`true`，这时，不管请求的类型的是不是*simple method*，也不管请求头是不是*simple header*，都会先发送预检测请求。

接下来，我们再来看看`upload events flag`会在什么情况下被设置呢？

>	If the asynchronous flag is true and one or more event listeners are registered on the XMLHttpRequestUpload object set the upload events flag to true. Otherwise, set the upload events flag to false.


原来，当`asynchronous flag`为`true`并且XMLHttpRequestUpload(即示例中的xhr.upload)的一个或多个事件被监听的时候，`upload listener flag`就会被设置了。

这也正如之前测试的，当加了`xhr.upload.onprogress`后，出现了预检测请求。

到这里总算水落石出了。

这里还需要说明的一点是，`the asynchronous flag`就是`xhr.open()`的第三个参数，当未设置第三参数时，默认为异步，也就是`the asynchronous flag`为`true`

如果第三个参数设置为`false`，那么即使有上传的监听事件也不会发送预检测请求（Preflight Reuqest）

# 总结

以后还会不会理直气壮的在别人面前说，只要是满足几大条件（是非自定义的请求头，是`GET`or`POST`or`HEAD`,或`Content-Type`是那三种值的）就是简单请求 ，就不会发生预检测请求。

通过本文可知，并非满足这几大条件就一定是简单请求的，
应该要加个前置条件，是否是在上传请求中跨域，是否是异步的，是否监听了上传事件。

看到这，可能你想说，写这么多有啥用，对实际开发有帮助吗？或许没什么实际的帮助吧，又或许你也不会碰到吧。

但，最起码当你碰到的时候，你看到了两个请求，再看了下代码，你已经心里就有数了，知道这是怎么一回事了。

一直认为，做技术的对碰到的问题要知其然，更要知其所以然。








































