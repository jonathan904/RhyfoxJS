
var NoFound404Plugin=function(){
	this.run=function(){
		gapi.setNombrePlugin('NoFound404Plugin');
		this.getBrokenLinks('http://www.colegioparroquialrincondesuba.edu.co/');
	}	
	this.getLinks=function() {
		var links = document.querySelectorAll('body a,a img');
		console.log(typeof links);
		return Array.prototype.map.call(links, function(e) {
			var hrefs=e.getAttribute('href');
			var srcs=e.getAttribute('src');
			var arrGeneral=[];
			arrGeneral.push(hrefs,srcs);				
			return arrGeneral;
		});
	}
	
	this.dump=function(arr,level) {
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Stings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	}
	this.getBrokenLinks=function(url){
		var links=[];
		var fs = require('fs');
		var pathAbsolute=fs.workingDirectory +'/includes/';
		phantom.casperPath = pathAbsolute+'casperjs'; 
		phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');
		var casper = require('casper').create();
		casper.start(url, function() {
			links = this.evaluate(getLinks);
			page = new WebPage();
			for(var link in links){
				var urlActual="";
				for( var i in links[link]){
					urlActual=links[link][i];
					if(urlActual==""){
						console.log('Enlace '+link+' ('+urlActual+') indefinido');
					}
					else{
						/*casper.thenOpen(urlActual, function(status) {
							
						this.echo(status+' We suppose this url return an HTTP 500');
						});*/
						console.log('enlace '+link+' ('+urlActual+') valido ');
						page.open(urlActual,function(status){
							if(status!='success'){
								console.log(urlActual+' Ha fallado!');
							}else{
								console.log(urlActual+' Exitoso');
							}
						});	
						/*var page = new WebPage();
						page.open(urlActual,function(status){
							if(status!='sucess'){
								console.log(urlActual+' Ha fallado!');
							}else{
								console.log(urlActual+' Sin problemas!');
							}
						});*/
					}
				}
			}
			
		});
		casper.run(function() {
			//this.echo(links.length + ' links found:');
			//this.echo(' - ' + links.join('\n - ')).exit();
			//this.exit();
		});
		
	}
}