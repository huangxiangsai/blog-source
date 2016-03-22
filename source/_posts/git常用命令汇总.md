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

### 实际用到的命令(持续更新中...)

下述内容或许上图中已提到，但为更方便的阅读与copy

#### **生成SSH key**
```
ssh-keygen -t rsa -C "xxxx@gmail.com"
```


#### **检出历史版本到分支**
```
git checkout 分支号
git branch -b [新分支名]

```

#### **常用的自定义命令**
```
#方便查看当前的文件状态
git config --global alias.s "status -s" 
#方便查看日志 人性化得显示时间，显示提交人
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```


#### **设置不忽略大小写**
  `git config core.ignorecase false`

#### **提交代码不用输入用户名密码**
```
#解决方法 1
#通过ssh认证
#使用 git@... clone项目，之后的git操作都无需输入用户名、密码


#解决方法 2
#可以不输密码 提交http地址的项目
 
vim ~/.git-credentials

     https://[username]:[password]@github.com  #github
     http://[username]:[password]@gitlab.xxx.com  #gitlab

git config --global credential.helper store
```

两种方法结合可完全避免输密码提交

其实`.git-credentials`这个文件也可以不用自己来添加，
只需设置`git config --global credential.helper store`
不自己手动添加的`.git-credentials`的影响就是，做git相关操作的时候需要输一遍用户名、密码。
然后git会自动生成`.git-credentials`文件并在文件中添加用户名密码


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

#### **合并多次的提交**
有时我们会为修改一个BUG而提交多次，（修复一个BUG，提交后，由测试人员确认，发现还是有问题，然后继续做修复-提交的动作）
这时候就会感觉这多次的提交没有必要的，查看日志时也显得很凌乱。所以有必要对这些的提交进行合并提交的动作。

```
git rebase -i HEAD^^  #合并近两次的提交
#or
git rebase -i HEAD^^^ #合并近三次的提交
#or
git rebase -i b3958ef #合并b3958ef之前的提交记录
```
实例如下：

![](/images/git-rebase-1.png)

![](/images/git-rebase-2.png)

![](/images/git-rebase-3.png)

![](/images/git-rebase-4.png)

![](/images/git-rebase-5.png)

![](/images/git-rebase-6.png)




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

