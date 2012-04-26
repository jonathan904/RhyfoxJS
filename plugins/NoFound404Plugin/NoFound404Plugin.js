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
		casper.on('http.status.404', function(resource) {
			casper.echo(resource.url + ' is 404');
		});
		console.log('entrooooooooo '+typeof casper);
		var k=0;
		var link="";
		var link2="";
		for(i in links){
			//var link='http://google.com.co/jas';
			//link=i==0?'http://google.com.co/jas':links[i].href;
			link=j==1?'http://www.google.com.co/jas':links[i].href;
			if(/^http\:\/\/.*/.test(link)){
				//var link2=j==6?'http://google.com.co/jas':link;
				//link2=link;
				
				console.log(i+' Link: '+j+'	'+links[i].text+' href:		'+link);
				j++;
				if(k==0){
					//console.log('holaaaaaa10');
					casper.start(link,function(self) {
						//self.echo(self.getCurrentUrl());
					 	self.echo(i+' hola 2 '+link2);   
					});
				}else{
					casper.thenOpen(link, function(self) {
						self.echo(self.getCurrentUrl());
    					//this.echo(i+"  Now I'm in your yahoo."+link2)
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