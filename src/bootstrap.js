/**
*	RhyfoxJS is a system that allows multiple plugins 
*	to integrate the analysis of web applications.
*	Repository:: https://github.com/jonathan904/RhyfoxJS
*	Copyright (c) 2012 Jonathand Alberto Serrano Serrano
*	
*/
var fs = require('fs');
var project_path=fs.workingDirectory; //global path
var mainPath=project_path+'/bin/RhyfoxJS.js';//RhyfoxJS path
var loggerPath=project_path+'/bin/Logger.js';//Logger path
phantom.injectJs(mainPath);
phantom.injectJs(loggerPath);
var rhyfoxjs = new RhyfoxJS();
rhyfoxjs.logger=new Logger();
rhyfoxjs.logger.insertLog("  ____  _            __                _ ____",'info');  
rhyfoxjs.logger.insertLog(" |  _ \\| |__  _   _ / _| ___ __  __   | / ___|",'info'); 
rhyfoxjs.logger.insertLog(" | |_) | '_ \\| | | | |_ / _ \\\\ \\/ /_  | \\___ \\",'info'); 
rhyfoxjs.logger.insertLog(" |  _ <| | | | |_| |  _| (_) |>  <| |_| |___) |",'info');
rhyfoxjs.logger.insertLog(" |_| \\_\\_| |_|\\__, |_|  \\___//_/\\_\\\\___/|____/",'info'); 
rhyfoxjs.logger.insertLog("              |___/                             ",'info');
rhyfoxjs.run();

