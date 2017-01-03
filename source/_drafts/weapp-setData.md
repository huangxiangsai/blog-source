---
---


```
var Page = function(options){
    var _Page = function(options){
        this.data = {};
        this.data = options.data;

        options.onLoad && options.onLoad.call(this);
    }

    _Page.prototype = {
        setData : function(_data){
            this.data = _data;
        }
    }


    new _Page(options);
}

Page({
    data : {a : {b : 1} , c: 1},
    onLoad : function(){
        console.log(this.data);
        this.setData({a :{b : 22}});
        console.log(this.data);
    }
})
```