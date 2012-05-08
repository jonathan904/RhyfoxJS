function redirectsPlugin(){
	var instance=this;
	this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.urls[0];
		console.log('url:	'+url);
		this.evaluateRedirects(url);
	}
	this.evaluateRedirects=function(url){
		var casper=this.api.getCasperJs(),responses=[],max=instance.configPlugin.maxRedirects,contRedirects=0,report=new this.api.report(this.configPlugin.name),data=[];
		casper.start(url,function(self){
			responses=instance.api.responses;
			for(i in responses){
				if(responses[i].status=='301' || responses[i].status=='302'){
					contRedirects++;
					report.setFail();
					data.push({
    					link:	responses[i].url+' ('+responses[i].status+')',
    					result:	'Fail'
    				});	
				}else{
					report.setSuccess();
					data.push({
    					link:	responses[i].url+' ('+responses[i].status+')',
    					result:	'Sucess'
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
