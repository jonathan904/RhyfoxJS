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
			var timestamp= this.getDate();
			var logPath=this.currentPath+"/../../logs/sysLog.log";
			logPath=fs.absolute(logPath);
			if(!fs.exists(logPath)){
				fs.touch(logPath);
			}
			var file=fs.open(logPath,'a');
			var log=level+":	"+timestamp+" "+msg;
			file.writeLine(log); 
			file.close();
			this.config.output?console.log(log):"";
		}
	
	}
	/**
	 * This function return the current Date (timestamp)
	 */
	this.getDate= function(){
		var date= new Date(); //Date Object
		var year= date.getFullYear(); //get year
		var months= new Array("Jan","Feb","Mar","Apr","May","Ju","Aug","Sep","Oct","Nov","Dec"); //months array
		var month= months[date.getMonth()]; //get month
		var days= new Array("Mon","Tue","Wen","Thu","Fri","Sat","Sun"); //days array
		var weekDay= days[date.getDay()]; //day of week (0-6)
		var day= date.getUTCDate(); //day of month (1-31)
		var hour= date.getHours(); //hour
		var minute= date.getMinutes(); //minute
		var second= date.getSeconds(); //second
		
		return weekDay+' '+month+' '+day+' '+year+' '+hour+':'+minute+':'+second;
	}
}
