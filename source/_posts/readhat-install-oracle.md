---
title: RedHat上静默安装Oracle11g
date: 2014-10-05 16:36:59
tags: [oracle,liunx]
toc: true
---


去年的十月前后，公司为某某大学后勤部门开发了一套干部考核系统，我也参与了开发。后来公司用此作为案例，接到了一些其他学校的考核系统的开发项目。原来系统是用mysql作为数据库，如今接到的一所学校的考核系统，要求用oracle数据库。所以公司要求我来为客户那边安装oracle数据库。之前我对mysql的安装有所了解，而对liunx上oracle安装从来没接触过。通过两天的不断的找资料后，最终安装成功，其中也多亏了同事的指点，让安装变得顺利许多。

在此，我写下此文，希望对大家有所帮助。

## Oracle安装前，依赖包的检测
这个就不用多说什么了，直接的上代码：

```
	rpm -q binutils	compat-libstdc++-33 elfutils-libelf elfutils-libelf-devel \
		elfutils-libelf-devel expat gcc gcc-c++ glibc glibc-common glibc-devel\
		glibc-headers libaio libaio-devel libgcc libstdc++ libstdc++-devel make\
		pdksh sysstat unixODBC unixODBC-devel | grep "not installed"
```

执行以上代码后，如果显示某个包名，说明该包没有被安装。
安装以上依赖包需要系统的安装盘或系统镜像。

用户那边把系统的镜像文件copy到了系统根目录上，我通过mount挂载了镜像：

```
	mount -o loop -t iso9660 /ISONAME.iso /media/cdrom/
```
然后在`/media/cdrom`里面就有相应的依赖包，我是在里面的Server目录下面
找到了所有的依赖包。

安装依赖需要执行以下命令：
```
	rpm -ivh <依赖包名>
```
安装依赖包是个麻烦的过程，我是一个个安装的，而且在安装某个包的时候有时会提示你先安装其他的包，非常的麻烦。不知道有没有什么简单方便的方式进行操作。如果有谁有更好的方法，希望能评论告诉
我。

## 没有图形，就静默吧

### 不管图形还是静默都需要做的事

*    创建群组
		
```
		groupadd oinstall 
		groupadd dba
		```

*    创建oracle用户并使用其属于刚创建的群组

```
		useradd –m –g oinstall –G dba oracle 
```

*    检查oracle是否属于组oinstall 和 dba

		id oracle

	正确的显示：uid=1001(oracle) gid=1000(oinstall) groups=1001(dba)

*    给oracle设置密码

		passwd oracle

*    创建安装oracle的目录并赋相应的权限

```
		mkdir -p /u01/oracle
		chown -R oracle:oinstall /u01
		chmod -R 775 /u01
```

*    内核参数的配置（网上寻找到的，这一步不是很明白其作用），使用`vi`或`vim`(其他编辑器也行)修改 `/ect/sysctl.conf`文件，一般都有，没有就创建一个，对它做如下的修改或添加：

		fs.file-max = 6815744

		fs.aio-max-nr = 1048576

		kernel.shmall = 2097152

		kernel.shmmax = 2147483648

		kernel.shmmni = 4096

		kernel.sem = 250 32000 100 128

		net.ipv4.ip_local_port_range = 9000 65500

		net.core.rmem_default = 4194304

		net.core.rmem_max = 4194304

		net.core.wmem_default = 262144

		net.core.wmem_max = 1048576

	输入命令:`sysctl -p `使其立即生效		

*    配置oracle用户的环境变量

	切换到oracle用户下：`su -l oracle`,然后输入：`vim ~/.bash_profile`，在其中添加如下环境变量

		```
		export ORACLE_HOME=/u01/oracle/product/11.2/db_1
		export ORACLE_BASE=/u01/oracle 
		export ORACLE_SID=orcl
		export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib:/usr/local/lib
```

	`source ~/.bash_profile`使其立即生效

## Oracle的下载，解压，安装

下载oracle并进行解压： 这里提供一下我使用的oracle, [点击此处](http://pan.baidu.com/s/12HFmI)下载
创建目录`mkdir /oinstall`,我把下载下来的oracle放到了`/oinstall`下，再通过以下命令解压：

	unzip p10404530_112030_Linux-x86-64_1of7.zip
	unzip p10404530_112030_Linux-x86-64_2of7.zip

由于静默（silent）安装oracle，需要配置静默响应文件，在`/oinstall/database/response`下用三个文件，其中一个文件就是用来安装使用，复制一份出来修改其内容。 这是一种方法，若不配置响应文件，则需要设置响应变量。我用了第二种方式 ,代码如下：

```
	./runInstaller -silent -force \
	FROM_LOCATION=/oinstall/database/stage/products.xml \
	oracle.install.option=INSTALL_DB_SWONLY \
	UNIX_GROUP_NAME=oinstall \
	INVENTORY_LOCATION=/home/oracle/oraInventory \
	ORACLE_HOME=/u01/oracle/product/11.2/db_1 \
	ORACLE_HOME_NAME="OraDb11g_Home1" \
	ORACLE_BASE=/u01/oracle \
	oracle.install.db.InstallEdition=EE \
	oracle.install.db.isCustomInstall=false \
	oracle.install.db.DBA_GROUP=dba \
	oracle.install.db.OPER_GROUP=dba \
	DECLINE_SECURITY_UPDATES=true
```

为了方便使用，通过`vim create_db.sh`，添加上述代码，给该文档权限修改为可执行。

执行需要数分钟的时间，结束时，提示安装成功并且会给出两个文件的路径，分别执行这两个文件。

## 静默安装监听

复制`/oinstall/database/response`下`netca.rsp`：

```
	 cd /oinstall/database/response 
	 cp  netca.rsp ../myNetca.rsp
	 cd ..
	 vim myNetca.rsp
```

`vim MyNetca.rsp`修改文件，以下为需要修改的项目：

```
	NSTALL_TYPE=""custom"" 安装的类型
	LISTENER_NUMBER=1 监听器数量
	LISTENER_NAMES={"LISTENER"} 监听器的名称列表
	LISTENER_PROTOCOLS={"TCP;1521"} 监听器使用的通讯协议列表
	LISTENER_START=""LISTENER"" 监听器启动的名称 
```

然后运行：

```
	$ORACLE_HOME/bin/netca /silent /responsefile /oinstall/database/response/myNetca.rsp
```

![运行结束](/images/netca.png)

## 创建oracle实例库
复制`/oinstall/database/response`下`dbca.rsp`：

```
	cd /oinstall/database/response
	cp dbca.rsp ../myDbca.rsp
	cd ..
	vim myDbca.rsp
```

`vim myDbca.rsp`修改文件，以下为需要修改的项目：

```
	# RESPONSEFILE_VERSION = "11.2.0" 
	# OPERATION_TYPE = "createDatabase" 
	# [CREATEDATABASE]  
	# GDBNAME = "orcl" 
	# SID = "orcl" 
	# TEMPLATENAME = "General_Purpose.dbc" 
	#  
	# [CONFIGUREDATABASE]  
	# EMCONFIGURATION = "LOCAL" 
	# SYSMANPASSWORD = "123456" 
	# DBSNMPPASSWORD = "123456" 
```

然后执行：

```
	$ORACLE_HOME/bin/dbca -silent -responsefile /oinstall/database/response/dbca.rsp
```

到这里，ORACLE的安装差不多了。但我用本机访问服务器上oracle时，连接不上，出现监听超时的错误，以为是服务器上防火墙没有开放1521端口，但查看后发现1521端口已经加上了。经过几翻折腾才知道，是连接服务器的网络上1521端口未开放，问题总算解决了。

问题总会一个接一个的，在向表插入数据时，发现中文存在无法识别的情况。
在网上找了一堆的资料，最后通过阅读[这篇博客](http://bxffeng.blog.163.com/blog/static/90238449201042683549365/)解决了问题。

主要原因是：当前的系统的语言环境和环境变量，与oracle的字符集不一致。

可以通过以下步骤修改
	
```
	su -l oracle
	vim ~/.bash_profile
```

文件bash_profile中修改或添加以下内容：

```
	NLS_LANG = AMERICAN _ AMERICA. ZHS16GBK
```

然后修改`sudo vim /etc/sysconfig/i18n`

```
	LANG="en_US.UTF-8"
	SUPPORTED="zh_CN.UTF-8:zh_CN:zh:en_US.UTF-8:en_US:en"
	SYSFONT="latarcyrheb-sun16"
```

查看oracle的字符集：

```
	sqlplus / as sysdba
	select userenv('language') from dual;
```


## 总结
Oracle在Liunx下安装是件麻烦的事，由于是没有图形界面使用静默安装，貌似不会出错停止，还会继续安装，然后就一堆的问题，oracle没法用还得重新安装，这种情况下oracle安装后的Log是一定要看的，看看在安装过程中有什么错误信息。但也发现，oracle静默安装的速度确实是相当的快。与我在WIN上安装Oracle速度根本不是一个级别的。




 


 