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
		var page = require('webpage').create(),
	    url = 'http://www.colegioparroquialrincondesuba.edu.co/';
	
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
		            	links.push(href);
		            }
		            return links;
		        });
		        
		        console.log('tamano++++++++++++++++++'+results.length);
		        console.log(results.join('\n'));
		        /*for (var i in results) {
		        	console.log('tipo link actual: '+typeof results[i]);
				  	if(typeof results[i]=="object"){
		        		for (var j in results[i]) {
							console.log('link%%%%%%%%%%%%%: '+results[i][j]);
						}
		        			
		        	}
		          }*/
				
		        	
		        
		    }
		    //phantom.exit();
		    instance.finishPlugin();
		});
		
		/*this.objLogger.insertLog('getLinks function called!','info');
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
		return links;*/
		
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