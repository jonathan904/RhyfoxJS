function NoFound404Plugin(){
    var instance = this;
    this.currentPath=fs.workingDirectory;
	this.run=function(){
		var url=this.configPlugin.urls[0];
		console.log('url: '+url);
		this.api.getLinks(url,function(links){
			instance.getBrokenLinks(links);
		});
	
		
	}
	this.getBrokenLinks=function(links){	
		var j=1;
		var casper=this.api.getCasperJs();
		var k=0;
		var link="";
		for(i in links){
			link=j==1?'http://www.google.com.co/jas':links[i].href.absolute;
			if(/^http\:\/\/.*/.test(link)){
				console.log(i+' Link: '+j+'	'+links[i].text+' href:		'+link+' protocol:	'+links[i].href.protocol+' domine:	'+links[i].href.domine);
				j++;
				if(k==0){
					casper.start(link,function(self) {
						self.echo(self.getCurrentUrl());  
					});
				}else{
					casper.thenOpen(link, function(self) {
						self.echo(self.getCurrentUrl());
    				});
				}	
				
				k++;
			}
		}
		casper.run(function(){
			instance.api.finishPlugin();
		});
		
		
		
		
	}
	
}