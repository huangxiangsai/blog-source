---
title: css之内容居中显示内容
date: 2015-06-15 16:36:59
tags: [前端,css]

---

之前一直知道想要居中显示元素  就需要如下样式
  
    margin:0 auto;

但实际用起来 总不那么顺心，经常性的，有时有效果 ，有时又没效果了。

总结一句话，我的css弱爆了。 

为此请教了公司css专家 ，经过仔细的讲述后，学会了两种可居中的方法

*  就像我前面提到的一样`margin:0 auto;`  确实可以居中 。

 但是，是有条件的， 需要居中的元素必须是设定了宽了的，而且不能是百分比，否则就没看不出效果。

* 还有种方式就是`text-align:center;`  之前我一直以为这属性只能用作文本的居中，其实它也能作为元素的居中，

 但也有个要注意的地方，居中的元素不能是块级元素，只能是行内元素。  

 如果想让一个块级元素使用这种的居中方式，那么就必须让其变成行内元素。

 可以通过设置CSS  `display`属性，设置为`inline` 或者`inline-block` 使元素变为行内元素。


下面通过几个例子来看看上所述两种方法的效果:

<p data-height="268" data-theme-id="0" data-slug-hash="gapQvr" data-default-tab="result" data-user="huangxiangsai" class='codepen'>See the Pen <a href='http://codepen.io/huangxiangsai/pen/gapQvr/'>gapQvr</a> by 黄向赛 (<a href='http://codepen.io/huangxiangsai'>@huangxiangsai</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="http://assets.codepen.io/assets/embed/ei.js"></script>

上面这个例子，就同时用到了两种元素居中方式。外层使用了margin的居中，里面层使用了text-align的方式居中。

