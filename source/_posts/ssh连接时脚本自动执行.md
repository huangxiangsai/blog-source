---
title: ssh连接时脚本自动执行
date: 2015-08-10 16:36:59
tags: [ssh]
comments : true
---


每次登陆远程服务器时，都会自动的执行当前用户下的.bash_profile文件。

只需要在里面写入你想要的脚本执行语句，就可以实现ssh连接时自动执行脚本的功能了.

示例如下:

登陆到服务器后 通过命令编写脚本 :`cd ~/ && vim .bash_profile`

添加红色区内容 :
![edit](/images/2015/08/edit.jpg)

保存后， ssh退出重新连接。

![](/images/2015/08/edited.jpg)

就能看到我们写的内容被执行了。

当然 你可以做些更有意义的、更复杂的事情.
