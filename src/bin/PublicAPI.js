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
	this.estadoLinks=-1;
	instance=this;
	this.genLinks=[];
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
	    this.estadoLinks=0;
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
		        this.genLinks=results;
		        //console.log('tamano++++++++++++++++++'+results.length);
		        console.log(this.genLinks.join('\n'));
		        this.estadoLinks=1;
		        
		    }
		    
		    instance.finishPlugin();
		    
		});
		//console.log('Holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		//return totalLinks;
		
		
	}
	this.getLinks2=function(url){
		if(this.estadoLinks!=0){
			if(this.estadoLinks==1)return this.genLinks;
			this.getLinks(url);
		}
		setTimeout(function() { instance.getLinks2() },2000);
	}
	
}