function GeneralApi(){
	this.currentPath=fs.workingDirectory;
	//this.crear_archivo(this.logPath);
	this.run=function(){
		this.insertar_log("Api invocado.");
		this.leerConfiguracion();
		this.cargarPlugins();
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
					else{ 
						this.plugins.splice(i,1);
						this.insertar_log(plugin+" Archivo inválido");
					}
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
		//console.log('En desarrollo');
		
		for(i in this.plugins){
			var fullPluginPath=this.pluginsPath+this.plugins[i];
			console.log(fullPluginPath);
			//se incluye el codigo del plugin
			this.require_file(fullPluginPath);
			//Se actualiza el estado del plugin 
		}
	}
	this.insertar_log=function(log){
		var timestamp=new Date();
		var path=this.currentPath+"/bin/sysLog.log";
		var file=fs.open(path,'a');
		var totalLog=timestamp+" "+log;
		file.writeLine(totalLog); 
		file.close();
	}
	this.iniciarCasperjs=function(){
		
	}
	this.leerConfiguracion=function(){
		this.config_path=this.currentPath+'/config.json';
		console.log(this.config_path);
		this.insertar_log("abriendo: "+this.config_path);
		this.require_file(this.config_path);
		this.insertar_log(this.config_path+" Cargando parametros de configuración...");
		this.pluginsPath=this.currentPath+config.pluginsPath;
		this.includesPath=this.currentPath+config.includesPath;
		this.casperPath=this.currentPath+config.casperPath;
		this.timeOut=this.currentPath+config.timeout;
		this.insertar_log("Parametros de  configuración cargados.");
	}
	this.cargarPlugins=function(){
		if(this.validar_directorio(this.pluginsPath)){
			if(this.obtener_plugins()){
				this.ejecutar_plugins();
			}
		}
	}
	this.obtenerDatosPlugin=function(jsonPlugin){
		this.pluginProperties.push(nombrePlugin);
	}
}