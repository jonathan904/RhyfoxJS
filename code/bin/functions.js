function GeneralApi(){
	this.currentPath=fs.workingDirectory;
	//this.crear_archivo(this.logPath);
	this.run=function(){
		this.insertar_log("Api invocado.");
	}
	this.require_file=function(filePath){
		if(phantom.injectJs(filePath))this.insertar_log(filePath+" Archivo incluido con exito.");
		else this.insertar_log(filePath+" No es un directorio valido.");
	}
	 this.validar_directorio=function(directoryPath){
		if(fs.isDirectory(directoryPath)){
			this.directory=directoryPath;
			this.insertar_log(this.directory+" Es un directorio valido.");
			return true;
		}
		else this.insertar_log(this.directory+" No es un directorio valido.");
		return false;
	}
	this.obtener_plugins=function(){
		if(typeof this.directory!="undefined" && this.directory!=""){
			this.insertar_log(this.directory+" Directorio Plugins valido.");
			var plugins=fs.list(this.directory);
			if(plugins.length>2){
				this.plugins = plugins.slice(2);
				var validPlugin=0;
				for(i in this.plugins){
					var plugin=this.plugins[i];
					if(/^[A-z][A-z0-9\_\.]+.\js$/.test(plugin)){
						this.insertar_log(plugin+" Archivo valido");
						validPlugin=1;
					}
					else this.insertar_log(plugin+" Archivo inválido");
				}
				if(validPlugin==1)return true;
				else return false;
			}
			else{ 
				console.log('No hay Plugins disponibles');
				this.insertar_log(this.directory+" No hay Plugins disponibles.");
				return false;
			}	
		}
		else{
			console.log('Error al cargar plugins!');
			this.insertar_log(this.directory+" Error al cargar plugins.");
			return false;
		}	
	}
	this.ejecutar_plugins=function(){
		console.log('En desarrollo');
	}
	this.insertar_log=function(log){
		var timestamp=new Date();
		var path=this.currentPath+"/bin/sysLog.log";
		var file=fs.open(path,'a');
		var totalLog=timestamp+" "+log;
		file.writeLine(totalLog); 
		file.close();
	}
}