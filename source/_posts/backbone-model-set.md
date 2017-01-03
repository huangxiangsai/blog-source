---
title : Backbone系列篇之Backbone.Model源码解析01
date : 2016-12-15
tags : [JavaScript,Backbone,源码]
description : "Backbone.Model部分源码解析"
---




总感觉要讲的点很多，就像上一篇讲的Backbone.events，感觉已经写了不少，但还有一些点，没有讲清，或没有讲到。

所以从这篇开始，并不会只以类似Backbone.Model会Backbone.View为主题，而是以例如Model中的一个或多个点作为内容详细解读。

把很多内容集中到一篇，又要讲的比较全面，对于我目前的写作能力来说，压力太大

还不如，小步快跑，一篇只做一个或几个内容点详细的讲解，来得更加的高效。

# 那么开始吧

Model存在的目的之一便是存储数据，既然是存储数据，就需要有相应的设置数据的方法。

本篇就跟大家一起来讲讲Model中的`set`方法


# `set`方法

被认为model中最核心的操作，使用object来设置model中的字段值，并触发`change`事件。

# `set`参数说明

```
var params = {name : 'devsai',age : 18}
var options = {unset : true ,silent : true}
model.set(params,options);
// or 
model.set('name','devsai',options)
```

可使用两种风格的参数，`{name : 'devsai'}`或`'name','devsai'`,然后最后一个参数`options`为可选参数，是个对象，其中可有三个固定属性，`unset`，`silent`和`validate`

当`unset`设置了`true`，会根据提供的属性名来删除该属性，此时，不管参数中提供的对应的属性值为什么，都无视。
当`slient`设置了`true`, 属性改变了并不会触发`chang:name`和`change`事件。
当`validate`设置了`true`, 同时，model有覆盖`validate`方法，就会调用`validate`方法，默认情况下，不做校验。

当然如果你想要在**触发事件**或**校验字段**的时候获得其他想要的数据，也可通过`options`对象赋值。

PS: 这里想说下Backbone的文档，文档上介绍该方法的时候，有提到`options`这样一个可选参数，但并没有说`options`是什么，干嘛用。这是想让大家都去读源码的节奏。


# `set`内部到底做了什么事

按调用的顺序主要做了以下几件事：

* 数据的校验
	对传入的字段，调用内部方法`_validate`进行检验 ，不通过校验 返回`false`
* 新旧数据的对比,保存最新数据
* 更新ID
* 触发单个字段数据改变事件
* 触发model改变事件

## 数据的校验

	对传入的字段，调用内部方法`_validate`进行检验 ，
	需要说明的是，默认不校验字段，只有当`set`方法最后的可选参数`options`中设置了`validate`为true，
	才会根据你定义的`validate`方法进行校验。
	如果`validate`方法没有校验通过，会触发`invalid`事件。

```
_validate: function(attrs, options) {
  if (!options.validate || !this.validate) return true;
  attrs = _.extend({}, this.attributes, attrs);
  var error = this.validationError = this.validate(attrs, options) || null;
  if (!error) return true;
  this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
  return false;
}
```

## 新旧数据的对比,保存最新数据

内部定义了如下几个局部变量

```
changes , changed , current , prev
```


```
  for (var attr in attrs) {
    val = attrs[attr];
    // 当前字段对象中对应的字段值 与 传入的字段值比较，不相等，字段名添加进`changes`
    // prev对象中对应的字段值 与 传入的字段值比较 ，
    //    不相等，改变的字段的键值对添加进`changed`
    //    相等， 从`changed`删除字段的键值对
    if (!_.isEqual(current[attr], val)) changes.push(attr);
    if (!_.isEqual(prev[attr], val)) {
      changed[attr] = val;
    } else {
      delete changed[attr];
    }
    // 更新或删除字段
    unset ? delete current[attr] : current[attr] = val;
  }
```

## 更新ID

如果传入的字段有ID，那么需要更新model实例对应的id。

## 触发单个字段数据改变事件

对于每个发生改变的字段，都会触发类似:`change:[字段名]`的事件，并会带上更新后的字段值作为参数。

## 触发model改变事件

除了会对每个发生改变的字段触发事件外，model实例还会单独的触发`change`,
这事件，不用关心到底改变了哪个字段，对于有时候，只要改变就需做出相应动作的场景很有用。



PS : 前面也提到了，`set`方法除了用来设置字段外，也可以用来删除字段。`model`提供了`unset`方法，内部实际就是调用了`set`方法。

# 需要考虑的问题

我们都知道，`set`设置字段的同时，也会触发相应的事件。

那么，如果在事件里再调用`set`方法呢。 这样容易导致`set`方法的无限循环。

通过两个属性解决了无限循环的问题

```
this._changing
this._pending 
```

先来看下，model的实例上的属性`this._changing`，在开始时设置了`true` , 表明方法正在处于使用中，model中的字段正在发生改变，在最后又对其设置了`false`,表示字段改变完成。

同时`this._changing`在设置`true`前,会赋给内部变量`changing=this._changing`,所以正常情况下，`changing`只会为false或，undefined

此处说的“正常情况”是指，`set`方法未被嵌套调用。


```
	if (changing) return this;
    while (this._pending) {
      options = this._pending;
      this._pending = false;
      this.trigger('change', this, options);
    }
```
代码片段 1

但如果存在嵌套调用，即在触发的事件`this.trigger('change', this, options);`中又调用了`set`方法，那么，此时`this._changing:true`，所以内部变量`changing`也就成了`true`

通过`if (changing) return this;`这句可以直接退出嵌套方法。



但这并没有阻止`change`事件被再次的触发。

此话怎讲，`this._pending`起到了关键性的作用。



从而使该句之后的`change`事件不会再触发（即代码片段 1部分），这样就避免因触发`change`事件导致`set`方法被嵌套调用。

还要提一下，


到看过代码的同学肯定知道，在代码片段 2 前面还有这么一段代码,且叫它代码片段 3：

```
    if (changes.length) this._pending = options;
    for (var i = 0; i < changes.length; i++) {
      this.trigger('change:' + changes[i], this, current[changes[i]], options);
    }
```
代码片段 3

在此段中，如果model中的字段有变化，那么就会调用相应字段名的`change`事件，如：`change:name`

如果在该事件里又调用了`set`方法，那又会如何呢。

```
model.on('change:name',function(){
	this.set('name','sai');
})
model.set('name','devsai');
```

`if (changing) return this;`在此段的下面，它并不能防止这种事件的嵌套问题。

在代码片段 3 中看出，触发事件是在`for`循环里，也就是说只有不进循环，便不会触发事件，`set`方法就不会在被嵌套调用。

那么`changes`数组变量就是关键。



```
    if (!changing) {
      this._previousAttributes = _.clone(this.attributes);
      this.changed = {};
    }

```
代码片段 3



而，这句则会调用




所以，在`set`方法的内部，出现了多个局部变量`changing,`，通过这些变量来解决因触发事件而导致的死循环。

个人感觉，只看代码去理解，可能还略有困难，通过调用的方式去理解，代码看得会更加的清晰。

于是乎，用了以下的代码去调用了`set`方法

```
model.on('change',function(){
	this.set('name','sai');
})
model.set('name','devsai');

```
当调用 `model.set('name','devsai');`时

![](./images/2016/backbone/model-set-01.png)



下面，贴出`set`方法，本不想贴代码，但能力有限，发现不贴代码没法讲，：

```
set : function(){
	.......
	var changes    = [];
    var changing   = this._changing;
    this._changing = true;

    if (!changing) {
      this._previousAttributes = _.clone(this.attributes);
      this.changed = {};
    }
	.......
    for (var attr in attrs) {
      val = attrs[attr];
      // 当前字段对象中对应的字段值 与 传入的字段值比较，不相等，字段名添加进`changes`
      // prev对象中对应的字段值 与 传入的字段值比较 ，
      //    不相等，改变的字段的键值对添加进`changed`
      //    相等， 从`changed`删除字段的键值对
      if (!_.isEqual(current[attr], val)) changes.push(attr);
      if (!_.isEqual(prev[attr], val)) {
        changed[attr] = val;
      } else {
        delete changed[attr];
      }
      // 更新或删除字段
      unset ? delete current[attr] : current[attr] = val;
    }
	
	.......

    if (!silent) {
      if (changes.length) this._pending = options;
      for (var i = 0; i < changes.length; i++) {
        this.trigger('change:' + changes[i], this, current[changes[i]], options);
      }
    }

    if (changing) return this;
    // 同样是非沉默模式下调用
    if (!silent) {
      while (this._pending) {
        options = this._pending;
        this._pending = false;
        this.trigger('change', this, options);
      }
    }
    // 重置 model实例属性 
    this._pending = false;
    this._changing = false;

}
```





因此正常情况下，下面这段一定会调用



而,下面的语句就一定不会调用



相反的，不正常的情况（即触发的事件内再调用了`set`方法），上面两段中第一段不会在调用，
第二





##
var model = new Person({'name':'b'});


model.on('change',function(){
	model.set('name','b');
})
model.set('name','a');

model.get('name');














本篇为Backbone源码分析系列篇中的第二篇。


