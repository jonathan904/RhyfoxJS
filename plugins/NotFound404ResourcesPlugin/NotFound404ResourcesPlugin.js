function NotFound404ResourcesPlugin(){
	var instance=this;
	this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.url;
		if(url!="" && /^ht|f?tp[s]?.*/.test(url)){
			this.api.objLogger.insertLog('URL: '+url,'info');
			this.statusResource(url);
			
		}else{
			 this.api.objLogger.insertLog(url+' Url invalid!','error');
			 instance.api.finishPlugin();
		}	 
	}
	this.statusResource=function(url){
		var report=new this.api.report('NotFound404ResourcesPlugin');
		report.setTitle('Broken Resources Report');
		report.setUrl(url);
		var j=1;
		var data=[],responses=[];
		var casper=this.api.getCasperJs();
		report.casper=casper;
		casper.start(url,function(self){
			responses=instance.api.responses;
			report.getPageImage(0,0,800,1000);
			var result=false;
			for(i in responses){
				var response=responses[i];
				instance.getStatusResource(response,data,report);
			}
		});
		casper.run(function(){
			report.setDataReport(data);
			report.createReport();
			instance.api.finishPlugin();
			
		});
	}
	this.getStatusResource=function(response,data,report){
		if(response.status==404){
					report.setFail();
		    		data.push({
		    			link:	response.url,
		    			status: response.status,
		    			result:	'Fail'
		    		});
	    		}else{
	    			report.setSuccess();
		    		data.push({
		    			link:	response.url,
		    			status: response.status,
		    			result:	'Success'
		    		});	
	    		}
	}
	
}
