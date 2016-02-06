---
title: liunx中获得文件的修改日期
date: 2015-07-11 16:36:59
tags: [liunx]

---

有时候，我们需要知道某个文件有没有被修改过，以此做出相应的处理。

在liunx中， 就可以使用以下的脚本来实现 ：

       stat openapi.less | grep -i Modify | awk -F. '{print $1}' | awk '{print $2$3}'| awk -F- '{print $1$2$3}' | awk -F: '{print $1$2$3}'