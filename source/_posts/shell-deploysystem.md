---
title: 用shell脚本发布系统
date: 2014-10-15 16:36:59
tags: [shell,liunx]
toc: true
---


脚本是给懒人准备的，越懒的人越需要脚本,我就是那个传说中的懒人,这样别人在死命搞代码的时候，我就可以喝喝茶，看看书了。→_→

# 用途
做了项目总要发布吧。一个项目也不会就发布一次，发布上去后给用户测试，发现了这儿那儿的问题，然后就没日没夜的改（这要有多少BUG啊），改完后，重新在发布上去，告诉用户一声BUG改了，用户说：嗯。很好很好。过了个几天，用户又开始说，这个不好，改改。   好吧。改吧！！ 改完后再发布到服务器 。 这一来一去的，发布好麻烦啊。每次都要做以下几件事：

*    上传项目到服务器
*    停止服务
*    查看服务是否正常停止，没有正常停止还需要手动杀进程
*    备份当前的系统版本
*    拷贝刚上传上去的项目到指定目录
*    重新启动服务
*    重启后还有看下控制台确保正常启动了

看吧。 每次重新发布都要这样做，烦不烦啊。 
如果只需要一步两步就搞定，那应该是多么爽的一件事啊。

于是乎，嘿嘿， 有下接下来的代码。。。

# 代码

```
 #!/bin/sh
 #设定要拷贝的原文件名称，默认在用户的活动目录下
fileName='/root/assessment.war'
#默认超时时间设置为30秒
overtime=30

if [ $# -ge 1 ]; then
	fileName=$1
fi

if [ $# -ge 2 ]; then
	overtime=$2
fi

#fileName='/root/install.log'
#判断文件是否存在
if [ ! -f "$fileName" ]; then
echo "文件：$fileName 不存在，请先上传$fileName..."
exit 0
fi

if [  -z $TOMCAT_HOME ]; then
echo "TOMCAT_HOME环境变量不存在，请先设置tomcat环境变量..."
exit 0
fi

#获得当前tomcat的进程数
psid=`ps -ef|grep "tomcat"|grep -v "grep"|wc -l`

if [ $psid -ge 1 ]; then
 $TOMCAT_HOME/bin/./shutdown.sh
	echo "正在停止服务,请稍等......"
	#用循环判断服务是否已经停止，设置了60秒超时 
	count=0
	while [ $count -lt $overtime ]
	do
		psid=`ps -ef|grep "tomcat"|grep -v "grep"|wc -l`
		if [ $psid -ge 1 ]; then
  		     	let count++
		else
			let "count = $overtime + 1"
			break
		fi
		 sleep 1	
	done
#如果count 60 表示超时 , 61 表示服务已停止
	if [ $count -eq $overtime ]; then
		echo "无法停止服务，正在使用kill -9 命令强行杀死进程"
		psid=`ps -ef | grep tomcat/ | grep -v grep | awk '{print $2}'`
		kill -9 $psid	
#        	exit 0
	fi
	echo "tomcat服务已停止"
fi

echo "开始备份webapps下ROOT.war ......"
if [  -e "$TOMCAT_HOME/webapps/ROOT.war" ]; then
  mv $TOMCAT_HOME/webapps/ROOT.war $TOMCAT_HOME/webapps/ROOT.war.bak
fi

echo "删除webapps下ROOT ......."
rm -fr $TOMCAT_HOME/webapps/ROOT

echo "拷贝新的$fileName进入webapps,并改名为ROOT.war "
#mv $fileName $TOMCAT_HOME/webapps/ROOT.war
cp $fileName $TOMCAT_HOME/webapps/ROOT.war
echo "完成拷贝....."

echo "开始重启tomcat服务 ....."
$TOMCAT_HOME/bin/./startup.sh

#
tail -f $TOMCAT_HOME/logs/catalina.out

exit 0            
```
# 使用
有了这脚本，你重新发布项目，只需如下几步：

*   远程连接到liunx服务器，就在用户目录下上传项目包
*   执行该脚本 比如脚本名叫autoPublish.sh , `./autoPublish.sh ~/projectName`

后面跟的第一个参数是上传上去的项目名称 ，第二个参数为停止项服务超时时间（可以不管）。
如果不想每次都输入第一个参数 ，手动改下脚本的默认项目地址就行。

只需要两步，搞定发布，是不是感觉舒服了。

嘿嘿。  还不赶紧，试着发个项目上去呗。