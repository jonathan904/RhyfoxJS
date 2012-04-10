/**
*	This file management the internal functionality of platform.
* 	If this file is modified maybe exist problems.	
*/

function Main(){
	this.currentPath=fs.workingDirectory;
	this.indexPlugin=0;
	this.run=function(){//main method
		this.insertLog('Api started','info');
		this.readConfig();
		this.readPluginsPath();
		this.runPlugins();
	}
	/*
	* Read the plugin path and create the list plugins as plugins object
	*/
	this.readPluginsPath=function(){ 
		this.insertLog('readPluginsPath function called!','info');
		var plugins=fs.list(this.pluginsPath);
		this.insertLog('List the plugins of directory: '+this.pluginsPath,'info');
		this.plugins=[];
		if(plugins.length>2){
			this.insertLog("Directory isn't empty: "+this.pluginsPath,'debug');
			plugins=plugins.slice(2);
			for(i in plugins){
				var pluginPath=this.pluginsPath+'/'+plugins[i]+'/';
				this.insertLog('Scanning directory:'+pluginPath,'info');
				var pluginFilePath=pluginPath+plugins[i]+'.js';
				if(fs.isDirectory(pluginPath)){
					this.insertLog('Directory valid: '+pluginPath,'info');
					if(fs.exists(pluginFilePath)){
						this.insertLog('Plugin file found!: '+pluginFilePath,'info');
						this.plugins.push({
											name:   plugins[i],
											state:  'stop',
											pluginPath:	pluginFilePath
										});
						var pluginsConfigFilePath=pluginPath+'config_'+plugins[i]+'.json';				
						if(fs.exists(pluginsConfigFilePath)){ 
							this.plugins.config= 'config_'+ plugins[i];
							this.plugins.configPath= pluginsConfigFilePath;
							this.insertLog('Config plugin file found!: '+pluginsConfigFilePath,'info');
						}
						else this.insertLog('Config plugin file no found!: '+pluginsConfigFilePath,'info');			
					}
					else this.insertLog('Directory empty: '+pluginPath,'info');		
				}
				else this.insertLog('Directory valid: '+pluginPath,'info');
			}
		}
		else this.insertLog('Plugins files no found! '+this.pluginsPath,'error');
		
	}
	this.requireFile=function(filePath){
		if(phantom.injectJs(filePath))
			this.insertLog(filePath+' File included succesfully!','info');
		else 
			this.insertLog(filePath+" File invalid!",'debug');
	}
	this.isDirectory=function(directoryPath){
		if(fs.isDirectory(directoryPath)){
			this.directory=directoryPath;
			this.insertLog(this.directory+" Directory is valid.",'debug');
			return true;
		}
		else this.insertLog(this.directory+" Directory invalid.",'debug');
		return false;
	}
	this.runPlugins=function(){
		this.insertLog('runPlugins function called!','info');
		if(this.plugins.length>0){
			this.insertLog('Plugins found!','debug');
			var index=this.indexPlugin;
			var state=this.plugins[this.indexPlugin].state;
			console.log('indice--->		'+index);
			console.log('estado--->		'+state);
			console.log('tamano--->		'+this.plugins.length);
			this.insertLog('Current plugin: '+this.plugins[this.indexPlugin].name+', state: '+state,'debug');
			if(index<this.plugins.length){ 	
				switch(state){
					case 'stop':
						this.insertLog('plugin :'+this.plugins[index].name+'...started','debug');
						this.plugins[this.indexPlugin].state='start';
						this.loadPlugin();
						console.log('caso--->		stop');
						break;
					case 'start':
						console.log('caso--->		start');
						break;
					case 'finish':
						index++;
						this.indexPlugin=index;
						this.loadPlugin();
						console.log('caso-->		finish');
						break;	
				}
			}
		}else this.insertLog("Plugins no found",'debug');
	}
	this.loadPlugin=function(){
		this.insertLog('loadPlugin function called!','info');
		var pluginPath=this.plugins[this.indexPlugin].pluginPath;
		console.log('pluginPath--->		'+pluginPath);
		this.requireFile(pluginPath);
		this.requireFile(this.currentPath+'/bin/PublicAPI.js');
		eval("var Plugin="+this.plugins[this.indexPlugin].name+";");
		console.log('estado--->		'+this.plugins[this.indexPlugin].state);
		var newPlugin= new Plugin();
		newPlugin.api=new PublicAPI(this.plugins[this.indexPlugin]);
		newPlugin.run();
		console.log('estadoDesdeLoad--->		'+this.plugins[this.indexPlugin].state);
		//var ini=this.runPlugins();
		//var _self=this;
		setTimeout(this.runPlugins,this.timeOut);
	}
	this.insertLog=function(msg,level){
		if(typeof this.logLevels=='undefined'){
			level='debug';
			var timestamp=new Date();
			var logPath=this.currentPath+"/../logs/sysLog.log";
			if(!fs.exists(logPath)){
				fs.touch(logPath);
			}
			var file=fs.open(logPath,'a');
			var log=level+":	"+timestamp+" "+msg;
			file.writeLine(log); 
			file.close();
		}else{
			level = level && this.logLevels.indexOf(level) > -1 ? level : "debug";
			var ind=this.logLevels.indexOf(level);
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
			}
		}
	}
	this.readConfig=function(){
		this.insertLog('readConfig function called!','info');
		this.config_path=this.currentPath+'/../config.json';//Config global file
		var abstConfigPath=fs.absolute(this.config_path);
		this.insertLog('Loading: '+this.config_path,'info');
		this.requireFile(abstConfigPath);
		this.insertLog(this.config_path+' Loading configuration parameters ...','info');
		this.pluginsPath=config.paths.pluginsPath;
		this.insertLog('Plugins path loaded!','info');
		this.logger=config.loggger;
		this.insertLog('Logger options loaded!','info');
		this.logLevels=new Array("debug","info","warning","error");
		//this.logLevels={'0':"debug",'1':"info",'2':"warning",'3':"error"};
		this.insertLog('Log levels loaded!','info');
		this.includesPath=config.paths.includesPath;
		this.insertLog('Includes path loaded!','info');
		this.casperPath=config.paths.casperPath;
		this.insertLog('CasperJS path loaded!','info');
		this.timeOut=config.timeout;
		this.insertLog('Timeout parameter loaded!','info');
		this.insertLog('Configuration parameters loaded!','info');
	}
	this.pluginExit=function(){//exit the plataforma.js
		phantom.exit();
	}
}