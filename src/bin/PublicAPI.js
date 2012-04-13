/**
*Api publico.
*
*Esta clase sera que se utilizen los plugins para comunicarsen con la plataforma.
*Esta clase ofrecera ya las algunos componentes funamentales como CasperJS.
*/
function PublicAPI(objPlugin,objLogger){
	this.objPlugin=objPlugin;
	this.objLogger=objLogger;
	//console.log(project_path);
	/*this.getCasperJs=function(){
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
	}*/
	this.finishPlugin=function(){
		this.objLogger.insertLog('plugin: '+this.objPlugin.name+' state: finish','info');
		this.objPlugin.state="finish";
	}
}