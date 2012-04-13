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
rhyfoxjs.run();

