---
title: Web开发之跨域与跨域资源共享
tags: [CORS,HTML5,jsonp]
date: 2016-11-24
description: "比较全的介绍了多种方案解决跨域相关问题。并对跨域资源共享做了介绍。"
---

# 同源策略（same origin policy）
 
1995年，同源政策由 Netscape 公司引入浏览器。为了防止某些文档或脚本加载别的域下的未知内容，防止造成泄露隐私，破坏系统等行为发生。

同源策略做了两种限制:
1. 不能通过*ajax的方法*或*其他脚本中的请求*去访问不同源中的文档。
2. 浏览器中不同域的框架之间是不能进行js的交互操作的。

现在所有的可支持javascript的浏览器都会使用这个策略。


## 怎么算同源

URL的三部分完全相同时我们就可以称其为同源,这三部分是: *`协议`*，*`域名（主机名）`*和*`端口`*都相同。

## IE 例外

当涉及到同源策略时，Internet Explorer有两个主要的例外

	授信范围（Trust Zones）：两个相互之间高度互信的域名，如公司域名（corporate domains），不遵守同源策略的限制。

	端口：IE未将端口号加入到同源策略的组成部分之中，因此 http://company.com:81/index.html 和http://company.com/index.html  属于同源并且不受任何限制。

# 跨域的几种解决方法

虽然同源策略很有必要，但有很多时候我们还是需要去请求其他域的数据，如：调用不同业务的数据，而不同业务已子域区分；又或者是第三方公用的数据接口等等

由于各种原因，我们需要通过各种方式来请求到不同域下的资源。

## jsonp

jsonp是通过可以发出跨域请求的script标签,使javascript能够获得跨域请求的数据，并调用数据。

先看个例子：
文件index.js :

```
alert(123);
```

页面index.html:


```
...
<script src="./index.js"></script>
...

```

当加载页面`index.html`后，出`123`内容的弹窗。通过查看`index.js`的响应体，会发现响应内容就是`alert(123)`。

![](/images/2016/crossdomain/jsonp_1.png)

所以，可以这么思考，只要是通过script标签请求到的内容就会被当做js代码执行。

是否可以在script中的地址`src`不请求js文件，而是请求服务端的接口（即使不在同源下的），那么返回的内容就能获得到，并且会当成js代码来执行。（一般的script标签都会去请求js代码文件）

再来看下正常的服务端获取数据接口。

>	比如:有这么个接口`/getUserInfo/001`,通过ajax请求获得此接口数据`{"data" : {"name" : "devsai",like:"everything"}}`。

>	得到数据后在ajax中调用`showUserInfo(data)`来渲染页面，`data`就是接口数据。

如果现在用script标签来请求数据,那么同样可以获得数据，执行返回到的内容，因是`json`格式的数据，并不会报错，但也并没有卵用。获得接口的数据肯定是想做些什么的。

再想想，正常ajax请求后的js执行内容`showUserInfo(data)`,拿到数据后，调用了`showUserInfo`函数。

那么，用script标签来请求数据时，返回的内容直接是`showUserInfo(data)`不就行了，但服务端又不知道我们到底要执行哪个函数，即使事先约定了，但后面因某些事要改，那还得告诉服务端，太麻烦了。
如果知道要执行什么函数就好了。

当然，这是可以的，改造下接口，以参数的形式把函数名传给服务端。

```
<script src="/jsonp/getUserInfo/001?jsonp_fn=showUserInfo"></script>
```

Response返回的内容同样需要改造
```
Response:
	showUserInfo({"data" : {"name" : "devsai",like:"everything"}})
```
这样，通过jsonp，去跨域请求接口数据就完成了。
需要注意的是函数名需要挂在`window`下面，要不然会报函数名未定义。


## 改变源(origin)：通过document.domain与子域之间的跨域通讯

例如在`demo.devsai.com/index.html`页面里执行如下内容：

	document.domain = 'devsai.com';

执行该语句后，可以成功通过`devsai.com/index.html`的同源检测, 实现数据的通讯，
当然`document.domain`不能随意设置，只能设置成当前域，或设置成当前域的顶域。

document.domain常常被用于同站但不同域的情况，例如：`www.devsai.com`，下嵌入了iframe广告页面`ad.devsai.com`,想要实现两页面的通讯，就需要对两个页面都设置`document.domain='devsai.com'`。



## window.name

window对象有个name属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name的，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。

name只能是字符串。

页面a.html中:

```
<script>
window.name = 'page name index.html';
setTimeout(function(){
    window.location = 'http://localhost:8080/static/b.html';
}, 2000);
</script>
```
页面b.html:
```
<script>
	alert(window.name);
</script>
```

再来看看如何让a.html页面获取数据

用data.html作为请求数据地址:
```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Data</title>
</head>
<body>
	<script>
	window.name = '{ "name":"devsai","like" : "everything"}'; // 需要传入 a.html页面的数据，必须是字符串
	</script>
</body>
</html>
```

a.html：
```
...
<iframe src="http://localhost:8080/static/data.html" onload="getData();" frameborder="0" id="iframe_1"></iframe>
<script>
function getData(){
    var iframe = document.getElementById('iframe_1');
    //隐藏iframe
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
    iframe.onload = function(){
        console.log(iframe.contentWindow.name);
        var data = iframe.contentWindow.name;
        data = JSON.parse(data);//转成 JSON
        showUserInfo(data); 
    }
    iframe.src = 'about:blank';
}
function showUserInfo(data){
    console.log(data);
    // .....do something
}
</script>
...
```

当访问`http://127.0.0.1:8080/static/index.html`,便能获得来自不同域下`data.html`中的数据。

也可以做的更完善些，动态的生成iframe请求数据，用完即毁。

```
....
// 传入请求数据接口地址和回调函数
function requestData(url,successCB){
    var body = document.getElementsByTagName('body')[0];
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "getDataByWindowName");
    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.setAttribute("border", "0");
    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
    iframe.setAttribute("src", url);
    body.appendChild(iframe);
    setTimeout(function(){//防止iframe.src在没加载前就被替换
        iframe.onload = function(){
            var data = iframe.contentWindow.name;
            if(data){
                data = JSON.parse(data);//转成 JSON
                successCB && successCB(data);
            }
            iframe.parentNode.removeChild(iframe);
        }
        iframe.src = 'about:blank';
    }, 100);
}

//requestData("http://localhost:8080/static/data.html",showUserInfo);
...
```

这就是使用window.name来进行跨域。

## window.postMessage

window.postMessage方法是html5的新特性之一，
可以使用它来向其它的window对象发送消息，不管这个window对象是属于同源或不同源。

通过window.postMessage允许浏览器**windows, tabs, and iFrames**之间跨域通讯。

之前写过一篇关于`window.postMessage`的，做了详细的说明+演示页面+演示代码,<a href="http://www.devsai.com/2016/02/17/postMessage/" target="_blank">去看看</a>


## 服务端地址映射

例如一个网站上有各种不同的业务，不同的业务有其对应的子域。

如：`ad.devsai.com;upload.devsai.com;live.devsai.com`，分别对应广告业务，上传业务，直播业务。

想在`www.devsai.com`中做交互，或获得数据，便会受跨域影响。

造成跨域的原因是因为请求数据的源不同，那只要请求的源一样，便没有跨域问题了。

这也是可以办到的，只需要web服务做下代理，或称之为地址映射。

拿Nginx举例，需要在web服务上做如下配置：

```
...
lcaotion /ad {
	proxy_pass http://ad.devsai.com
}

location /upload {
	proxy_pass http://upload.devsai.com
}

location /live {
	proxy_pass http://live.devsai.com
}
...
```

然后就可以在以`www.devsai.com/ad/`的方式去调用广告业务。



# CORS跨域资源共享

当一个发起的请求地址与发起该请求本身所在的地址不在同源下时，称该请求发起了一个跨域的HTTP请求。

有些的跨域请求是被允许的`<img>`,`<script>`,`<link>`图片，脚本，样式及其他资源 ，加载这些数据时即使不在同源下面也同样被允许，如今的网站通常也会去引用不在同源下的这些资源，如做CDN加速。

但也有些不被允许，正如大家所知，出于安全考虑，浏览器会“限制”脚本中发起的跨站请求，比如：XmlHttpRequest。

除了XmlHttpRequest外，还有以下几种跨域请求做了相应的安全限制。

比如：

__1__ 前面说的iframe，通过设置`src`可以发起跨域请求，但对请求到的内容进行操作就不被允许了。如执行`iframe.contentWindow.name`就会报错。

--------
__2__ `<img>`标签上`crossorigin`属性是一个CORS的配置属性，目的是为了允许第三方网站上的图片（即不在同源上的图片）能够在canvas中被使用。
如果没有配置改属性，又跨域请求了图片，当调用canvas中的`toBlob()`, `toDataURL()`, 或`getImageData()`方法的时候，会报错。
```
var img = new Image,
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    src = "https://sf-sponsor.b0.upaiyun.com/45751d8fcd71e4a16c218e0daa265704.png"; // insert image url here
img.crossOrigin = "Anonymous";

img.onload = function() {
    console.log(img);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage( img, 0, 0 );
    localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );
}
img.src = src;
```

--------
__3__ 同样的script也可以有`crossorigin`属性，
script本身没有跨域问题，不然jsonp就没法用了。但如果请求的不是同源下的js文件，发生错误后，无法通过window.onerror事件捕捉到详细的信息

例如加载index.js文件，其中a未定义:

```
var b = a;
```

*同源下的 window.onerror报错信息*

![](/images/2016/crossdomain/error1.png)

*跨域下的 window.onerror报错信息*

![](/images/2016/crossdomain/error2.png)


通过script标签上添加crossdomain属性,并在服务上配置响应头。

```
<script src="http://lcoalhost:/static/index.js" type="text/javascript" charset="utf-8" crossdomain></script>
```
在去看onerror中的报错信息就和同源下的报错信息一样了。

--------
__4__ Web字体 (CSS 中通过 @font-face 使用跨站字体资源)，使用非同源地址，同样会报错。


还需要注意的一点是，跨域请求并非是浏览器限制了请求，而是浏览器拦截了返回结果。不管是否跨域，请求都会发送到服务端。
但也有特例，有些浏览器不允许从HTTPS的域跨域访问HTTP，比如Chrome和Firefox，这些浏览器在请求还未发出的时候就会拦截请求。

解决这类跨域问题的方法就是`*CORS*`，对于简单的请求来说，前端这边都不需要做任何的编码就能实现跨域请求，
只需要服务端配置响应头"Access-Control-Allow-Origin:*"。

## 什么是CORS

CORS是一个W3C标准,全称“跨域资源共享”（Cross-origin resource sharing）

跨源资源共享标准通过新增一系列 HTTP 头，让服务器能声明哪些来源可以通过浏览器访问该服务器上的资源。

## CORS服务端设置(Set Response Header)

__Access-Control-Allow-Origin__

根据Reuqest请求头中的*Origin*来判断该请求的资源是否可以被共享。

如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（该字段的值为服务端设置Access-Control-Allow-Origin的值）便知出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。此时HTTP的返回码为200，所以 这种错误无法通过状态码识别。

__Access-Control-Allow-Credentials__

指定是否允许请求带上cookies，HTTP authentication，client-side SSL certificates等消息。
如需要带上这些信息，`Access-Control-Allow-Credentials:true`并需要在XmlHpptRequest中设置`xhr.withCredentials=true`。

需注意的是，当设置了the credentials flag为true,那么*Access-Control-Allow-Origin*就不能使用"`*`"

__Access-Control-Max-Age__

可选字段，指定了一个预请求将缓存多久，在缓存失效前将不会再发送预请求。

__Access-Control-Allow-Methods__

作为预请求Response的一部分，指定了真实请求可以使用的请求方式。

__Access-Control-Allow-Headers__

作为预请求Response的一部分，指定了真实请求可以使用的请求头名称(header field names)。


## CORS两种请求方式

CORS的有两种请求方式： 简单请求(Simple Request) 和 预请求(Prefilght Request)

## 简单请求(Simple Request)

只要同时满足以下三大条件，就属于简单请求。

a) 请求方式是以下几种方式之一
	* GET
	* POST
	* HEAD

b) content-type必须是以下几种之一
	* application/x-www-form-urlencoded
	* multipart/form-data
	* text/plain

 
c) 不会使用自定义请求头（类似于 X-Modified 这种）。


## 预请求(Prefilght Request)

如果不满足简单请求的三大条件，会在发送正真的请求前，发送个请求方式为'OPTIONS'的请求，去服务端做检测，

1） 请求方式不是GET,POST,HEAD
	
那么需要在响应HEAD配置允许的请求方式，例如：`Access-Control-Allow-Methods:PUT,DELETE`

2) 使用自定义请求头,如x-devsai ，那么需要在服务端相应配置允许的自定义请求头:`Access-Control-Request-Headers: x-devsai`

一旦检测不通过，浏览器就会提示相应的报错，并不会发生真实的请求。


## CORS兼容性

![](/images/2016/crossdomain/cors_jrx.png)

从上图可只IE11,以下的就不支持CORS了。但实际上再IE8,IE9,IE10中，可以用XDomainRequest对象代替XmlHttpReuqest，发送跨域请求。


```
var xdr = new XDomainRequest(); 

xdr.open("get", "http://www.devsai.com/xdr");

xdr.send();
```


# 结语

最后，总结下各种跨域方案的特点，还记得本文开始说的，同源策略的两种限制吗？

>	1. 不能通过__ajax的方法__或__其他脚本中的请求__去访问不同源中的文档。
>	2. 浏览器中不同域的框架之间是不能进行js的交互操作的。

把第1种标记为__TYPE_1__,第二种标记为__TYPE_2__，对上述的几种解决跨域的方法分下类。

__window.name__  需要注意name只能是字符串

解决的限制 ：__TYPE_1__,__TYPE_2__

缺点： 接口返回的内容必须都是html里嵌入script脚本。

---------
__document.domain__  通过修改domain跨子域

解决的限制 ：__TYPE_2__

缺点： 仅支持同个域下的子域跨域，跨域能力有限

---------
__window.postMessage__ 用于iframe、window、tabs之间的跨域通讯

解决的限制 ：__TYPE_2__

缺点： 兼容问题，IE10以下受限，IE8以下无效

---------
__jsonp__ 是之前最常用的解决跨域请求的方法。

解决的限制 ：__TYPE_1__

缺点： 不能用于`POST`请求

---------
__服务端地址映射__  前端不需要管，并能解决跨域请求问题的一种方法。

解决的限制 ：__TYPE_1__

缺点： 非要说缺点，那就是要说服服务端同学,而且一般场子铺大了的公司只用同源，不太可能。

---------
__CORS__ 感觉目前比较常用的解决跨域请求的方法。

解决的限制 ：__TYPE_1__

缺点:  也是兼容性问题


真正开发过程中，需针对不同情况，使用不同的解决之法。






