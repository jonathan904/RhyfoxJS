function getLinks() {
    var links = document.querySelectorAll('body a,a img');
	console.log(typeof links);
    return Array.prototype.map.call(links, function(e) {
		var hrefs=e.getAttribute('href');
		var srcs=e.getAttribute('src');
		var arrGeneral=[];
		arrGeneral.push(hrefs,srcs);				
		return arrGeneral;
    });
}
function var_export (mixed_expression, bool_return) {
    // Outputs or returns a string representation of a variable  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/var_export
    // +   original by: Philip Peterson
    // +   improved by: johnrembo
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   input by: Brian Tafoya (http://www.premasolutions.com/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: echo
    // *     example 1: var_export(null);
    // *     returns 1: null
    // *     example 2: var_export({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, true);
    // *     returns 2: "array (\n  0 => 'Kevin',\n  1 => 'van',\n  2 => 'Zonneveld'\n)"
    // *     example 3: data = 'Kevin';
    // *     example 3: var_export(data, true);
    // *     returns 3: "'Kevin'"
    var retstr = '',
        iret = '',
        cnt = 0,
        x = [],
        i = 0,
        funcParts = [],
        idtLevel = arguments[2] || 2,
        // We use the last argument (not part of PHP) to pass in our indentation level
        innerIndent = '',
        outerIndent = '';
 
    var getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    };
 
    var _makeIndent = function (idtLevel) {
        return (new Array(idtLevel + 1)).join(' ');
    };
 
    var __getType = function (inp) {
        var i = 0;
        var match, type = typeof inp;
        if (type === 'object' && inp.constructor && getFuncName(inp.constructor) === 'PHPJS_Resource') {
            return 'resource';
        }
        if (type === 'function') {
            return 'function';
        }
        if (type === 'object' && !inp) {
            return 'null'; // Should this be just null?
        }
        if (type === "object") {
            if (!inp.constructor) {
                return 'object';
            }
            var cons = inp.constructor.toString();
            match = cons.match(/(\w+)\(/);
            if (match) {
                cons = match[1].toLowerCase();
            }
            var types = ["boolean", "number", "string", "array"];
            for (i = 0; i < types.length; i++) {
                if (cons === types[i]) {
                    type = types[i];
                    break;
                }
            }
        }
        return type;
    };
    var type = __getType(mixed_expression);
 
    if (type === null) {
        retstr = "NULL";
    } else if (type === 'array' || type === 'object') {
        outerIndent = _makeIndent(idtLevel - 2);
        innerIndent = _makeIndent(idtLevel);
        for (i in mixed_expression) {
            var value = this.var_export(mixed_expression[i], true, idtLevel + 2);
            value = typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
            x[cnt++] = innerIndent + i + ' => ' + (__getType(mixed_expression[i]) === 'array' ? '\n' : '') + value;
        }
        iret = x.join(',\n');
        retstr = outerIndent + "array (\n" + iret + '\n' + outerIndent + ')';
    } else if (type === 'function') {
        funcParts = mixed_expression.toString().match(/function .*?\((.*?)\) \{([\s\S]*)\}/);
 
        // For lambda functions, var_export() outputs such as the following:  '\000lambda_1'
        // Since it will probably not be a common use to expect this (unhelpful) form, we'll use another PHP-exportable
        // construct, create_function() (though dollar signs must be on the variables in JavaScript); if using instead
        // in JavaScript and you are using the namespaced version, note that create_function() will not be available
        // as a global
        retstr = "create_function ('" + funcParts[1] + "', '" + funcParts[2].replace(new RegExp("'", 'g'), "\\'") + "')";
    } else if (type === 'resource') {
        retstr = 'NULL'; // Resources treated as null for var_export
    } else {
        retstr = (typeof(mixed_expression) !== 'string') ? mixed_expression : "'" + mixed_expression.replace(/(["'])/g, "\\$1").replace(/\0/g, "\\0") + "'";
    }
 
    if (bool_return !== true) {
        this.echo(retstr);
        return null;
    } else {
        return retstr;
    }
}
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
function getBrokenLinks(url){
	var links=[];
	var fs = require('fs');
	var pathAbsolute=fs.workingDirectory +'/includes/';
	phantom.casperPath = pathAbsolute+'casperjs'; 
	console.log("la ruta es "+phantom.casperPath);
	phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');
	var casper = require('casper').create();
	casper.echo("La URL es: "+url);
	casper.start(url, function() {
		this.echo("desde casper");
		links = this.evaluate(getLinks);
		var tipoArray=typeof links;
		console.log("los links son de tipo: "+tipoArray);
		page = new WebPage();
		//console.log(dump(links));
		
		for(var link in links){
			var urlActual="";
			for( var i in links[link]){
				urlActual=links[link][i];
				if(urlActual==""){
					console.log('Enlace '+link+' ('+urlActual+') indefinido');
				}
				else{
					/*casper.thenOpen(urlActual, function(status) {
						
					this.echo(status+' We suppose this url return an HTTP 500');
					});*/
					console.log('enlace '+link+' ('+urlActual+') valido ');
					page.open(urlActual,function(status){
						if(status!='success'){
							console.log(urlActual+' Ha fallado!');
						}else{
							console.log(urlActual+' Exitoso');
						}
					});	
					/*var page = new WebPage();
					page.open(urlActual,function(status){
						if(status!='sucess'){
							console.log(urlActual+' Ha fallado!');
						}else{
							console.log(urlActual+' Sin problemas!');
						}
					});*/
				}
				//else{
					//var page=new WebPage();
					
				//}
			}
		}
		
	});
	casper.run(function() {
		//this.echo(links.length + ' links found:');
		//this.echo(' - ' + links.join('\n - ')).exit();
		//this.exit();
	});
	
}