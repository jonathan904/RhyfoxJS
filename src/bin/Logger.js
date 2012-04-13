var Logger= function(){
	this.logLevels=new Array("debug","info","warning","error");
	this.config ={
		level: 'debug',
		output: true
	};
	this.insertLog=function(msg,level){
		level = level && this.logLevels.indexOf(level) > -1 ? level : "debug";
		if (this.logLevels.indexOf(level) < this.logLevels.indexOf(this.config.level)) {
			// skip ;)
		}
		else{
			var timestamp=new Date();
			var logPath=this.currentPath+"/../../logs/sysLog.log";
			logPath=fs.absolute(logPath);
			if(!fs.exists(logPath)){
				fs.touch(logPath);
			}
			var file=fs.open(logPath,'a');
			var log=level+":	"+timestamp+" "+msg;
			file.writeLine(log); 
			file.close();
			console.log(log);
		}
	
	}
}
