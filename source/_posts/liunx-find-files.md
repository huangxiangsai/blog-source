---
title: liunx中查找目录下某内容的所有文件
date: 2014-11-18 16:36:59
tags: [liunx]
---

中liunx中我们可以使用如下命令，可列出在指定的文件夹下，包括某字符串的文件路径

```
grep -lr 'myname' var/www/*
```

其中`myname`是要查找的内容 , `var/www/*`是要在哪个文件夹下查找
