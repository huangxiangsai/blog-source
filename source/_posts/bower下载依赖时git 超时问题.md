---
title: bower下载依赖时git 超时问题
date: 2015-09-03 16:36:59
tags: [前端]
description: "bower就是一个前端的依赖包管理器，就相当于java中流行的依赖管理工具MAVEN。bower与npm很像，但又不同，我的理解是,bower主要服务于web项目前端依赖,而npm 则主要服务于nodejs."
---

##问题描述

执行命令：`bower install jquery-pjax`

出现的错误信息：
```
bower error status code of git: 128
fatal: unable to connect to github.com:
github.com[0: 你的IP]: errno=Operation timed out
```

其实这也不是bower下载依赖的问题， 而是git请求数据的问题 

这里以'bower下载依赖时git 超时问题'命题，主要还是因为是在使用`bower install`时出现的错.

这可以是需要用https才能读到数据
解决方法：输入命令

```
git config --global url."https://".insteadOf git://
```


##关于 bower 

bower就是一个前端的依赖包管理器，就相当于java中流行的依赖管理工具MAVEN。

bower与npm很像，但又不同，我的理解是,bower主要服务于web项目前端依赖,而npm 则主要服务于nodejs.

<a href="https://blog.openshift.com/day-1-bower-manage-your-client-side-dependencies/" target="_blank">openshift</a> 上一篇文章 对bower是什么，为什么使用它，怎么使用它等一些问题进行说明。
