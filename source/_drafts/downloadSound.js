const EventEmitter = require('./EventEmitter');

class DownloadSound extends EventEmitter{

	constructor(opt) {
	
	  
	}

	add(soundName,value){
		try {
			let list = this.list();
			list.push({name : soundName, localUrl : value})
		    wx.setStorageSync('soundLocal', list);
		} catch (e) {    
		}
	}

	list(){
		var list = wx.getStorageSync('soundLocal')
		if (list) {
		    return list;
		}
		return [];
	}

	remove(value){
		let result;
		let list = this.list();
		for(let i = 0 ; i < list.length; i++){
			if(list[i].localUrl == value){
				result = list.splice(i, 1);
			}
		}
		return result;
	}

	download(opt){
		let that = this;
		wx.downloadFile({
		  url: opt.url,
		  type: 'audio',
		  success: function(res) {
		    wx.saveFile({
			    tempFilePath: res.tempFilePath,
			    success: function(res) {
			        var savedFilePath = res.savedFilePath;
			        that.add(savedFilePath);
		    		opt.success && opt.success(opt.name,savedFilePath);
			    }
			})
		  },
		  fail : function(e){
		  	opt.fail && opt.fail(e);
		  },
		  complete : function(){

		  }
		})
	}
}

module.exports = DownloadSound;