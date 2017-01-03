---
title: 微信小程序开发之https从无到有
tags: [https,ssl,微信小程序]
date: 2016-11-21
description: "30分钟，https个人认证教程，以最快的速度拥有https"
---

本篇不讲什么是https，什么是SSL,什么是nginx

想了解这些的请绕道，相信有很多优秀的文章会告诉你。

本篇要讲的在最短的时间内，让你的网站从http升级到https。

开始教程前再说一句：https你值得拥有。

# 起因

最近段时间，微信小程序爆火，消息一出，各路豪杰，摩拳擦掌，跃跃欲试。

都想这个坑(这里不多阐述，具体坑不坑，developer最清楚)里跳。微信对小程序也是有诸多的限制。

例如文件大小，请求服务端必须是https。 

文件大小，好办，开发过程中尽量的控制文件，能复用的尽量复用。用不到的文件尽量不引用。本地的图片也尽量的少。

可https,在国内线上用https的都不算多，更何况是开发过程中用https，应该就更少了吧。

如果你正在开发微信小程序，并还没有https，那么巧了，那么我想，这篇可能可以帮到你。

# StartSSL免费SSL证书

都说了是开发用（如果到了线上，想要https，相关的运维人员会搞定收费的https），那当然要用免费的。

StartSSL就是个不错的选择。 

## StartSSL

StartSSL是StartCom公司旗下的SSL证书，提供免费SSL证书服务并且被主流浏览器支持的免费SSL，包括Chrome、Firefox、IE等浏览器都可以正常识别StartSSL，更主要的是StartSSL提供免费`3年`且可以无限续期的SSL证书，而且可以设置`10个`域名。


## StartSSL注册、登录


1 进入注册页面


进入[https://www.startssl.com/SignUp](https://www.startssl.com/SignUp)。

![](./images/2016/ssl/sginUp.png)

2 注册很简单只需要填个邮箱发送验证码

![](./images/2016/ssl/verification.png)

3 然后填入获得的验证码,点击按钮后会跳转至设置密码

![](./images/2016/ssl/sginUp2.png)



![](./images/2016/ssl/sginUpsuccess.png)

4 注册成功后，会让你下载用于登录的证书，因为该网站提供了两种登录方式，客户端证书认证和邮箱登录（填写邮箱，获得验证码登录），个人感觉使用邮箱也很方便。

![](./images/2016/ssl/login.png)

## 申请免费的SSL

1 先添加验证域名，选择选项卡的`Validations Wizard`，并选择`Domain Validation (for SSL certificate)`
点击`Validation`

![](./images/2016/ssl/domainvalid.png)

2 填入域名，并在域名所有者邮箱（或域名对应的企业邮箱）中获取发送的验证码

![](./images/2016/ssl/inputdoamin.png)

3 添加的域名验证成功，点击`To "Order SSL Certificate "`

![](./images/2016/ssl/validsuccess.png)

4 现在可以开始给自己的域名申请StartSSL免费SSL证书了，这里添加用于申请证书的完整的域名

![](./images/2016/ssl/addfulldomain.png)

5 申请StartSSL免费SSL时，会要求填入CSR

![](./images/2016/ssl/gencert.png)

6 CSR 生成可以有两种方式，一种是使用StartSSL提供的`[StartComTool.exe](https://download.startpki.com/startcom/startcomtool.exe)`适用于Window，另一种方式也可以使用`openssl`命令,适用于Mac,liunx等。

	openssl req -newkey rsa:2048 -keyout yourname.key -out yourname.csr


![](./images/2016/ssl/localgen.png)

7 把生成的(`youname.csr`)CSR签名证书请求内容，粘贴进去

![](./images/2016/ssl/pastecert.png)

8 然后StartSSL就可以免费SSL下载使用


## 下载免费的SSL

下载下来的SSL是zip格式的压缩包，解压后有如下内容

![](./images/2016/ssl/downloadunzip.png)

分别提供了几种web服务所需的ssl认证文件

# nginx SSL配置

这里只拿nginx举例,编辑nginx配置文件

```
listen       443;
ssl     on;
ssl_certificate /usr/local/nginx/conf/key/xxx.pem;
ssl_certificate_key /usr/local/nginx/conf/key/xxx.key;
ssl_session_timeout 5m;
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_ciphers   EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
ssl_session_cache          shared:SSL:50m;
```

`xxx.pem`就是从StartSSL下载下来的NginxServer.zip中的文件xxx_bundle.crt（需要把后缀改成pem）

`xxx.key` 这是之前执行 `openssl req -newkey rsa:2048 -keyout yourname.key -out yourname.csr`时生成的key.

然后启动nginx ,输入密码（该密码是生成本地CSR时设置的）

![](./images/2016/ssl/inputPEM.jpg)

# 大功告成

到这来，就可以使用https了，马上打开你的域名试试吧。

其实在网上也能找到很多StartSSL的申请流程。可大多都是之前的，界面与操作方式都有所改变。这篇提供了最新的StartSSL申请流程，以帮助大家更快的进行SSL认证。

看之前的教程，会告诉你，在第7步后不能马上下载SSL认证，StartSSL会有个客服审核的过程可能需要几小时，但现在的使用下来发现，现在已经没有这过程了，完成第7步就可以去认证的列表下载SSL认证。

# 微信小程序请求 wx.request :fail

本文的目的是为了微信小程序请求能使用https

所以，最后如果在调用微信wx.request接口时还是报错，可以参考<a href="http://www.wxapp-union.com/forum.php?mod=viewthread&tid=648&highlight=request" target="_blank">这篇</a>寻找解决之法。





