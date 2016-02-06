---
title: 检测浏览器支持html5特性
date: 2015-04-25 16:36:59
tags: [前端]
---

## 前言
因为html5是各种新特性的集合，所以如果我们只说某个旧浏览器支持或不支持HTML5。 这个说没有任何意义，存在一定的误解，
应该是某个旧浏览器是否支持HTML5的某些特性，例如：canvas、audio、web worker...等等。

## 检测HTML5特性的几种方式

*  判断在全局的对象（例如：window）中是否存在某属性  

   (例如：Worker , FileReader , DataView , Blob ....)
*  创建某个元素，判断该元素是否存在某属性 
   
   (例如 ： `var el = document.createElement("canvas"); if(el.getContext){}`)
*  创建某个元素，判断该元素的方法是否存在，并且调用它检查它的返回值。
  
```
function supports_h264_baseline_video() {
     if (!supports_video()) { return false; }
     var v = document.createElement("video");
     return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
}
if(!supprots_h264_baseline_video()){return false;}
```

*  创建某个元素，设置某个属性的值，判断是否支持这个属性的值

    例如 ： input元素
    默认创建出来的input, type属性是'text' ,我们知道的type 还有 输入密码的`<input type="password">`、完成表单提交的`<input type="submit">`。 但在HTML5中又提供了很多其他的type。

   这里， 我们就可以使用 设置input的type属性，来判断当前浏览器是否支持HTML5的type。
 
```
function checkInputColor(){
   var myinput = document.createElement("input");
   myinput,setAttribute("type","color");
   return myinput.type !="text";
}
if(!checkInputColor()){return false;}
```


最后 ，如果你对上面这几种的检测方式都不感兴趣。你可以使用 <a href="http://www.modernizr.com/" target="_blank">modernizr</a> 一个用来检测HTML5、CSS3的js库。

例如：你想知道你用的浏览器是否支持canvas API ，你就可以这样：

```
if (Modernizr.canvas) {
    // let's draw some shapes!
} else {
    // no native canvas support available :(
}
```

本文参考：<a href="http://www.amazon.cn/gp/product/0596806027/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=0596806027&linkCode=as2&tag=devsai05-23" target="_blank">《HTML5: Up and Running》</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=devsai05-23&l=as2&o=28&a=0596806027" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


