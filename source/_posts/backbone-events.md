---
title : Backbone系列篇之Backbone.Events源码解析
tags : [JavaScript,Backbone,源码]
date : 2016-12-10
description: "Backbone源码阅读首篇，主要讲了Backbone.Events，对内部代码进行了分析。"
---

一直想着读读源码，但一直没有找到目标，一些流行的框架，大多代码量不少。

就像是面对着高耸如云的山峰，抬头望去，就已经没了攀登的勇气。

俗话说的好，凡事得一步一个脚印，一口吃不出个胖子。

大框架搞不定，可以短小精悍的类库下手。

打BOSS前必定要杀掉无数的小怪。

而，backbone就是个非常好的选择，加上它的注释也就2000行左右。

也在网上看到一些对Backbone源码的解析，但或多或少的有以下几个情况：

* 一些Backbone解析，只做了部分就停更了
* Backbone解析的，据现在已有年代，解析的源码与现在的有略微的出入
* 对源码的解析，多少带有阅读者的想法

最后一点，也是最重要的一点，并不是阅读者的想法不对，
而是想，如果自己去阅读，或许能得到不同的想法。

而且对于阅读源码的来说，他从源码中获得的收获，一定是要比写出来的多。

我建议大家去看别人对一些源码的解析，更建议自己也去试着读读源码。
这样，自己对源码更深入理解的同时，还可以对别人做的分析，进行更深层次的探讨。

# Backbone.Events 事件机制

本文中会出现部分的源码，点击这里<a href="https://github.com/jashkenas/backbone" target="_blank">查看</a>完整源码

Events 相关代码有200多行

对外定义的方法有:

![](/images/2016/backbone/backbone-events-api.png)


代码开始，就先定义了Backbone.Events，这是为什么呢

因为Backbone的其他部分对象都是继承了Events，也是就说,Backbone.Model,Backbone.Collection,Backbone.View,Backbone.Router

都可以使用Events的属性。

Backbone.Events也可以使用在任何的对象上，就像这样:`var o=_.extend({},Backbone.Events);`

然后`o`对象，就可以随心所欲的做到订阅/发布了。

上述的API方法可以分三部分：

![](/images/2016/backbone/events-02.png)

* 绑定事件 __on,listenTo,once,bind__ 

首先，`on`和`bind`是完全一样的，只是取了个别名。方便大家的使用习惯。

`listenTo`官方说明是对`on`控制反转。如何反转，后面具体说明。

`once`就很好理解了，注册的事件只执行一次,完了自动解绑。这也就是为什么下面的解绑方法中没有对其解绑的动作了。（一次性筷子，用完就扔，不需要洗）

* 解绑事件 __off,stopListening,unbind__ 

同样的`off`与`unbind`除了方法名不同外，作用完全一样。

`stopListening`也是用来解绑的，但它比较厉害了，对调用对象解绑解的彻彻底底。

* 触发事件 __trigger__  

通过此方法可以触发单个或同时触发多个事件。`trigger(eventname)`， 第一个参数为事件名，其他的参数为传给事件执行函数的参数。


## listenTo(`on`的控制反转)


```
object.listenTo(other, event, callback) 
```

让 object 监听 另一个（other）对象上的一个特定事件。不使用other.on(event, callback, object)，而使用这种形式的优点是：listenTo允许 object来跟踪这个特定事件，
并且以后可以一次性全部移除它们。callback总是在object上下文环境中被调用。


这里有个概念叫`Inversion of Control(IoC控制反转)`
这是种主从关系的转变，一种是A直接控制B，另一种用控制器（`listenTo`方法）间接的让A控制B。


通过`listenTo`把原本`other`主导绑定监听事件，变成了由`object`主导绑定监听事件了。

## 与`on`比较

从功能上来说，on,listenTo是一样的。

来看个例子：

```
var changeHandler = function(){}

model.on('change:name',changeHandler,view);

```

或者可以这样

```
view.listenTo(model,'change:name',changeHandler);

```

两种方式的作用是一样的，当model的name发生改变时，调用view中的方法。

可当view中不止有一个model时呢

功能上来讲，还是无差别，但如果想要当离开页面时view需要销毁，view中model绑定的事件也需要注销时，看看两种绑定方式，对面这问题时会怎么办

**on**的解绑

```
var view = {
    changeName :function(name){
       //doing something
    }
}
model.on('change:name',view.changeName,view);
model2.on('change:name',view.changeName,view);

//view离开时，model如何解绑
model.off('change:name',view.changeName,view);
model2.off('change:name',view.changeName,view);

```


有多个model的话，需要进行多次的解绑操作。

再来看看**listenTo**的解绑


```
view.listenTo(model,'change:name',view.changeName);
view.listenTo(model2,'change:name',view.changeName);

//解绑
view.stopListening();

```

并不需要做更多的操作就能把view相关的监听事件给解绑。

而通过查看`stopListening`


```
  Events.stopListening = function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
    }

    return this;
  };
```
内部执行了多次的`.off(name, callback, this)`，相当于内部给做了用`on`绑定后的解绑操作。



## 深入了解listenTo

先举个例子,执行**view.listenTo(model,'change',changeHandler)**， 执行过程看下面注释：

```

  Events.listenTo = function(obj, name, callback) {
    //  obj = model
    if (!obj) return this;	

    // obj._listenId 不存在，执行 id = (obj._listenId = _.uniqueId('l'))  == 'l1'
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));  

    // this._listeningTo 不存在，执行 listeningTo = (this._listeningTo = {})
    var listeningTo = this._listeningTo || (this._listeningTo = {});

    // listening = this._listeningTo[obj._listenId]  : undefined ==  ({})['l1']
    var listening = listeningTo[id];

    // true 执行条件语句
    if (!listening) {
      // this._listenId == undefined , thisid = (this._listenId = _.uniqueId('l')) == 'l2'
      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));

      // this._listeningTo[obj._listenId]  = {....}
      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
    }

    internalOn(obj, name, callback, this, listening);
    return this;
  };
```

上述代码执行中，会调用内部函数`onApi`（在`internalOn`内调用），执行`handlers.push({callback: callback, context: context, ctx: context || ctx, listening: listening});`

执行完后：

```

model._listenId = 'l1'
view._listenId = 'l2'
view._listeningTo = {'l1' : {obj:model,objId : 'l1',id : 'l2',listeningTo: view._listeningTo,count : 0}}
model._listeners = {'l2' : view._listeningTo['l1'] }
model._event = {'change':[{callback: changeHandler, context: view, ctx: view, listening: view._listeningTo['l1']}]}

```

view._listeningTo 的key 为model._listenId ， 也就是说，增加一个model实例，就会增加一个key，
例如再执行：`view.listenTo(model2,'change',changeHandler)`。

所以通过_listeningTo属性，能够知道view与多少个model有关联。


这样，当执行`view.stopListening()`时，就能把model,model2上的监听事件全部移除了。


同样的,
model._listeners的key 为view._listenId, 例如:view2.listenTo(model,'change',changeHandler)，
那么会再生成一个view2._listenId, model._listeners的key将多一个。


## 为什么Backbone.Events会有**listenTo**和**stopListening**

在很多的类库中使用的事件机制都是没有这两个方法的功能。

这两个方法更像是专为view,model而生的。
通过这两个方法可以方便的对view相关的对象监听事件进行跟踪，解绑。

## 事件对象上的`_events`

如上的`model._events`，我们来分析下它里面有些什么：

`model._events`它是一个对象 `: { key1 : value1, key2 : value2 , key3 : value3 ....}`。以事件名为key, value则是一组组数，数组内的每一元素又是一个对象

元素中的对象内容如下：
* callback  事件的回调函数
* context   回调函数的上下文对象（即当调用`on`时，为context参数，当调用`view.listenTo(....)`时，为调用的对象如：view。）
* ctx		为context ，当context不存在时，为被监听的对象，如：model.on(...)或view.on(model,...)中的model
* listening 其实就是view._listeningTo中的某个属性值，可以看成: listening == view._listeningTo['l1']

##  `context`与`ctx`

如上所述，每个元素里的 `context`与`ctx`几乎一样，那为什么需要两个属性呢。

通过阅读`off`方法及`trigger`方法就会知道，上面两属性在这两个方法中分别被使用了。

在`off`里需要对`context`进行比较决定是否要删除对应的事件，所以`model._events`中保存下来的 context,必须是未做修改的。

而`trigger`里在执行回调函数时，需要指定其作用域，当绑定事件时没有给定作用域，则会使用被监听的对象当回调函数的作用域。

比如下面的代码：

```

var model = {  name : 'devsai'  }
var changeHandler = function(){ console.log(this.name)}
_.extend(model,Backbone.Events)
model.on('change',changeHandler)
model.trigger('change');  // print :  devsai

model.off();
var context = { name : 'SAI'}
model.on('change',changeHandler,context)
model.trigger('change');  // print : SAI

model.off()
var view = { name : 'SAI listenTo' }
_.extend(view,Backbone.Events)
view.listenTo(model,'change',changeHandler)
model.trigger('change')   // print : SAI listenTo
```

在调用`trigger`时，可能会执行这部分代码

```
(ev = events[i]).callback.call(ev.ctx) 
```

但这边，这种写法我是有疑惑的，就如 `ev.ctx`在没有context的情况下， ctx 才是obj(即被监听的对象),
为何不去掉ctx属性, 然后在`trigger`时，做context判断

例如把代码改成： 

```
(ev = events[i]).callback.call(ev.context || ev.obj) 
```

这样ctx属性就可以不去定义了。理解起来更直观。 


##  内部函数 **eventsApi**

`eventsApi`是内部的函数，所有对外的接口，都会直接或间接的调用它。复用率极高。

那`eventsApi`主要是干什么的呢。


```
  var eventsApi = function(iteratee, events, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length ; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space-separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  }

```

通过调用对外方法（如`on`,`listenTo`,`once`...）传入的是`'change update',callback`或`{'change':callback,'change update':callback}`，而最终指向的内部API函数为单个事件：`eventName,callback`。

所以简单说，该方法对多事件进行解析拆分，遍历执行单个`'eventname',callback`。


下面来具体说说`eventsApi`的参数

**iteratee**

是个函数，根据调用的对外接口不同，该函数也不同。

如：做绑定iteratee = onApi , onceMap; 做解绑 iteratee = offApi; 做触发 iteratee = triggerApi

----------

**events**

已有事件的集合，当前事件对象上绑定的所有事件

----------

**name**

事件名，来源于各对外接口传入的`name`

有两种类型，string （例如："change","change update"）,map object (例如：{"change":function(){}, "update change":function(){}})

----------

**callback**

回调函数，来源于各对外接口传入的`callback`,但它也不一定总是回调函数，当*name*为object时，*callbcak*可能是context。

----------

**opts**

根据调用的接口不同，有以下几种情况

* `on` ,`listenTo`,`off` ,调用这三个接口时 `opts`是个对象，
存放着`{context: context,ctx: obj,listening: listening }`
obj为被监听的对象（`off`时不需要），context为回调函数的上下文 , listening ,调用`listenTo`时存在。
* `once`,`listenToOnce` , 调用这两个接口时 `opts`是个函数(做解绑操作)
* `trigger` , 此时`opts`是个数组(args,为触发事件传时回调函数的参数)



## 内部函数 **triggerEvents**

```
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };
```

为什么要这么写呢，根据它的函数注释的意思是说，在Backbone内部大部分的事件最多只有3个参数，对事件调用进行了优化，
先尝试使用`call`调用，尽量的不去使用`apply`调用，以此达到优化的目的。

这里有对call,apply性能对比测试 [https://jsperf.com/call-apply-segu](https://jsperf.com/call-apply-segu)

## 最后



欢迎大家来一起探讨，由于个人能力有限，如有描述不妥或不对之处，请及时联系我或评论我。

如果喜欢这篇文章，帮忙点个赞支持下。

如果希望看到后续其他Backbone源码解析文章，请点下关注，第一时间获得更多更新内容。




