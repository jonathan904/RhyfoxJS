function RedirectsPlugin(){
	var instance=this;
	this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.url;
		if(url!="" && /^ht|f?tp[s]?.*/.test(url)){
			this.api.objLogger.insertLog('URL: '+url,'info');
			this.evaluateRedirects(url);
		}else{
			this.api.objLogger.insertLog(url+' Url invalid!','error');
			this.api.finishPlugin();
		}	
	}
	this.evaluateRedirects=function(url){
		var casper=this.api.getCasperJs(),responses=[],max=instance.configPlugin.maxRedirects,contRedirects=0,report=new this.api.report(this.configPlugin.name),data=[];
		casper.start(url,function(self){
			responses=instance.api.responses;
			report.setUrl(url);
			for(i in responses){
				if(responses[i].status=='301' || responses[i].status=='302'){
					contRedirects++;
					report.setFail();
					data.push({
    					link:	responses[i].url,
    					status: responses[i].status,
    					result:	'Fail'
    				});	
				}else{
					report.setSuccess();
					data.push({
    					link:	responses[i].url,
    					status: responses[i].status,
    					result:	'Success'
    				});
				}
			}
			if(contRedirects>max){
				report.setAdicionalText('State page:	<font color=\'yellow\'>Warning</font><br> Page Redirects:	'+contRedirects);
			}else{
				report.setAdicionalText('State page:	<font color=\'green\'>Normal</font><br> Page Redirects:		'+contRedirects);
			}
		});
		casper.run(function(){
			report.setDataReport(data);
			report.createReport();
			instance.api.finishPlugin();	
		});
		
	}
	
}
