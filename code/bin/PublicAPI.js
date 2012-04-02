/**
*Api publico.
*
*Esta clase sera que se utilizen los plugins para comunicarsen con la plataforma.
*Esta clase ofrecera ya las algunos componentes funamentales como CasperJS.
*/
function PublicAPI(){
	console.log(project_path);
	this.getCasperJs=function(){
		var casper = require('casper').create({
			httpStatusHandlers: {
				404: function(self, resource) {
					self.echo(resource.url + ' not found (404)');
				},
				500: function(self, resource) {
					self.echo(resource.url + ' gave an error (500)');
				}
			},
			verbose: true
		});
		return casper;
	}
	
}