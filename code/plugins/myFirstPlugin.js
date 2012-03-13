function getLinks() {
    var links = document.querySelectorAll('body a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href')
    });
}
function getBrokenLinks(url){
	var links=[];
	var fs = require('fs');
	var pathAbsolute=fs.workingDirectory +'/includes/';
	phantom.casperPath = pathAbsolute+'casperjs'; 
	console.log("la ruta es "+phantom.casperPath);
	phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');
	var casper = require('casper').create();
	casper.echo("La URL es: "+url);
	casper.start(url, function() {
		this.echo("desde casper");
		links = this.evaluate(getLinks);
		
	});
	casper.run(function() {
		this.echo(links.length + ' links found:');
		this.echo(' - ' + links.join('\n - ')).exit();
	});
	
}