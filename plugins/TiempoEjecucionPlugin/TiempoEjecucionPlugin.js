function TiempoEjecucionPlugin(){
	
	this.run=function(){
		console.log("Plugin 2");
		this.end();
	}
	this.end=function(){
		//this.api.statePlugin('finish');
		this.api.finishPlugin();
	}	
	
}