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
		//var link=links[0].href;
		var link='http://frutasyverduraspeter.com/';
		for(i in links){
			//var j=i++;
			console.log('Link: '+j+'	'+links[i].text+' href:		'+links[i].href);
			j++;
		}
		
		this.api.getUrlResources(link,function(resources){
			var entries = [];

    		resources.forEach(function (resource) {
    			endReply = resource.endReply;
    			console.log('status: '+endReply.status);
    		});
			instance.api.finishPlugin();
		});
		
	}
}