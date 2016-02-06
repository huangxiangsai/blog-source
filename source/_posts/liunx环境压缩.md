---
title: liunx环境压缩
date: 2015-05-25 16:36:59
tags: [liunx]

---

## 普通压缩

---
在liunx环境中最常用的压缩应该就是`tar`。 所以只对`tar`做下记录。当然还有很多的压缩方式可用。
```
tar -zcvf filename.tar.gz filename ...
```

解压
```
tar -zxvf filename.tar.gz  path
```

## 加密压缩

---
我是很注重隐私的，所以有时候，对一些文件压缩的同时，还需要加密。+_+

压缩加密
```
tar -zcf  - filename |openssl des3 -salt -k password | dd of=filename.des3 
```
此命令对filename文件进行加码压缩 生成filename.des3加密压缩文件， password 为加密的密码


解压解密
```
dd if=filename.des3 |openssl des3 -d -k password | tar zxf -
```
注意命令最后面的“-”  它将释放所有文件， -k password 可以没有，没有时在解压时会提示输入密码