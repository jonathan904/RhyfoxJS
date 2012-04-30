/**
*API.
*
*This class clase allow the comunication of plugins with RhyfoxJS. API provides some tools 
* to facilitate the programming in RhyfoxJS.
* 
*/
function PublicAPI(objPlugin,objLogger){
	this.objPlugin=objPlugin;
	this.objLogger=objLogger;
	this.currentPath=fs.workingDirectory;
	//phantom.injectJs('C:\\Users\\Jonathand\\My Documents\\Aptana Studio 3 Workspace\\RhyfoxJS\\includes\\jsuri1.1.1\\jsuri-1.1.1.js');//include uri
	//this.uri= Uri;
	//var uri = new this.uri('http://user:pass@www.test.com:81/index.html?q=books#fragment');
	instance=this;
	
	this.getCasperJs=function(){
		this.objLogger.insertLog('getCasperJs function called!','debug');
		var mycasperPath=this.currentPath+'/../includes/casperjs';
		var bootstrapPath=mycasperPath+'/bin/bootstrap.js';
		this.objLogger.insertLog('bootstrap Path: '+bootstrapPath,'debug');
		//this.requireFile(bootstrapPath);
		phantom.casperPath = mycasperPath;
		phantom.injectJs(bootstrapPath);
		//var casper = require('casper').create();
		var casper = require('casper').create({
    		httpStatusHandlers: {
        		404: function(self, resource) {
            		self.echo(resource.url + ' not found (404)');
        		},
        		500: function(self, resource) {
            		self.echo(resource.url + ' gave an error (500)');
        		}
    		},
    		verbose: true
		});

		return casper;
	}
	this.finishPlugin=function(){
		this.objLogger.insertLog('finishPlugin function called!','debug');
		this.objLogger.insertLog('plugin: '+this.objPlugin.name+' finished','info');
		this.objPlugin.state="finish";
	}
	this.requireFile=function(filePath){
		this.objLogger.insertLog('requireFile function called!','debug');
		this.objLogger.insertLog('file '+filePath,'debug');
		if(phantom.injectJs(filePath))
			this.objLogger.insertLog(filePath+' File included succesfully!','debug');
		else 
			this.objLogger.insertLog(filePath+" File invalid!",'error');
	}
	this.getLinks=function(url,callback) {
		this.objLogger.insertLog('getLinks function called!','debug');
		this.objLogger.insertLog('url: '+url,'info');
		var page = require('webpage').create();
	    var genLinks=[];
	    page.open(url, function (status) {
		    if (status !== 'success') {
		        this.objLogger.insertLog('Unable to access network','info');
		    } else {
		    	var results = page.evaluate(function() {
		            var list = document.querySelectorAll('body a'), links = [], i;
		            for (i = 0; i < list.length; i++) {
		            	var tipo=typeof list[i].getAttribute('href');
		            	if(tipo=="object"){
		            		var obj1=list[i].getAttribute('href');
		            		for(j in obj1){
		            			var href=obj1[j].getAttribute('href');
		            		}
		            	}
		            	else var href=list[i].getAttribute('href');
		            	
		            	var arrLink={
		            		text:		list[i].innerHTML,
		            		href:		{
		            						absolute:	href,
		            						relative:	null,
		            						anchor:		null,
		            						protocol:	null,
		            						domine:		null,
		            						query:		null,
		            						port:		null
		            					}
		            	};
		            	links.push(arrLink);
		            }
		            return links;
		        });
		        instance.requireFile('C:\\Users\\Jonathand\\My Documents\\Aptana Studio 3 Workspace\\RhyfoxJS\\includes\\jsuri1.1.1\\jsuri-1.1.1.js');//include uri
		        var k=0,r=[];
		        for(k in results){
		        	var linka=results[k].href.absolute;
		        	if(/^http\:\/\/.*/.test(linka)){}//skip :)
		        	else{ 
		        		if(/^\.\.[A-z0-9\_]+\/?.*/.test(linka)|| /^[A-z0-9\_]+\.[A-z0-9]+/.test(linka)|| /^[A-z0-9\_]+\/?.*/.test(linka)){
		        			linka=url+linka;
		        		}
		        		if(linka=='#')linka=url+linka;
		        	}
		        	var uri=new Uri(linka);
		        	var arrRL={
		        		url:	url, //URL of  href origin
		        		text:	results[k].text,
	        			href:	{
            						absolute:	linka,
            						relative:	uri.path(),
            						anchor:		uri.anchor(),
            						protocol:	uri.protocol(),
            						domine:		uri.host(),
            						query:		uri.query(),
            						port:		uri.port()
	            				}
		        	};
		        	r.push(arrRL);
		        }
		        instance.objLogger.insertLog('Links of '+url+':  '+JSON.stringify(r, undefined, 4),'info');
		        genLinks=r;
		        callback(genLinks);
		    }
		});
	}
	
	this.getUrlResources=function(url,callback){
		this.objLogger.insertLog('getUrlResources function called!','debug');
		var page = require('webpage').create();
		page.resources = [];
	    page.onResourceReceived = function (res) {
	        if (res.stage === 'start') {
	            page.resources[res.id].startReply = res;
	        }
	        if (res.stage === 'end') {
	            page.resources[res.id].endReply = res;
	        }
	    };
	    page.open(url, function (status) {
	    	if (status !== 'success') {
		        this.objLogger.insertLog('Unable to access network','info');
		    }else{
		    	callback(page.resources);
		    } 	
	    });
	}
	this.report=function(name){//report system of plugins
		this.name=name;
		this.data=[];
		this.success=0;
		this.fail=0;
		this.setSuccess=function(){
			this.success++;
		}
		this.setFail=function(){
			this.fail++;
		}
		this.title='Report generate for RhyfoxJS';
		this.dataReport=function(result){
			this.data.push(result);
		}
		this.setTitle=function(title){
			this.title=title;
		}
		this.createReport=function(){
			instance.objLogger.insertLog('report function called!','info');
			var timestamp=instance.objLogger.getDate(); //current time
			//var reportPath='C:\\Users\Jonathand\\My Documents\\Aptana Studio 3 Workspace\\RhyfoxJS\\reports';
			var reportPath=instance.currentPath;
			console.log(reportPath);
			timestamp1=timestamp.replace(/\s+/g,'_');
			timestamp1=timestamp.replace(/\:+/g,'_');
			var reportFolderName=timestamp1+'_'+this.name;
			var reportFolderPath=reportPath+'/../reports/'+reportFolderName+'/';
			var reportPath=reportFolderPath+reportFolderName+'.html';
			console.log(reportPath);
			fs.makeDirectory(reportFolderPath);
			fs.touch(reportPath);
			var file=fs.open(reportPath,'a');
			var html='<html><head>'+
		      '<script type="text/javascript" src="https://www.google.com/jsapi"></script>'+
		      '<script type="text/javascript">'+
		      'google.load("visualization", "1", {packages:["corechart"]});'+
		      'google.setOnLoadCallback(drawChart);'+
		      'function drawChart() {'+
		        'var data = google.visualization.arrayToDataTable(['+
		        '[\'Task\', \'Hours per Day\'],';
		        var length=this.data.length-1;
		        var ext="";
		        /*var success=0;
		        var fail=0;
		        for(i in this.data ){
		        	if(this.data[i]==1)success++;
					else fail++;	
				} */	
		   html+='[\'Success\', '+this.success+'],';
		   html+='[\'Fail\', '+this.fail+']';       
		   html+=']);'+
				'var options = {'+
					'title: 	\''+this.title+'\','+
		        'colors:	[\'green\',\'red\']'+
		        '};'+
		        'var chart = new google.visualization.PieChart(document.getElementById(\'chart_div\'));'+
		        'chart.draw(data, options);'+
		      '}'+
		    '</script>'+
		  '</head>'+
		  '<body>'+
		  	'<a href=\'http://jonathan904.github.com/RhyfoxJS\'><img src=\'http://i297.photobucket.com/albums/mm213/jonathan52380/rhyfoxjs_icon_trasn.png\' width=\'200\' height=\'150\'></a>'+
		  	'<h1 style=\'text-align:center\'>RhyfoxJS Reports</h1><hr>'+
		    '<div id="chart_div" style="width: 900px; height: 500px;"></div>'+
		    '<p>Report generate for <a href=\'http://jonathan904.github.com/RhyfoxJS\'><b>RhyfoxJS</b></a>:</p>'+
		    'Name:		'+this.name+'<br>'+
		    'Date:		'+timestamp+'<br>'+
		  '</body></html>';
			
			file.writeLine(html);
			file.close();
				
		}
		  
		
		 
		
	}
	this.reportData=function(result){
		
	}
	this.dump=function(arr,level) {
		this.objLogger.insertLog('dump function called!','debug');
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
	
	
}