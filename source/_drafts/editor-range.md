---
title : 文档操作之Range详解 
---
# Range

欢迎阅读本文，本文预计阅读耗时20'30''

如果你还不了解过Range,那么接下来得Range三问,会让你对Range，有个比较清晰的认识。


## Range是什么

Range 相当于`document`文档中的一个片段。

这个片段可能包括了一个或多个的`Node`或`Text Node`，即元素节点和文本节点。


## Range怎么来

有四种方式可获得`Range`：

`Range`对象实例化一个`range`

```
var range = new Range()
```


可以通过`Document`对象中的`createRange()`方法获得

```
document.createRange()
```




或者，也可以通过`Document`对象的`caretRangeFromPoint()`方法获得

```
document.caretRangeFromPoint(float x, float y);
```


最后，也可以通过`Selection`对象的`getRangeAt()`方法获得

```
var selection = window.getSelection()

selection.getRangeAt(0);
```

四种方式比较

`new Range()`与`document.createRange()`一样， 获得的`Range`对应的片段就是整个`document`文档。

`document.caretRangeFromPoint(x,y)` ,  Range 为在document中确定坐标的指定片段。

参数`x,y`坐标则可以通过事件中的`clientX,clientY`属性获得。比如在点击事件的回调函数中通过`e.clientX`获得，`e`为回调函数的参数。

但这种方法并不是标准的，IE不支持。


`selection.getRangeAt(0);`  `range`为所选区域的文档片段。



## Range能干嘛

通过Range能获得对应相关的Node，通过Node,就可以对指定区域的文档片段内容进行增删改查的操作了。


## Range的6个只读属性

### Range.collapsed

返回Boolean值， true表示`range`的开始点与结束点是否在同一个位置。

所以通过`document.createRnage()` 方法，`document.caretRangeFromPoint(x,y)`方法，或者未选择时的`selection.getRangeAt(0)`方法得到的Range,其`collapsed`属性都为`true`，只有当文档的内容被选择时，其值才为`false`


### Range.commonAncestorContainer

返回的是`Node`,该Node 必须是包含了`startContainer Node`，以及`endContainer Node`。

### Range.startContainer 

返回Range文档片段中最开始的Node

### Range.endContainer 

返回Range文档片段中最后的Node

### Range.startOffset

返回一个数字表示Range开始边界，从`startContainer`节点中的哪个位置开始。也就是说，`startOffset`位置前的内容
虽然是`startContainer`节点中的，但并不属于`Range`。

当`startContainer`节点类型为`Text`,`Comment`,`CDATASection`,此时`range`的开始边界为`startContainer`中的第`Range.startOffset`个字符。
`Range.startOffset`表示的数字为`startContainer`开始的字符数。

当`startContainer`是除上述以外的类型时，此时`range`的开始边界为`startContainer`中的第`Range.startOffset`个子节点

### Range.endOffset

与`Range.startOffset`相对应，表示`Range`结束边界 ，同样，`Range.endOffset`返回的数字意义与`endContainer`节点的类型有关。

`endContainer`节点类型为`Text`,`Comment`,`CDATASection`,此时`range`的结束边界为`endContainer`中的第`Range.endOffset`个字符。

`endContainer`为其他类型时，`range`的结束边界为`endContainer`中的第`Range.endOffset`个子节点。


需要注意的是当`Range.collapsed : true `时， `commonAncestorContainer,startContainer,endContainer`这三个属性返回的是同一个`Node`，此时`startOffset`与`endOffset`值也相等



## Range的方法详解

简单的总结下`Range`的方法:
>	`Range`的大多数方法其实都是对以上的6种只读属性间接的赋值。


### range.setStart(startNode, startOffset);

设置range的开始位置，两个参数都必须设置，设置完以后，`range.startContainer`就等于`startNode`,`range.startOffset`就等于`startOffset`。

该方法有兼容性问题，IE9+才可用。

### range.setEnd(endNode,endOffset)

与上方法雷同，不再多说了。同样该方法有兼容性问题，IE9+才可用。


### range.setStartBefore(referenceNode);

通过该方法设置后，`range.startContainer`为参数`referenceNode`的父节点，`range.startOffset`为其父节点中的`referenceNode`子节点位置

### range.setStartAfter(referenceNode);

通过该方法设置后，`range.startContainer`为参数`referenceNode`的父节点，与`range.setStartBefore(referenceNode)`方法一样，不同的是`range.startOffset`为其父节点中的`referenceNode`子节点之后一个节点位置



