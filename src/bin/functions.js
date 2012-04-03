function GeneralApi(){
	this.currentPath=fs.workingDirectory;
	//this.crear_archivo(this.logPath);
	this.run=function(){
		var pluginConfigPath=this.currentPath+'/bin/PluginsConfig.js';
		this.require_file(pluginConfigPath);//Esta es la ruta de un archivo que contiene informacion de cada uno de los plugins.
		this.insertar_log('Api invocado.','info');
		this.leerConfiguracion();
		//this.cargarPlugins(PluginsConfig);
	}
	this.require_file=function(filePath){
		if(phantom.injectJs(filePath))
			this.insertar_log(filePath+' Archivo incluido con exito.','info');
		else 
			this.insertar_log(filePath+" No es un directorio valido.",'debug');
	}
	 this.validar_directorio=function(directoryPath){
		if(fs.isDirectory(directoryPath)){
			this.directory=directoryPath;
			this.insertar_log(this.directory+" Es un directorio valido.",'debug');
			return true;
		}
		else this.insertar_log(this.directory+" No es un directorio valido.",'debug');
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
					if(/^[A-z][A-z0-9\_\.]+\.js|json$/.test(plugin)){
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
				this.insertar_log(this.directory+" No hay Plugins disponibles.", 'error');
				return false;
			}	
		}
		else{
			console.log('Error al cargar plugins!');
			this.insertar_log(this.directory+" Error al cargar plugins.");
			return false;
		}	
	}
	this.ejecutar_plugins=function(config){
		for(nombrePlugin in config){
			var configPlugin=config[nombrePlugin];
			var pluginPath=this.pluginsPath+nombrePlugin+'.js';
			var configPluginPath=this.pluginsPath+configPlugin+'.json';
			this.require_file(configPluginPath);
			this.require_file(pluginPath);
			eval("var objConfigPlugin="+configPlugin);
			objConfigPlugin.estado='Inicializado';
			console.log(objConfigPlugin.estado);
			this.setPluginState(objConfigPlugin.estado);
			var pluginName=objConfigPlugin.name;
			eval("var newPlugin="+pluginName+";");
			var newObject= new newPlugin(objConfigPlugin);
			// aqui se necesita apiPublic
			newObject.api=new PlubicAPI();
			newObject.run();
			console.log(objConfigPlugin.estado);
			this.pluginEvaluator(objConfigPlugin);
			
		}
		/*for(i in this.plugins){
			var fullPluginPath=this.pluginsPath+this.plugins[i];
			console.log(fullPluginPath);
			//se incluye el codigo del plugin
			this.require_file(fullPluginPath);
			var pluginName=PluginConfig.name;
			var strStarPlugin=" var newObject= new "+pluginName+"()";
			eval(strStarPlugin);
			newObject.run();	
		}*/
	}
	this.insertar_log=function(log,nivel){
		var timestamp=new Date();
		var path=this.currentPath+"/../logs/sysLog.log";
		if(!fs.exists(path)){
			fs.touch(path);
		}
		var file=fs.open(path,'a');
		var totalLog=nivel+":	"+timestamp+" "+log;
		file.writeLine(totalLog); 
		file.close();
		
	}
	this.iniciarCasperjs=function(){
		
	}
	this.leerConfiguracion=function(){
		this.config_path=this.currentPath+'/../config.json';
		this.insertar_log("abriendo: "+this.config_path,'info');
		var absolute=fs.absolute(this.config_path);
		this.require_file(absolute);
		this.insertar_log(this.config_path+" Cargando parametros de configuración...",'info');
		this.pluginsPath=config.paths.pluginsPath;
		this.includesPath=config.paths.includesPath;
		this.casperPath=config.paths.casperPath;
		console.log(this.pluginsPath);
		this.timeOut=config.timeout;
		this.insertar_log("Parametros de  configuración cargados.",'info');
	}
	this.cargarPlugins=function(config){
		if(this.validar_directorio(this.pluginsPath)){
			if(this.obtener_plugins()){
				this.ejecutar_plugins(config);
			}
		}
	}
	this.obtenerDatosPlugin=function(jsonPlugin){
		this.pluginProperties.push(nombrePlugin);
	}
	this.setPluginState=function(state){
		this.pluginState=state;
	}
	this.getPluginState=function(){
		return this.pluginState;
	}
	this.pluginEvaluator=function(objConfigPlugin){
		var estado=objConfigPlugin.estado;
		if(estado=="Inicializado"){
			console.log("Se vuelve a ejecutar");
			setTimeout("this.pluginEvaluator(objConfigPlugin);",this.timeOut);
		}
		else if(estado=="Finalizado"){
			this.pluginExit(); 
		}
	}
	this.pluginExit=function(){
		phantom.exit();
	}
}