/**
*API.
*
*This class clase allow the comunication of plugins with RhyfoxJS. API provides some tools 
* to facilitate the programming in RhyfoxJS.
* 
*/
function PublicAPI(objPlugin,objLogger){
	this.objPlugin=objPlugin;
	this.objLogger=objLogger;
	this.currentPath=fs.workingDirectory;
	instance=this;
	
	this.getCasperJs=function(){
		this.objLogger.insertLog('getCasperJs function called!','debug');
		var mycasperPath=this.currentPath+'/../includes/casperjs';
		var bootstrapPath=mycasperPath+'/bin/bootstrap.js';
		this.objLogger.insertLog('bootstrap Path: '+bootstrapPath,'debug');
		//this.requireFile(bootstrapPath);
		phantom.casperPath = mycasperPath;
		phantom.injectJs(bootstrapPath);
		//var casper = require('casper').create();
		var casper = require('casper').create({
    		httpStatusHandlers: {
        		404: function(self, resource) {
            		self.echo(resource.url + ' not found (404)');
        		},
        		500: function(self, resource) {
            		self.echo(resource.url + ' gave an error (500)');
        		}
    		},
    		verbose: true
		});

		return casper;
	}
	this.finishPlugin=function(){
		this.objLogger.insertLog('finishPlugin function called!','debug');
		this.objLogger.insertLog('plugin: '+this.objPlugin.name+' finished','info');
		this.objPlugin.state="finish";
	}
	this.requireFile=function(filePath){
		this.objLogger.insertLog('requireFile function called!','debug');
		this.objLogger.insertLog('file '+filePath,'info');
		if(phantom.injectJs(filePath))
			this.objLogger.insertLog(filePath+' File included succesfully!','info');
		else 
			this.objLogger.insertLog(filePath+" File invalid!",'error');
	}
	this.getLinks=function(url,callback) {
		this.objLogger.insertLog('getLinks function called!','debug');
		var page = require('webpage').create();
	    var genLinks=[];
	    page.open(url, function (status) {
		    if (status !== 'success') {
		        this.objLogger.insertLog('Unable to access network','info');
		    } else {
		    	var results = page.evaluate(function() {
		            var list = document.querySelectorAll('body a'), links = [], i;
		            for (i = 0; i < list.length; i++) {
		            	var tipo=typeof list[i].getAttribute('href');
		            	if(tipo=="object"){
		            		var obj1=list[i].getAttribute('href');
		            		for(j in obj1){
		            			var href=obj1[j].getAttribute('href');
		            		}
		            	}
		            	else var href=list[i].getAttribute('href');
		            	var arrLink={
		            		text:		list[i].innerHTML,
		            		href:		{
		            						absolute:	null,
		            						relative:	null,
		            						anchor:		null,
		            						protocol:	null,
		            						domine:		null,
		            						port:		null
		            					}
		            	};
		            	if(/^http\:\/\/.*/.test(href)){//url type: Absolute http://  
		            		arrLink.href.absolute=href;
		            		//var matches=href.match(/^([a-z]+)\:\/\/([A-z]+\.?[A-z]+)/);
		            		var matches=href.match(/^(?:(ht|f)tp(s?)\:\/\/)?([-.\w]*[0-9a-zA-Z])*(:?([0-9]+)*)((\/?[A-z0-9]+\/?)*([A-z0-9]*\.[A-z]*))*(\?[A-z0-9]+\=[A-z0-9\_]*)*(\#)*/);
		            		arrLink.href.absolute=matches[0];
		            		arrLink.href.protocol=matches[1]+'tp'+matches[2];
		            		arrLink.href.domine=matches[3];
		            		arrLink.href.port=matches[5];
		            		arrLink.href.relative=matches[6];
		            		
		            	}
		            	if(/^\.\.\/|[A-z]+\.[A-z]+\//.test(href)){ //url type: Relative ../file.ext or file.ext/
		            		arrLink.href.relative=href;
		            	}
		            	if(href=="#"){ //url type: anchor #
		            		arrLink.href.anchor=href;
		            	}
		            	links.push(arrLink);
		            }
		            return links;
		        });
		        genLinks=results;
		        callback(genLinks);
		    }
		});
	}
	
	this.getUrlResources=function(url,callback){
		this.objLogger.insertLog('getUrlResources function called!','debug');
		var page = require('webpage').create();
		page.resources = [];
	    page.onResourceReceived = function (res) {
	        if (res.stage === 'start') {
	            page.resources[res.id].startReply = res;
	        }
	        if (res.stage === 'end') {
	            page.resources[res.id].endReply = res;
	        }
	    };
	    page.open(url, function (status) {
	    	if (status !== 'success') {
		        this.objLogger.insertLog('Unable to access network','info');
		    }else{
		    	callback(page.resources);
		    } 	
	    });
	}
	
	this.dump=function(arr,level) {
		this.objLogger.insertLog('dump function called!','debug');
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Stings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	}
	
	
}