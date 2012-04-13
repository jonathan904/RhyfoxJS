/**
*	This file management the internal functionality of RhyfoxJS.
* 	If this file is modified maybe exist problems.	
*/

function RhyfoxJS(){
    var instance = this;
	this.currentPath=fs.workingDirectory;
	this.indexPlugin=0;
	this.run=function(){//main method
		this.logger.insertLog('Api started','info');
		this.readConfig();
		this.readPluginsPath();
		this.runPlugins();
	}
	/*
	* Read the plugin path and create the list plugins as plugins object
	*/
	this.readPluginsPath=function(){ 
		this.logger.insertLog('readPluginsPath function called!','info');
		var plugins=fs.list(this.pluginsPath);
		this.logger.insertLog('List the plugins of directory: '+this.pluginsPath,'info');
		this.plugins=[];
		if(plugins.length>2){
			this.logger.insertLog("Directory isn't empty: "+this.pluginsPath,'debug');
			plugins=plugins.slice(2);
			for(i in plugins){
				var pluginPath=this.pluginsPath+'/'+plugins[i]+'/';
				this.logger.insertLog('Scanning directory:'+pluginPath,'info');
				var pluginFilePath=pluginPath+plugins[i]+'.js';
				if(fs.isDirectory(pluginPath)){
					this.logger.insertLog('Directory valid: '+pluginPath,'info');
					if(fs.exists(pluginFilePath)){
						this.logger.insertLog('Plugin file found!: '+pluginFilePath,'info');
						this.plugins.push({
											name:   plugins[i],
											state:  'stop',
											pluginPath:	pluginFilePath
										});
						var pluginsConfigFilePath=pluginPath+'config_'+plugins[i]+'.json';				
						if(fs.exists(pluginsConfigFilePath)){ 
							this.plugins.config= 'config_'+ plugins[i];
							this.plugins.configPath= pluginsConfigFilePath;
							this.logger.insertLog('Config plugin file found!: '+pluginsConfigFilePath,'info');
						}
						else this.logger.insertLog('Config plugin file not found!: '+pluginsConfigFilePath,'warning');			
					}
					else this.logger.insertLog('Directory empty: '+pluginPath,'warning');		
				}
				else this.logger.insertLog('Directory valid: '+pluginPath,'info');
			}
		}
		else this.logger.insertLog('Plugins files no found! '+this.pluginsPath,'error');
		
	}
	this.requireFile=function(filePath){
		if(phantom.injectJs(filePath))
			this.logger.insertLog(filePath+' File included succesfully!','info');
		else 
			this.logger.insertLog(filePath+" File invalid!",'error');
	}
	this.isDirectory=function(directoryPath){
		if(fs.isDirectory(directoryPath)){
			this.directory=directoryPath;
			this.logger.insertLog(this.directory+" Directory is valid.",'debug');
			return true;
		}
		else this.logger.insertLog(this.directory+" Directory invalid.",'debug');
		return false;
	}
	this.runPlugins=function(){
		this.logger.insertLog('runPlugins function called!','info');
		
		if(this.plugins.length>0 && this.indexPlugin<this.plugins.length){
			this.logger.insertLog('Plugins found!','debug');
			
			var state = this.plugins[this.indexPlugin].state;
			console.log('indice--->		'+this.indexPlugin);
			console.log('estado--->		'+state);
			console.log('tamano--->		'+this.plugins.length);
			console.log('Plugin Found');
			this.logger.insertLog('Current plugin: '+this.plugins[this.indexPlugin].name+', state: '+state,'debug');
			
			if(state != 'start'){
				if(state == 'finish') 
					this.indexPlugin++;
					
				this.execute();
				
			}
			console.log('caso--->    '+state);
			
			//Are there more plugins?
			setTimeout(function() { instance.runPlugins() } ,this.timeOut);
			
		}else { this.logger.insertLog("Plugins no found",'debug'); phantom.exit();}
	}
	this.execute=function() {
		this.logger.insertLog('execute function called!'+this.indexPlugin+this.plugins.length,'info');
		
		if(this.indexPlugin<this.plugins.length){ 	
			this.plugins[this.indexPlugin].state='start';
			var pluginPath=this.plugins[this.indexPlugin].pluginPath;
			console.log('pluginPath--->		'+pluginPath);
			this.requireFile(pluginPath);
			this.requireFile(this.currentPath+'/bin/PublicAPI.js');
			eval("var Plugin="+this.plugins[this.indexPlugin].name+";");
			console.log('estado--->		'+this.plugins[this.indexPlugin].state);
			var newPlugin= new Plugin();
			newPlugin.api=new PublicAPI(this.plugins[this.indexPlugin],this.logger);
			newPlugin.run();
			console.log('estadoDesdeLoad--->		'+this.plugins[this.indexPlugin].state);
			//this.logger.insertLog('plugin :'+this.plugins[this.indexPlugin].name+'...started','debug');				
					
			//var ini=this.runPlugins();
			//var _self=this;
		}
		
	}
	/*this.logger.insertLog=function(msg,level){
		
		level = level && this.logLevels.indexOf(level) > -1 ? level : "debug";
		
		if (this.logLevels.indexOf(level) < this.logLevels.indexOf(this.logger.level)) {
			// skip ;)
		}
		else{
			var timestamp=new Date();
			var logPath=this.currentPath+"/../logs/sysLog.log";
			if(!fs.exists(logPath)){
				fs.touch(logPath);
			}
			var file=fs.open(logPath,'a');
			var log=level+":	"+timestamp+" "+msg;
			file.writeLine(log); 
			file.close();
			console.log(log);
		}
	
	}*/
	this.readConfig=function(){
		this.logger.insertLog('readConfig function called!','info');
		this.config_path=this.currentPath+'/../config.json';//Config global file
		var abstConfigPath=fs.absolute(this.config_path);
		this.logger.insertLog('Loading: '+this.config_path,'info');
		this.requireFile(abstConfigPath);
		this.logger.insertLog(this.config_path+' Loading configuration parameters ...','info');
		this.pluginsPath=config.paths.pluginsPath;
		this.logger.insertLog('Plugins path loaded!','info');
		this.logger.config=config.loggger;
		this.logger.insertLog('Logger options loaded!','info');
		this.logger.insertLog('Log levels loaded!','info');
		this.includesPath=config.paths.includesPath;
		this.logger.insertLog('Includes path loaded!','info');
		this.casperPath=config.paths.casperPath;
		this.logger.insertLog('CasperJS path loaded!','info');
		this.timeOut=config.timeout;
		this.logger.insertLog('Timeout parameter loaded!','info');
		this.logger.insertLog('Configuration parameters loaded!','info');
	}
	this.pluginExit=function(){//exit the plataforma.js
		phantom.exit();
	}
}