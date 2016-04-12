---
title: git出错 fatal:multiple stage entriesfor merged file
date: 2016-04-08
tags: [git]
---

已经遇到过好几次这样的情况了

GIT报错：

```
fatal:multiple stage entries for merged file
```

在网上找下，也能很容易的找到对应的解决方案，方案如下：

```
rm .git/index
git add -A
git commit -m 'fix git fatal error'
```

但对于为什么会出现这样的错误，一直找不到个说法。希望知道原因的朋友能帮我解答疑惑。


>		自认为一个好的码农要知其然，更要知其所以然。

