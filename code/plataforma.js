var fs = require('fs');
var a=''; 
function recorrerObjet(o){ 
    if(o.constructor==Array) 
        a+='['; 
    if(o.constructor==Object) 
        a+='{'; 
    for(var i in o){ 
        if(o.constructor!=Array) 
            a+=i+':'; 
        if(o[i].constructor==Object){ 
            recorrerObjet(o[i]); 
        }else if(o[i].constructor==Array){ 
            recorrerObjet(o[i]); 
        }else if(o[i].constructor==String){ 
            a+='"'+o[i]+'",'; 
        }else{ 
            a+=o[i]+','; 
        } 
             
    } 
    if(o.constructor==Object) 
        a+='},'; 
    if(o.constructor==Array) 
        a+='],'; 
    return a.substr(0,a.length-1).split(',}').join('}').split(',]').join(']'); 
} 

var pathPlugins=fs.workingDirectory+'/plugins/';
if(fs.isDirectory(pathPlugins)){
	var strPlugins=fs.list(pathPlugins);
	var strPlugins2=recorrerObjet(strPlugins);
	var arrPlugins=strPlugins2.split(',');
	for(var i in arrPlugins){
		if(i>1){
			var nomPlugin=arrPlugins[i].replace(/"/gi,"");
			var nomPlugin=nomPlugin.replace(/]/gi,"");
			var pathPlugin=pathPlugins+nomPlugin;
			phantom.injectJs(pathPlugin);
		}
	}
}
getBrokenLinks('http://www.colegioparroquialrincondesuba.edu.co/');
phantom.exit();