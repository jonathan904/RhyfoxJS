/**
*Plataforma.js (nombre provicional) es un sistema que permite 
*integrar multiples plugins para el analisis de aplicaciones web.
*	Repositorio: https://github.com/jonathan904/Proyecto-tesis-herramientas-web
*	Copyright (c) 2012 Jonathand Alberto Serrano Serrano
*
*/
var fs = require('fs');
//Ruta central del proyecto
var project_path=fs.workingDirectory;
phantom.injectJs(project_path+'/bin/functions.js');
var functions=new GeneralApi();
functions.run();

/*
**	Leemos los datos de configuracion.
*/
var config_path=project_path+'/config.json';
functions.require_file(config_path);
var plugins_path=project_path+config.pluginsLocation;
if(functions.validar_directorio(plugins_path)){
	if(functions.obtener_plugins()){
		functions.ejecutar_plugins();
	}
}

//getBrokenLinks('http://www.colegioparroquialrincondesuba.edu.co/');*/
//setTimeout("phantom.exit();",600000);
phantom.exit();
