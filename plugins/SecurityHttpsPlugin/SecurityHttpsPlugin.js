function SecurityHttpsPlugin(){
	var instance = this;
    this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.urls[6];
		console.log('url:	'+url);
		this.httpsEvaluate(url);
	}
	this.httpsEvaluate=function(url){
		var casper=this.api.getCasperJs(),resquests=[];
		var report=new this.api.report(this.configPlugin.name);
		report.setTitle('Https security plugin');
		report.setUrl(url);
		var data=[];
		casper.start(url, function(self) {
		    resquests=instance.api.requests;
		    var resourceUrl="";
		    if(resquests.length>0){
			    for(i in resquests){
			    	resourceUrl=resquests[i].url;
			    	var result=instance.evaluateResource(resourceUrl);
			    	if(result=="Sucess"){
			    		report.setSuccess();
						data.push({
	    					link:	resourceUrl,
	    					result:	'Sucess'
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
		if(/^https\:\/\/.*/.test(resourceUrl))return "Sucess";
		else return "Fail";
	}
}