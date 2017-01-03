---
title: 聊聊web上传
date: 2016-11-08
tags: [upload,HTML5]
comments : true
toc: true
description: "对 web 上传的多种解决方案进行了总结，从最简单的上传说起，说到常用的上传方案。最后对几种常用的上传组件进行了介绍。"
---



# web上传的实现方式


*   表单提交上传
*   iframe表单提交上传
*   flash上传
*   h5上传—xhr2上传（h5中规定的xhr2，也可称之ajax上传）
*   h5上传—websocket上传


# 表单提交上传

## 表单出生

1995年十一月在[RFC 1866](https://www.ietf.org/rfc/rfc1866.txt)中第一次出现了`form`标签，在其中还出现了很多其他的标签也一直使用到现在。同年同月在[RFC 1867](https://www.ietf.org/rfc/rfc1867.txt)中在`form`的基础上提出了html关于文件的上传的建议,


## 普通表单提交与上传表单提交区别

普通表单

```
 <form action="/" >
 	<input type="text" name="name"></input>
 	<input type="text" name="age"></input>
 	<button type="submit">确定</button>
 </form>
```

上传表单

```
<form action="/upload" method="post" enctype="multipart/form-data">
	<input type="file" accept="images/*"></input>
	<button type="submit">上传</button>
</form>
```

上传表单中，对`form`标签的`enctype="multipart/form-data"`。

而普通的表单提交，一般不用去定义该属性，存在个默认的值“*x-www-form-urlencoded*”。

在[RFC 1867](https://www.ietf.org/rfc/rfc1867.txt)中，对`input`标签type属性添加了新的值`file`，也为`input`标签添加了一个新的属性`accept`来过滤上传文件的类型。

同时也定义了一个新的`MIME media type`：`multipart/form-data`,在`form`标签中定义`enctype="multipart/form-data"`。

在点击提交时，两者的请求头与请求体也有所不同。

普通表单提交


```
#request header
Content-type : x-www-form-urlencoded;setchart:UTF-8

#request body
form-data
name:xxx
age:111
```

上传表单提交

```
#request header
Content-type : multipart/form-data; boundary=----WebKitFormBoundaryK8NOU66bOhWkzidB

#request body
------WebKitFormBoundaryK8NOU66bOhWkzidB
Content-Disposition: form-data; name="resume"; filename="test-text-file.txt"
Content-Type: text/plain
Test text file for testing file uploads.
------WebKitFormBoundaryK8NOU66bOhWkzidB--
```

上传表单提交，除了在Content-type中改变了MIME type,同时在其后添加了个属性`boundary`，用于表示提交的表单中各个字段的边界分割，不同浏览器生产的这个边界字符串是不同的。如上例子中的`----WebKitFormBoundaryK8NOU66bOhWkzidB`也只是使用webkit内核的才会出现`----WebKitForm `。

**表单上传提交的优缺点**

对现在的web上传来说，那时候的表单上传没什么优点，非要说优点，那就是简单，简单到不需要些一行JS代码。

说缺点的话，那就是一箩筐了。
上传文件会页面跳转，不能选择多文件上传（想要上传多文件，就必须有多个`input`），不能限制上传大小，不能获得上传进度信息，不能预览，等等所有现在的上传需要都无法满足。

PS: 
HTML5中对`<input type="file">`添加了个新属性`multiple`，使之能够选择多文件，从而让表单上传提交变得方便。但话说，都有HTML5了，还需要用这种页面跳转的方式做上传吗？

HTML5也添加了文件对象(`File`)，可以方便的获得文件本身的一些信息，name,size,type，在上传前知道文件的大小，实现限制上传大小；





# iframe表单上传提交

是表单上传提交的优化版，本质上也是表单上传提交，一般都是通过创建个隐藏的iframe来提交表单，以此达到页面不跳转上传。

thml代码

```
<form method="POST" action="/iframeUpload" id="my_form" enctype="multipart/form-data" >
    <div class="form-group">
       	<a href="javascript:;" class="btn btn-default chooseFile">选择文件
          	<input type="file" name="inputFile"   id="inputFile" /></a>
        <button  id="submit_btn" type="submit" onclick="fileUpload();">Upload</button>
    </div>
</form>
```

javascript代码

```
function eventHandler(){
	//...get data ,or do somthing..
}

function fileUpload(){
	var form = document.getElementById('my_form');
	var iframe = document.createElement('iframe');
	iframe.setAttribute("id", "upload_iframe");
    iframe.setAttribute("name", "upload_iframe");
	iframe.setAttribute("width", "0");
	iframe.setAttribute("height", "0");
	iframe.setAttribute("border", "0");
	iframe.setAttribute("style", "width: 0; height: 0; border: none;");
	form.parentNode.appendChild(iframe);
	iframeId.addEventListener("load", eventHandler, true);
	iframeId.attachEvent("onload", eventHandler);
	form.submit();
}
```



可表单上传提交的其他缺点还是存在。

还是不能获得上传进度信息，想要获得上传进度信息，需要服务端的支持，轮询服务端接口。

并且iframe无法实现跨域上传

所以总体来说，iframe更适合上传单个文件，并上传的文件较小（文件较大 ，没有进度条信息的话，用户体验太差）。






# flash上传

在HTML5之前，最流行的上传方式，能实现的功能也较多。

## flash上传的优点

1. 支持上传进度条
2. 支持预览（图片等）
3. 支持多文件上传
4. 支持图片压缩
5. 支持分片上传
6. 支持暂停上传
7. 支持秒传

## flash上传的缺点

1. 需要浏览器安装flash插件
2. 网站需要加载相应的swf文件
3. 对移动端不兼容（iOS一直不支持，Android5.0之后也不支持）

## flash跨域上传

如果网站的地址，与上传请求的地址不是同域，则会存在flash数据传输跨域问题。

需要在请求地址的服务端根目录下添加`crossdomain.xml`文件

文件内容如下：

```
<?xml version="1.0" encoding="UTF-8"?>
<cross-domain-policy>
	<allow-access-from doamin="*"/>
</cross-domain-prolicy>
```


# H5—xhr2（XmlHttpRequest level 2）上传

xhr即我们常说的ajax(Asynchronous JavaScript and XML)

**xhr2的特点**


1. 可以设置HTTP请求的时限。
2. 可以获取服务器端的（或向服务端发送）二进制数据。
3. 可以使用FormData对象管理表单数据。
4. 可以上传文件。`xhr.upload`(upload = XMLHttpRequestUpload)
5. 可以获得数据传输的进度信息, `xhr.upload.onprogess`。
6. 可以请求不同域名下的数据（跨域请求）。

主要javascript代码



```
function uploadFile(file){
   var xhr = new XMLHttpRequest();
   xhr.open('POST','/upload',true);
   var formData = new FormData();
   xhr.upload.onprogress = function(data){
      var per = Math.ceil((data.loaded/data.total)*100);
      //$('#'+file.uid+' .progress-bar').css('width',per+'%');
   }
   xhr.onreadystatechange = function() {
       if (xhr.readyState == 4 && xhr.status == 200) {
         // Every thing ok, file uploaded
           var res = JSON.parse(xhr.responseText);
           if(res.code ==200){
               // upload success
           }
       }
   };
   formData.append("upload_file", file);
   formData.append("filename",file.name);
   xhr.send(formData);
}
```


xhr2在结合H5的其他特性，可以实现上述flash上传的所以功能外，还可以实现`拖拽上传`功能。

由于诸多HTML5特性（Blob ,xhr2,FileReader,ArrayBuffer等）在IE10+中才有效，
所以xhr2上传更适合在chrome，firefox等高版本的浏览器或和移动端使用。



# CORS(跨域资源共享)

允许一个域上的网络应用向另一个域提交跨域 AJAX 请求。启用此功能非常简单，只需由服务器发送一个响应标头即可。例如：
`Access-Control-Allow-Origin: http://example.com`

当然还有其他的一些配置，比如配置允许的自定义头，允许的请求方式等等。这里不作详细说明，具体内容可查看<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS?redirectlocale=en-US&redirectslug=HTTP_access_control#Preflighted_requests" target="_blank">这里</a>


![cors](/images/cors.png)
这图清晰的整个跨域资源共享的请求过程。


# H5—websocket上传

二话不说，上代码:
 

```
var url = "ws://localhost:8081/upload";
var ws = new WebSocket(url);
ws.binaryType = 'arraybuffer';
ws.onopen = function () {
    window.console.log('websocket connection success ...');
};

//...
ws.onerror = function (error) {
  window.console.log('WebSocket Error ' + error);
};

//...
function uploadFile(file){
   //实例化FileReader对象
   var fr = new FileReader();
   //定义文件加载完的监听事件，执行回调函数 
   fr.addEventListener("loadend", function() {
      ws.send(fr.result);
   });
   //把文件加载进ArrayBuffer中
   fr.readAsArrayBuffer(file);
}
```


实际使用中，浏览器websocket用做上传较少

websocket上传存在几个问题：
1. 一般对于现有的上传服务，服务端需要单独开发接口
2. 同样无法获得上传的进度信息（变通方式：必须使用分片来模拟进度）

# 简单比较几种上传组件

*swfupload*

flash实现的上传组件，在h5或移动端未流行的时候，是比较常用的上传方式。
理由是功能强大。


*<a href="https://blueimp.github.io/jQuery-File-Upload/" target="_blank">jQuery-File-Upload</a>*

在github上的人气相当的高，是上述所说iframe与xhr2上传的结合，介绍说支持IE6以上浏览器的上传功能。

此话也不假，iframe用的就是form表单提交上传，确实可以在IE7，IE8等浏览器中完成上传。
但也就是上传，上传相关的其他"特效功能"都实现不了。所以在我看来，jQuery-File-Uplaod更适合用于chrome ,firefox等或移动端的上传。

*<a href="http://www.uploadify.com" target="_blank">Uploadify</a>*

是个基于swfupload的上传组件，同时也支持xhr2上传。是falsh上传与xhr2上传的结合，同样的功能强大。对浏览器的兼容要比jQuery-File-Upload要更好。

*<a href="http://fex.baidu.com/webuploader/" target="_blank">webUploder</a>*

与Uploadify一样是falsh上传与xhr2上传的结合，但从查看两者的API会发现，webUploader实现的功能要更多，更强大。 比如：分片上传，MD5秒传，图片压缩上传


最后双手奉上<a href="https://github.com/huangxiangsai/web-upload-demo" target="_blank">web上传Demo</a>




