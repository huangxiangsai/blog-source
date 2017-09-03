# 数据结构与算法基础

## 树与二叉树

### 基本概念

### 树的遍历

1. 前序遍历 （从根节点 至 叶子节点 ）
2. 后序遍历 （叶子节点 至 根节点 ）
3. 层次遍历 （从根节点 至 子节点 ）

### 树的常用公式

### 二叉树的遍历

1. 前序遍历
2. 后序遍历
3. 层次遍历
4. 中序遍历

### 二叉树特性

1. 在二叉树的第i层上最多有 
![公式名](http://latex.codecogs.com/png.latex?2^{i-1})个节点（i
![公式名](http://latex.codecogs.com/png.latex?\ge)1）

2. 深度为k的二叉树最多有
![公式名](http://latex.codecogs.com/png.latex?2^{k-1})个节点
(k![公式名](http://latex.codecogs.com/png.latex?\ge)1）

3. 对任何的一颗二叉树，如果其叶子节点为
![公式名](http://latex.codecogs.com/png.latex?n_0),度为2的结点数为k
![公式名](http://latex.codecogs.com/png.latex?n_2),则
![公式名](http://latex.codecogs.com/png.latex?n_0=n_2+1)

### 树与二叉树转换

**原则**

* 每个树的最左子节点，作为二叉树的左子点
* 每个树的（除最左节点外）兄弟节点，做为二叉树的右子节点

**转换前后共性**

* 树的前序遍历与转换后的二叉树前序遍历顺序一致
* 树的后序遍历与转换后的二叉树中序遍历顺序一致