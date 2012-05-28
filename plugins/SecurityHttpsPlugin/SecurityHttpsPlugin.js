function SecurityHttpsPlugin(){
	var instance = this;
    this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.url;
		if(url!="" && /^ht|f?tp[s]?.*/.test(url)){
			this.api.objLogger.insertLog('URL: '+url,'info');
			this.httpsEvaluate(url);
		}else{
			this.api.objLogger.insertLog(url+' Url invalid!','error');
			this.api.finishPlugin();
		}
		
	}
	this.httpsEvaluate=function(url){
		var casper=this.api.getCasperJs(),resquests=[];
		var report=new this.api.report(this.configPlugin.name);
		report.setTitle('Https security plugin');
		report.setUrl(url);
		var data=[];
		report.casper=casper;
		casper.start(url, function(self) {
			report.getPageImage(0,0,1500,1000);
		    resquests=instance.api.requests;
		    var resourceUrl="";
		    if(resquests.length>0){
			    for(i in resquests){
			    	resourceUrl=resquests[i].url;
			    	var result=instance.evaluateResource(resourceUrl);
			    	if(result=="Success"){
			    		report.setSuccess();
						data.push({
	    					link:	resourceUrl,
	    					result:	'Success'
	    				});
			    	}else{
			    		report.setFail();
						data.push({
			    			link:	resourceUrl,
			    			result:	'Fail'
			    		});
			    	}
			    	
			    }
		    }else{
		    	report.setAdicionalText('<font color=\'red\'>Error:	</font> FAIL to load the address.');
		    }
		});	
		casper.run(function() {
			report.setDataReport(data);
			report.createReport();
		    instance.api.finishPlugin();
		});
	}
	this.evaluateResource=function(resourceUrl){
		if(/^https\:\/\/.*/.test(resourceUrl))return "Success";
		else return "Fail";
	}
}