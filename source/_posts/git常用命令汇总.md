---
title: git常用命令汇总
date: 2015-07-09 16:36:59
tags: [git]
description: "前段时间由于工作需要，把项目从svn迁至了git上。

为此，公司的git高手做了一次分享。我们这些小白也从网上找资源，以便能尽快的入门。

在这过程中，队里伙伴找到了张图片，非常全的总结了git的常用命令。

虽然都不知道这图是谁分享的，但还是非常的感谢。"
---

前段时间由于工作需要，把项目从svn迁至了git上。

为此，公司的git高手做了一次分享。我们这些小白也从网上找资源，以便能尽快的入门。

在这过程中，队里伙伴找到了张图片，非常全的总结了git的常用命令。

虽然都不知道这图是谁分享的，但还是非常的感谢。

<a href="/images/2015/08/2010072023345292.png" target="_blank">查看原图</a>
![](/images/2015/08/2010072023345292.png)

### 实际用到的命令(更新中...)


#### **生成SSH key**
```
ssh-genkey -t rsa -C "devsai.huang1@gmail.com"
```


#### **检出历史版本到分支**
```
git checkout 分支号
git branch -b [新分支名]

```
#### **设置不忽略大小写**
  `git config core.ignorecase false`

**提交代码不用输入用户名密码**
```
cd ~/  
vim .git-credentials

     https://[username]:[password]@github.com


git config --global credential.helper store
```

#### **撤销git add操作**

```
git reset HEAD   (相当于把git add . 操作的文件撤出暂存区)
```

#### **远程库里已经存在这文件夹，但又想忽略此文件夹**

![](/images/gitignore.png)

```
git rm --cached filepath #删除库里的文件记录
git add .
git commit -m 'fiexed gitIgnore '
```

#### 上线版本，打tag加版本号

```
# 创建轻量标签
$ git tag v0.1.2-light

# 创建附注标签
$ git tag -a v0.1.2 -m “0.1.2版本”

# 用git show命令可以查看标签的版本信息
$ git show v0.1.2

$ git tag -d v0.1.2 # 删除标签

$ git tag -a v0.1.1 4fbc5d0  #给指定的commit打标签 

$ git push origin v0.1.2 # 将v0.1.2标签提交到git服务器
```

