/**
*	This file management the internal functionality of RhyfoxJS.
* 	If this file is modified maybe exist problems.	
*/

function RhyfoxJS(){
    var instance = this;
	this.currentPath=fs.workingDirectory;
	this.indexPlugin=0;
	this.run=function(){//main method
		this.logger.insertLog('RhyfoxJS started','info');
		this.readConfig();
		this.readPluginsPath();
		this.runPlugins();
	}
	/*
	* Read the plugin path and create the list plugins as plugins object
	*/
	this.readPluginsPath=function(){ 
		this.logger.insertLog('readPluginsPath function called!','debug');
		instance.isRun=false;
		var plugins=fs.list(this.pluginsPath);
		this.logger.insertLog('List the plugins of directory: '+this.pluginsPath,'info');
		this.plugins=[];
		if(plugins.length>2){
			this.logger.insertLog("Directory isn't empty: "+this.pluginsPath,'debug');
			plugins=plugins.slice(2);
			if(fs.exists(this.runPath)){
				instance.isRun=true;
				instance.requireFile(this.runPath);
				eval('var run=arrayExecution;');
				for(i in run){
					var name=run[i].plugin,
						config=run[i].config,
						urls=config.urls;
					if(plugins.indexOf(name)>-1){
						var indexRunPlugin=plugins.indexOf(name),
							pluginPath=this.pluginsPath+'/'+plugins[indexRunPlugin]+'/';
						this.logger.insertLog('Scanning directory:'+pluginPath,'info');
						var pluginFilePath=pluginPath+plugins[indexRunPlugin]+'.js';
						if(fs.exists(pluginFilePath)){
							this.logger.insertLog('Plugin file found!: '+pluginFilePath,'info');
							for(j in urls){
								var url=urls[j];
								this.plugins.push({
									name		:   		name,
									state		:  			'stop',
									pluginPath	:			pluginFilePath,
									config		: 			{
																name:	name,
																url:	url
															}			
								});
							}
											
						}
						else this.logger.insertLog('Directory empty: '+pluginPath,'warning');		
					}
					else this.logger.insertLog('Directory valid: '+pluginPath,'info');	
				}	
			}	
			else{
				for(i in plugins){
					var pluginPath=this.pluginsPath+'/'+plugins[i]+'/';
					this.logger.insertLog('Scanning directory:'+pluginPath,'info');
					var pluginFilePath=pluginPath+plugins[i]+'.js';
					if(fs.isDirectory(pluginPath)){
						this.logger.insertLog('Directory valid: '+pluginPath,'info');
						if(fs.exists(pluginFilePath)){
							this.logger.insertLog('Plugin file found!: '+pluginFilePath,'info');
							var pluginsConfigFilePath=pluginPath+'config_'+plugins[i]+'.json';
							var configPath="";	
							if(fs.exists(pluginsConfigFilePath)){ 
								configPath= pluginsConfigFilePath;
								this.logger.insertLog('Config plugin file found!: '+pluginsConfigFilePath,'info');
							}
							else this.logger.insertLog('Config plugin file not found!: '+pluginsConfigFilePath,'warning');
							
							this.plugins.push({
								name:   			plugins[i],
								state:  			'stop',
								pluginPath:			pluginFilePath,
								pluginConfigPath:	configPath
							});
											
						}
						else this.logger.insertLog('Directory empty: '+pluginPath,'warning');		
					}
					else this.logger.insertLog('Directory valid: '+pluginPath,'info');
				}
			}
		}
		else this.logger.insertLog('Plugins files no found! '+this.pluginsPath,'error');
	}
	this.searchPlugin=function(arrayPlugins,name){
		var is_valid=false;
		for(i in arrayPlugins){
			
		}
	}
	/**
	 *  This function allow include files 
	 */
	this.requireFile=function(filePath){
		if(phantom.injectJs(filePath))
			this.logger.insertLog(filePath+' File included succesfully!','info');
		else 
			this.logger.insertLog(filePath+" File invalid!",'error');
	}
	/**
	 * This function valid if the path is a directory valid
	 */
	this.isDirectory=function(directoryPath){
		if(fs.isDirectory(directoryPath)){
			this.directory=directoryPath;
			this.logger.insertLog(this.directory+" Directory is valid.",'debug');
			return true;
		}
		else this.logger.insertLog(this.directory+" Directory invalid.",'error');
		return false;
	}
	/**
	 * This function runs the plugins of plugins folder
	 */
	this.runPlugins=function(){
		this.logger.insertLog('runPlugins function called!','debug');
		
		if(this.plugins.length>0 && this.indexPlugin<this.plugins.length){
			this.logger.insertLog('Plugins found:		'+this.plugins.length,'debug');
			
			var state = this.plugins[this.indexPlugin].state;
			
			this.logger.insertLog('Plugin Found!','debug');
			this.logger.insertLog('Current plugin: 		'+this.plugins[this.indexPlugin].name,'debug');
			this.logger.insertLog('plugin index:		'+this.indexPlugin,'debug');
			this.logger.insertLog('plugin state:		'+state,'debug');
			this.logger.insertLog('plugin path:			'+this.plugins[this.indexPlugin].pluginPath,'debug');
						
			
			if(state != 'start'){
				if(state == 'finish') 
					this.indexPlugin++;
					
				this.execute();
				
			}
			//Are there more plugins?
			setTimeout(function() { instance.runPlugins() } ,this.timeOut);
			
		}else { this.logger.insertLog("Plugins no found",'debug'); this.exit();}
	}
	this.execute=function() {
		this.logger.insertLog('execute function called!','debug');
		
		if(this.indexPlugin<this.plugins.length){ 	
			this.plugins[this.indexPlugin].state='start';
			this.logger.insertLog('	------------------------------------Plugin:	'+this.plugins[this.indexPlugin].name+' Run! ------------------------------------','info');
			var pluginPath=this.plugins[this.indexPlugin].pluginPath;
			try{
				this.requireFile(pluginPath);
				this.requireFile(this.currentPath+'/bin/RhyfoxJSAPI.js');
				eval("var Plugin="+this.plugins[this.indexPlugin].name+";");
				var newPlugin= new Plugin();
				newPlugin.api= new RhyfoxJSAPI(this.plugins[this.indexPlugin],this.logger);
				newPlugin.api.run();
			}
			catch(err){
				this.logger.insertLog('Error loading Plugin: '+this.plugins[this.indexPlugin].name+' '+err,'info');
			}
			if(instance.isRun){
				try{
					newPlugin.configPlugin=this.plugins[this.indexPlugin].config;
				}
				catch(err){
					this.logger.insertLog('Error in the plugin config:	'+err,'info');	
				}
			}
			else{
				var pluginConfigPath=this.plugins[this.indexPlugin].pluginConfigPath;
				if(pluginConfigPath!=""){
					this.logger.insertLog('Indexing the plugin config','info');
					this.requireFile(pluginConfigPath);
					try{
						eval("var configPlugin=config_"+this.plugins[this.indexPlugin].name+";");
						newPlugin.configPlugin=configPlugin;
					}catch(err){
						this.logger.insertLog('Error in the plugin config: '+err,'info');
					}
				}
			}
			try{
				newPlugin.run();
			}catch(err){
				this.logger.insertLog('Error in the run function '+this.plugins[this.indexPlugin].name+' Plugin: '+err,'info');
			}
			
		}
		
	}
	this.readConfig=function(){//config file: config.js the RhyfoxJS 
		this.logger.insertLog('readConfig function called!','debug');
		this.config_path=this.currentPath+'/../config.json';//Config global file
		var abstConfigPath=fs.absolute(this.config_path);
		if(fs.exists(abstConfigPath)){
			this.logger.insertLog('Loading: '+this.config_path,'info');
			this.requireFile(abstConfigPath);
			this.logger.insertLog(this.config_path+' Loading configuration parameters ...','info');
			this.pluginsPath=config.paths.pluginsPath;
			this.pluginsPath=this.pluginsPath.replace(/\\/g,'/');
			this.logger.insertLog(this.pluginsPath+' Plugins path loaded!','info');
			this.logger.config=config.loggger;
			this.logger.insertLog('Logger options loaded!','info');
			this.logger.insertLog('Log levels loaded!','info');
			this.includesPath=config.paths.includesPath;
			this.includesPath=this.includesPath.replace(/\\/g,'/');
			this.logger.insertLog('Includes path loaded!','info');
			this.casperPath=config.paths.casperPath;
			this.casperPath=this.casperPath.replace(/\\/g,'/');
			this.logger.insertLog('CasperJS path loaded!','info');
			this.runPath=config.paths.runPath;
			this.runPath=this.runPath.replace(/\\/g,'/');
			this.logger.insertLog('Run path loaded!','info');
			this.timeOut=config.timeout;
			this.logger.insertLog('Timeout parameter loaded!','info');
			this.logger.insertLog('Configuration parameters loaded!','info');
		}else{
			this.logger.insertLog('Configuration file no found!','warning');
			this.logger.insertLog('Loading default parameters','info');
			this.pluginsPath='../plugins';
			this.pluginsPath=fs.absolute(this.pluginsPath);
			this.logger.insertLog(this.pluginsPath+' Plugins path loaded!','info');
			this.logger.config={
								level: 'info',
								output: true //default: true
							};
			this.logger.insertLog('Logger options loaded!','info');
			this.logger.insertLog('Log levels loaded!','info');
			this.includesPath='../includes';
			this.includesPath=fs.absolute(this.includesPath);
			this.logger.insertLog(this.includesPath+' Includes path loaded!','info');
			this.casperPath='../includes/casperjs';
			this.casperPath=fs.absolute(this.casperPath);
			this.logger.insertLog(this.casperPath+' CasperJS path loaded!','info');
			this.runPath='';
			this.logger.insertLog('Run path not found!','info');
			this.timeOut=10000;
			this.logger.insertLog('Timeout parameter loaded!','info');
			this.logger.insertLog('Configuration parameters loaded!','info');
		}
	}
	this.exit=function(){//exit the RhyfoxJS.js
		this.logger.insertLog('pluginExit function called!','debug');
		this.logger.insertLog('Exits RhyfoxJS ','info');
		phantom.exit();
	}
}