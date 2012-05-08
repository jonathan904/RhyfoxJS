function NoFound404Plugin(){
    var instance = this;
    this.currentPath=fs.workingDirectory;
	this.run=function(){
		instance.api.finishPlugin();
		/*var url=this.configPlugin.urls[5];
		//console.log('url: '+url);
		this.api.getLinks(url,function(links){
			instance.getBrokenLinks(url,links);
		});*/
	
		
	}
	this.getBrokenLinks=function(url,links){
		var report=new this.api.report('NoFound404Plugin');
		report.setTitle('Broken Links Report');
		report.setUrl(url);
		var j=1;
		var data=[];
		var casper=this.api.getCasperJs();
		casper.on('http.status.404', function(resource) {
    		report.setFail();
    		data.push({
    			link:	resource.url,
    			result:	'Fail'
    		});
    	});
		casper.on('http.status.200', function(resource) {
    		report.setSuccess();
    		data.push({
    			link:	resource.url,
    			result:	'Sucess'
    		});
		});
		casper.on('http.status.302', function(resource) {
    		report.setSuccess();
    		data.push({
    			link:	resource.url,
    			result:	'Sucess'
    		});
		});
		casper.on('http.status.301', function(resource) {
    		report.setSuccess();
    		data.push({
    			link:	resource.url,
    			result:	'Sucess'
    		});
		});
		var k=0;
		var link="";
		for(i in links){
			link=j==1?'http://www.google.com.co/jas':links[i].href.absolute;
			j++;
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
			report.createReport();
			instance.api.finishPlugin();
			
		});
	}
	
}