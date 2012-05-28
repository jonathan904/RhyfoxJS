function NotFound404Plugin(){
    var instance = this;
    this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.url;
		if(url!="" && /^ht|f?tp[s]?.*/.test(url)){
			this.api.objLogger.insertLog('URL: '+url,'info');
			this.api.getLinks(url,function(links){
				instance.getBrokenLinks(url,links);
			});
		}else{
			this.api.objLogger.insertLog(url+' Url invalid!','error');
			instance.api.finishPlugin();
		}
	}
	this.getBrokenLinks=function(url,links){
		var report=new this.api.report('NoFound404Plugin'),
		notification=new this.api.UrlNotification('http://localhost/pruebaURLNotificacion/prueba.php');
		report.setTitle('Broken Links Report');
		report.setUrl(url);
		var data=[];
		var eventsSuccess="";
		var casper=this.api.getCasperJs();
		casper.on('http.status.404', function(resource) {
    		report.setFail();
    		data.push({
    			link:	resource.url,
    			result:	'Fail'
    		});
    	});
    	casper.on('http.status.100', function(resource) {
    		report.setFail();
    		data.push({
    			link:	resource.url,
    			result:	'Success'
    		});
    	});
    	casper.on('http.status.101', function(resource) {
    		report.setFail();
    		data.push({
    			link:	resource.url,
    			result:	'Success'
    		});
    	});
    	//var i=0;
    	for(var i=300;i<308;i++){
    		eventsSuccess+="casper.on('http.status."+i+"', function(resource) {"+
    		"console.log('"+i+"');"+
    		"report.setSuccess();"+
    		"data.push({"+
    			"link:	resource.url,"+
    			"result:	'Success'"+
    		"});"+
		"});";
		}
		for(var i=200;i<207;i++){
    		eventsSuccess+="casper.on('http.status."+i+"', function(resource) {"+
    		"console.log('"+i+"');"+
    		"report.setSuccess();"+
    		"data.push({"+
    			"link:	resource.url,"+
    			"result:	'Success'"+
    		"});"+
		"});";
		}
    	eval(eventsSuccess);
		var k=0;
		var link="";
		for(i in links){
			link=links[i].href.absolute;
			if(k==0){
				casper.start(link,function(self) {
					self.echo(self.getCurrentUrl());
					//console.log('+++++++++++++++++++++++'+JSON.stringify(css, undefined, 4));
				});
			}else{
				casper.thenOpen(link, function(self) {
					self.echo(self.getCurrentUrl());
					//console.log('+++++++++++++++++++++++'+JSON.stringify(css, undefined, 4));
				});
			}	
			
			k++;
		}
		casper.run(function(){
			report.setDataReport(data);
			notification.setData(data);
			notification.send();
			report.createReport();
			instance.api.finishPlugin();
			
		});
	}
	
}