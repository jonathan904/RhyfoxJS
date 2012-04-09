/**
*	Plataforma.js (temporary name) is a system that allows multiple plugins 
*	to integrate the analysis of web applications.
*	Repository:: https://github.com/jonathan904/Proyecto-tesis-herramientas-web
*	Copyright (c) 2012 Jonathand Alberto Serrano Serrano
*
*/
var fs = require('fs');
var project_path=fs.workingDirectory; //global path
var mainPath=project_path+'/bin/main.js';
phantom.injectJs(mainPath);
var main=new Main();
main.run();

