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
	this.responses=[];
	this.requests=[];
	instance=this;
	this.run=function(){
		this.loadConfig();
	}
	
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
		casper.on('load.failed', function(Object) {
		   instance.objLogger.insertLog('FAIL to load the address:	'+Object.url,'error');		
		});
		casper.on('resource.requested', function(request) {
		   instance.requests[request.id]={
	       	 	headers	:	request.headers,
	       	 	method	:	request.method,	
	       	 	time	:	request.time,
	       	 	url		:	request.url
	       };		
		});
		casper.on('resource.received', function(received) {
		   instance.responses[received.id]={
		   		contentType		:	received.contentType,
		   		headers			:	received.headers,
		   		redirectURL		:	received.redirectURL,
		   		stage			:	received.stage,
		   		status			:	received.status,
		   		statusText		:	received.statusText,
		   		time			:	received.time,
		   		url				:	received.url,
		   		bodySize		:	received.bodySize
	       	 	
	       };
	    });
		casper.on('load.started', function(status) {
		   instance.responses	=	[];
		   instance.requests	=	[];
	    });
		
		return casper;
	}
	this.getImages=function(){
		var images=[];
		for(i in this.responses){
			if(/^image\/(g3fax|gif|ief|jpeg|tiff)$/.test(this.responses[i].contentType)){
				images.push({
					image		:	this.responses[i].url,
					status		:	this.responses[i].status,
					id_resource	:	i
				});
			}
		}
		return images;	
	}
	this.getCss=function(){
		var css=[];
		for(i in this.responses){
			if(/^text\/css$/.test(this.responses[i].contentType)){
				css.push({
					css			:	this.responses[i].url,
					status		:	this.responses[i].status,
					id_resource	:	i
				});
			}
		}
		return css;	
	}
	this.getJavaScripts=function(){
		var javascripts=[];
		for(i in this.responses){
			if(/^text\/javascript$/.test(this.responses[i].contentType)){
				javascripts.push({
					css			:	this.responses[i].url,
					status		:	this.responses[i].status,
					id_resource	:	i
				});
			}
		}
		return javascripts;	
	}
	this.getHeaders=function(){
		var headers=[];
		for(i in this.responses){
			headers.push(this.responses[i].headers);
		}
		return headers;
	}
	this.getContentTypes=function(){
		var contentTypes=[];
		for(i in this.responses){
			contentTypes.push(this.responses[i].contentType);
		}
		return contentTypes;
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
		        instance.requireFile(instance.uriPath);//include uri
		        var k=0,r=[];
		        for(k in results){
		        	var linka=results[k].href.absolute;
		        	if(/^http(s?)\:\/\/.*/.test(linka)){}//skip :)
		        	else{ 
		        		if(/^\.\.[A-z0-9\_]+\/?.*/.test(linka)|| /^[A-z0-9\_]+\.[A-z0-9]+/.test(linka)|| /^[A-z0-9\_]+\/?.*/.test(linka)){
		        			linka=url+linka;
		        		}
		        		if(/^\/?[A-z0-9\_]+\/?.*/.test(linka)|| /^[A-z0-9\_]+\.[A-z0-9]+/.test(linka)|| /^[A-z0-9\_]+\/?.*/.test(linka)){
		        			linka=url+linka;
		        		}
		        		if(/^\#.*/.test(linka)){
							linka=url+''+linka;
						}
						if(linka=='/'){
							linka=url;
						}
		        	}
		        	linka=linka.replace(/\s+/g,"%20");
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
            						port:		typeof uri.port()=="number"?uri.port():80
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
	this.loadConfig=function(){
		this.configPath=this.currentPath+'/../config.json';
		this.requireFile(this.configPath);
		this.uriPath=config.paths.uriPath;
		this.reportPath=config.paths.reportPath;
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
		this.url='';
		this.adicionalText='';
		this.setSuccess=function(){
			this.success++;
		}
		this.setFail=function(){
			this.fail++;
		}
		this.title='Report generate for RhyfoxJS';
		this.setDataReport=function(data){
			this.data=data;
		}
		this.setTitle=function(title){
			this.title=title;
		}
		this.setUrl=function(url){
			this.url=url;
		}
		this.setAdicionalText=function(text){
			this.adicionalText=text+'<br>';
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
			  '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+	
		      '<script type="text/javascript" src="https://www.google.com/jsapi"></script>'+
		      '<script type="text/javascript">'+
		      'google.load("visualization", "1", {packages:["corechart"]});'+
		      'google.setOnLoadCallback(drawChart);'+
		      'function drawChart() {'+
		        'var data = google.visualization.arrayToDataTable(['+
		        '[\'Result\', \'Count\'],';
		   html+='[\'Success\', '+this.success+'],'+
		   		'[\'Fail\', '+this.fail+']'+
		   		']);'+
				'var options = {'+
					'title: 	\''+this.title+'\','+
		        	'colors:	[\'green\',\'red\'],'+
		        	'is3D:		true'+
		        '};'+
		        'var chart = new google.visualization.PieChart(document.getElementById(\'chart_div\'));'+
		        'chart.draw(data, options);'+
		      '}'+
		    '</script>'+
		  '</head>'+
		  '<body>'+
		  	'<a  target=\'_blank\' href=\'http://jonathan904.github.com/RhyfoxJS\'><img src=\'http://i297.photobucket.com/albums/mm213/jonathan52380/rhyfoxjs_icon_trasn.png\' width=\'200\' height=\'150\'></a>'+
		  	'<h1 style=\'text-align:center\'>RhyfoxJS Reports</h1><hr>'+
		    '<div id="chart_div" style="width: 900px; height: 500px;"></div>'+
		    '<p>Report generate for <a target=\'_blank\' href=\'http://jonathan904.github.com/RhyfoxJS\'><b>RhyfoxJS</b></a>:</p>'+
		    '<b>Url:</b>		'+this.url+'<br>'+
		    '<b>Name:</b>		'+this.name+'<br>'+
		    '<b>Date:</b>		'+timestamp+'<br>'+
		    this.adicionalText+
		    '<table>'+
		    '<tr style=\'background-color:#0B610B;color:#ffffff;text-align:center\'>'+
		    	'<td style=\'width:60%\'><b>Link</b></td>'+
		    	'<td style=\'width:40%\'><b>Result</b></td>'+
		    '</tr>';
		    var par=1;
		    var color="";
		    for(i in this.data){
		    	color=par==1?'#088A08':'#848484';
		    	par=par==1?0:1;
		    	html+='<tr style=\'background-color:'+color+';color:#ffffff\'>'+
		    			'<td>'+this.data[i].link+'</td>	'+
		    			'<td style=\'text-align:center\'><font color=\''+(this.data[i].result=='Fail'?'red':'#ffffff')+'\'>'+this.data[i].result+'</font></td>'+
		    		  '</tr>';
		    }
		  html+='</table><hr><p><b>RhyfoxJS (<a target=\'_blank\' href=\'https://twitter.com/RhyfoxJS\'><b>@RhyfoxJS</b></a>)</b> is created by <b>Jonathand Alberto Serrano Serrano</b> (<a target=\'_blank\'  href=\'https://twitter.com/Jonathan904\'>@jonathan904</a>) with the direction of <b>Iván Rey</b>. RhyfoxJS is a project of graduation of the systems engineering program.</p>'+
		  '</body></html>';
			
			file.writeLine(html);
			file.close();
				
		}
		  
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