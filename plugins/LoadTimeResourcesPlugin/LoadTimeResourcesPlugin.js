function LoadTimeResourcesPlugin(){
	var instance=this;
	this.run=function(){
		var url=this.configPlugin.url;
		if(url!="" && /^ht|f?tp[s]?.*/.test(url)){
			this.api.objLogger.insertLog('URL: '+url,'info');
			this.loadTimeResources(url);
		}
		else{
			this.api.objLogger.insertLog(url+' Url invalid!','error');
			instance.api.finishPlugin();
		}
	}
	this.loadTimeResources=function(url){
		var casper=this.api.getCasperJs(),responses=[],requests=[],data=[];
		var report=new this.api.report(this.configPlugin.name);
		report.setChartType('ColumnChart');
		report.setTitle('Load time resources');
		report.setUrl(url);
		casper.start(url,function(self){
			requests=instance.api.requests;
			responses=instance.api.responses;
			for(i in requests){
				var requestTime=requests[i].time;
				var responseTime=responses[i].time;
				instance.evaluateLoadTimeResource(data,responses[i].url,requestTime,responseTime);
			}				
		});
		casper.run(function(){
			report.setDataReport(data);
			report.createReport();
			instance.api.finishPlugin();
			
		});	
	}
	this.evaluateLoadTimeResource=function(data,url,requestTime,responseTime){
		var time=responseTime-requestTime;
		data.push({
			link:	url,
			result:	time
		});
		
	}
		
	
}