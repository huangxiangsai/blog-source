---
title: liunx修改时区
date: 2015-05-25 16:36:59
tags: [liunx]

---

如果你用的是去服务器，并且服务器还不再国内，那么就可能出现服务器上时区或时间不对的情况。

为此，我们需要做如下的修改：

1. 调整时区：

``` 
   cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
2. 修改系统时间

```
   ntpdate us.pool.ntp.org
```

没有安装ntpdate的需要先安装。

再次查看时间  command `date`，就发现时间已经正确了。
