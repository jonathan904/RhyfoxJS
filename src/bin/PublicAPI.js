/**
*Api publico.
*
*Esta clase sera que se utilizen los plugins para comunicarsen con la plataforma.
*Esta clase ofrecera ya las algunos componentes funamentales como CasperJS.
*/
function PublicAPI(objPlugin,objLogger){
	this.objPlugin=objPlugin;
	this.objLogger=objLogger;
	this.currentPath=fs.workingDirectory;
	instance=this;
	//this.requireFileA(this.currentPath+'/bin/Logger.js');
	//console.log(project_path);
	
	this.getCasperJs=function(){
		var mycasperPath=this.currentPath+'/../includes/casperjs';
		//casperPath=fs.absolute(casperPath);
		var bootstrapPath=mycasperPath+'/bin/bootstrap.js';
		this.objLogger.insertLog('casperjs=========================: '+bootstrapPath,'info');
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
		this.objLogger.insertLog('plugin: '+this.objPlugin.name+' state: finish ','info');
		this.objPlugin.state="finish";
	}
	this.requireFile=function(filePath){
		this.objLogger.insertLog('file '+filePath,'info');
		if(phantom.injectJs(filePath))
			this.objLogger.insertLog(filePath+' File included succesfully!','info');
		else 
			this.objLogger.insertLog(filePath+" File invalid!",'error');
	}
	this.getLinks=function(url) {
		this.objLogger.insertLog('getLinks function called!','info');
		var links=[];
		var casper=this.getCasperJs();
		casper.start(url, function() {
    		links= this.evaluate(function(){
    			var links = document.querySelectorAll('body a');
				return Array.prototype.map.call(links, function(e) {
					return e.getAttribute('href');
				});	
    		});
    		
		});
		return links;
		/*casper.start('http://www.google.fr/', function() {
    		this.echo('Page title is: ' + this.evaluate(function() {
        		return document.title;
    		}), 'INFO'); // Will be printed in green on the console
    		
		});
		casper.run(function() {
		    //this.echo(links.length + ' links found:');
		    //this.echo(' - ' + links.join('\n - ')).exit();
		    this.exit();
		});*/
	}
}