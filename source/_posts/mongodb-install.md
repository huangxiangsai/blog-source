---
title : mac下mongoDB的安装
tag: [mongoDB,记录]
date: 2017-01-03
---

## mongodb

官方介绍

>	MongoDB（来自于英文单词“Humongous”，中文含义为“庞大”）是可以应用于各种规模的企业、各个行业以及各类应用程序的开源数据库。作为一个适用于敏捷开发的数据库，MongoDB的数据模式可以随着应用程序的发展而灵活地更新。与此同时，它也为开发人员 提供了传统数据库的功能：二级索引，完整的查询系统以及严格一致性等等。 MongoDB能够使企业更加具有敏捷性和可扩展性，各种规模的企业都可以通过使用MongoDB来创建新的应用，提高与客户之间的工作效率，加快产品上市时间，以及降低企业成本。

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

官方提供了多种方法安装[mongoDB](https://docs.mongodb.com/manual/administration/install-community/)

这里拿OS X为例，记录下我的安装过程：

安装的mongoDB版本为`3.4.1`

由于使用`Homebrew`依赖管理器有问题，果断放弃这种方式的安装。

采用手动安装模式，即源码安装

步骤如下：

* 下载源码到本地

```
curl -O https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.4.1.tgz
```

* 解压文件

```
tar -zxvf mongodb-osx-ssl-x86_64-3.4.1.tgz
```

* 将解压后的文件内容，拷贝到需要的指定目录(例如：~/mongodb)

```
// 需先创建目录
mkdir ~/mongodb

cp -R -n mongodb-osx-ssl-x86_64-3.4.1/   ~/mongodb
```

其实这步骤可以省略，只要在想要存放的目录下去下载源码，并解压，需要的话再修改下解压后的目录名

还需注意，新创建的目录需要有用户权限。

* 配置环境变量,这步骤也可省略，只要你不嫌执行命令麻烦

在~/.bashrc文件中添加以下内容：

```
export PATH="$PATH:<your-mongodb-directory>"
```

这是的`<your-mongodb-directory>`就是上面的`~/mongodb`

* 通过命令启动mongodb

在执行命令前，还需添加，存放数据的目录

```
mkdir /data/db    # 如果不是管理员身份操作，需使用 sudo
chown -R <当前的用户> /data
```
然后执行启动命令

```
mongod
```

执行命令后会看到它启动的端口,在浏览器中输入`127.0.0.1:27017`，会看到以下一段话，告诉你正在尝试连接mongodb数据库

>	It looks like you are trying to access MongoDB over HTTP on the native driver port.


至此最简单的mongodb服务已经起来了。

当然你也可以做一些其他的设置比如：端口（默认为`27017`），存放文件的目录(默认为`//data/db`),可以通过对命令`mongod`后添加参数的方式来实现

```
mongod --port 10086  --dbpath ~/mongodb/data/db
```

相关的配置还有很多，你也可以把这些配置写配置文件里，只需在执行命令时指定配置文件即可。

```
mongod -f ~/mongodb/mongodb.conf
```

`mongodb.conf`文件内容为： 

```
net:
	port: 10086

storage
	dbPath: ~/mongodb/data/db

```

更详细的配置请查看[官方文档](https://docs.mongodb.com/manual/reference/configuration-options/)







