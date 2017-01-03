---
title : Backbone系列篇之重拾Backbone
tags : [JavaScript,Backbone]
date : 2016-12-09
description : "说说项目中使用Backbone存在的问题,及想要达到的目标。对Backbone重新研究。"
---

## 原因

为什么要重拾Backbone？ 嗯。 其实也不是现在才用，而是很久很久之前就在用了。

那就换了呗! 现在流行的框架这么多，Angularjs,Reactjs,Vuejs等等都是很好的选择。

那么问题来了，项目需要支持IE8，他们支持IE8吗？ ..... 

而且为什么一定要换呢，Backbone也是有优点的。（这里不对各框架进行撕比，我相信，存在即合理）

还不如想想项目存在的问题，和如何解决这些问题。

## 目前存在的问题

* 项目中使用Backbone版本过旧

* 由于Backbone的灵活，导致了代码的凌乱。（项目经过几代人编写，开始[先驱者]还按Backbone的方式编写，可[后来者]越往后Backbone存在感越低，数据不用Model,View也只用了最初封装的，Events事件就更别提了。jQuery就是一切。 ）

* 由于第二点，使得代码越来越难维护

第二点其实不能全怪Backbone的，大部分原因还是因为developer对backbone使用不得当，没有对代码组织好，代码规范没有严格要求。

又或许应该code review ，以保证代码的质量。

偷偷说下，我就是那个后来者。 （此处，请轻喷！！！）

## 想达到的目标

出于以上问题考虑，所以要重构代码（一言不合就重构）

争取做到以下几点：

* 善用Backbone

* 完善模块化，提高代码整体的复用率

* 规范代码，提高代码的阅读性

* 添加注释，说明业务逻辑

* 添加测试案例，使代码更健壮 （感觉很难，但还是想尝试去做）

好吧。看我意yin了这么多，说点有用的。


## 前端MVC模式

MVC（model-view-control）模式，实际上是从三个经典的设计模式演变过来的：观察者模式，策略模式和复合模式。

也可能使用了工厂模式、装饰者模式等等模式，这要看mvc框架具体的实现方式。

* Model 用于封装、保存应用的逻辑数据，以及一些对数据的处理方法。Model不会去关心数据最终会显示成什么样。
一旦数据有变化一般通过一种机制将数据发布出去。

* View 对数据的显示，理论来说不应包含任何业务逻辑。为了实现根据数据的改变更新显示，view通常需要监听相关model的变化。这一般由model实现的发布机制实现。在model上注册view的处理事件，model数据改变，view的处理事件就会触发。

* Control model与view之间的组织、业务逻辑的处理。在Control中完成model与view的关联等等。



## Backbone做了哪些

实际上Backbone将代码分成了两部分，只有Model和View，并没有Control。

![](./images/2016/backbone/backbone-mv.png)

这是官网上的图，从图中可以看出，通过用户在界面(View)中的操作产生了数据，将数据传入Model,Model将数据与DB同步，
然后Model发布了'change'的事件告诉View,View再通过改变的数据重新的去渲染页面。



## Backbone为什么没有Controller

前端通常没有或有极少的业务逻辑，更多的是UI逻辑，交互逻辑，根据用户的操作去出去回应。

所以，前端Controller相对比较简单。Backbone没有C，更多的是用事件来处理UI逻辑，或交互逻辑。

这里的事件可能会有两种:
* Backbone的事件
* 另外就是DOM或window的事件。


## 前端路由Router

Router用来切换页面，根据URL的变化显示不同的内容，其实不仅前端，后端也是有路由的，
只不过后端的路由一般在Controller里，根据请求路径的不同执行Control中不同的方法。

感觉Ruoter是从Control抽出来得概念。

![](./images/2016/backbone/router.png)

根据Router来确定，将要显示内容的View,及对应的Model。 



## 接下来做什么

之前对Backbone未作过多的了解，只是粗略的看了文档。为了能更好的重构项目，准备对源码进行拜读。

从而在实际项目使用过程中能对Backbone有更好的把控。

阅读顺序将按照<a href="http://backbonejs.org/" target="_blank">官方文档</a>先后顺序来，计划如下：

[Backbone系列篇之Backbone.Events源码解析](/2016/12/10/backbone-events)

Backbone系列篇之Backbone.Model源码解析

Backbone系列篇之Backbone.Collection源码解析

Backbone系列篇之Backbone.Router源码解析

Backbone系列篇之Backbone.History和.Sync源码解析

Backbone系列篇之Backbone.View源码解析

尽情期待！！！

