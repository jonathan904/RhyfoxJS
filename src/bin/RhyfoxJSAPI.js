/**
*API.
*
*This class clase allow the comunication of plugins with RhyfoxJS. API provides some tools 
* to facilitate the programming in RhyfoxJS.
* 
*/
function RhyfoxJSAPI(objPlugin,objLogger){
	this.objPlugin=objPlugin;
	this.objLogger=objLogger;
	this.currentPath=fs.workingDirectory;
	this.responses=[];
	this.requests=[];
	var instance=this;
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
		this.objLogger.insertLog('	------------------------------------Plugin:	'+this.objPlugin.name+' Finished ------------------------------------','info');
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
		        var lastChar=url.substr(url.length-1);
		        for(k in results){
		        	var linka=results[k].href.absolute;
		        	var invalidLink=false;
		        	var processed=false;
		        	if(/^http(s?)\:\/\/.*/.test(linka)){}//skip :)
		        	else{
		        		//console.log('Entro '+linka ); 
		        		if((/^\.\.[A-z0-9\_]+\/?.*/.test(linka)|| /^[A-z0-9\_]+\.[A-z0-9]+/.test(linka)|| /^[A-z0-9\_]+\/?.*/.test(linka))&& !processed){
		        			if(/^mailto.*/.test(linka)){
		        				invalidLink=true;
		        				processed=true;
		        			}else{
		        				if((/^[A-z0-9\_]+\.[A-z0-9]+/.test(linka) || /^[A-z0-9\_]+\/?.*/.test(linka))&& lastChar!='/'){
		        					linka=url+'/'+linka;
			        				processed=true;
		        				}
		        				else{
			        				linka=url+linka;
			        				processed=true;
		        				}
		        			}
		        		}
		        		if((/^\/?[A-z0-9\_]+\/?.*/.test(linka)|| /^[A-z0-9\_]+\.[A-z0-9]+/.test(linka)|| /^[A-z0-9\_]+\/?.*/.test(linka))&& !processed){
		        			if(/^mailto.*/.test(linka)){
		        				invalidLink=true;
		        				processed=true;
		        			}
		        			else{
		        				if((/^[A-z0-9\_]+\.[A-z0-9]+/.test(linka) || /^[A-z0-9\_]+\/?.*/.test(linka))&& lastChar!='/'){
		        					linka=url+'/'+linka;
		        					processed=true;
		        				}else{
		        					linka=url+linka;
		        					processed=true;
		        				}
		        			}
		        		}
		        		if(/^\#.*/.test(linka) && !processed){
		        			if(lastChar=='/'){
								linka=url+''+linka;
								processed=true;
							}else{
								linka=url+'/'+linka;
								processed=true;
							}
						}
						if(linka=='/' && !processed){
							linka=url;
							processed=true;
						}
		        	}
		        	if(!invalidLink){
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
		        }
		        instance.objLogger.insertLog('Links of '+url+':  '+JSON.stringify(r, undefined, 4),'info');
		        genLinks=r;
		        callback(genLinks);
		    }
		});
	}
	this.loadConfig=function(){
		this.configPath=this.currentPath+'/../config.json';
		if(fs.exists(this.configPath)){
			this.requireFile(this.configPath);
			this.uriPath=config.paths.uriPath;
			this.reportPath=config.paths.reportPath;
		}else{
			this.uriPath='../includes/jsuri1.1.1/jsuri-1.1.1.js';
			this.uriPath=fs.absolute(this.uriPath);
			this.reportPath='../reports';
			this.reportPath=fs.absolute(this.reportPath);
		}
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
		this.timestamp=instance.objLogger.getDate(); //current time
		this.pageImage=false;
		this.imagePath="";
		this.leftImage=0;
		this.topImage=0;
		this.widthImage=0;
		this.heightImage=0;
		var instanceRep=this;
		this.chartType='PieChart';
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
		this.setChartType=function(type){
				if(typeof type =='undefined' || (type!='ColumnChart' && type!='PieChart')){
					this.chartType='PieChart';
				}
				else{
					this.chartType=type;
				}
		}
		this.getPageImage=function(top,left,width,height){
			instanceRep.topImage=top;
			instanceRep.leftImage=left;
			instanceRep.widthImage=width;
			instanceRep.heightImage=height;
			if(this.url!=""){
				instanceRep.pageImage=true;
				var path=instanceRep.getReportPath();
				path+=instanceRep.reportFolderName+'.png';
				instanceRep.imagePath=path;
				this.casper.capture(path, {
			        top: top,
			        left: left,
			        width: width,
			        height: height
			    });
			}
		}
		this.getReportPath=function(){
			var reportPath=instance.currentPath;
			var timestamp1=this.timestamp.replace(/\s+/g,'_');
			timestamp1=this.timestamp.replace(/\:+/g,'_');
			instanceRep.reportFolderName=timestamp1+'_'+this.name;
			var reportFolderPath=reportPath+'/../reports/'+instanceRep.reportFolderName+'/';
			return reportFolderPath;
		}
		this.createReport=function(){
			instance.objLogger.insertLog('report function called!','info');
			var reportFolderPath=this.getReportPath();
			var reportPath=reportFolderPath+instanceRep.reportFolderName+'.html';
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
		      'function drawChart() {';
		        
		   if(this.chartType=='ColumnChart'){
		   		/*var strData=[],arrData=[];
		   		strData.push('Data');
		   		arrData.push('Data');*/
		   		var strData="var data = google.visualization.arrayToDataTable([['Data'";
		   		var strData2="],['Data'";
		   		for(i in this.data){
		   			strData+=",'"+this.data[i].link+"'";
		   			strData2+=","+this.data[i].result;
		   		}
		   		strData2+="]]);";
		   		var text=strData+strData2;
		   		html+=strData+strData2+
		   		'var options = {'+
          		'title: \'Company Performance\','+
          		'hAxis: {title: \''+this.title+'\', titleTextStyle: {color: \'red\'}},'+
          		'is3D:		true,'+
          		'title: 	\''+this.title+'\''+
        		'};';
		        
		   }
		   else{
		   		html+='var data = google.visualization.arrayToDataTable(['+
		        '[\'Result\', \'Count\'],'+
		   		'[\'Success\', '+this.success+'],'+
			   		'[\'Fail\', '+this.fail+']'+
			   		']);'+
			   		'var options = {'+
						'title: 	\''+this.title+'\','+
			        	'colors:	[\'#1BB513\',\'red\'],'+
			        	'is3D:		true'+
			        '};';	
		   }   		
		   html+='var chart = new google.visualization.'+this.chartType+'(document.getElementById(\'chart_div\'));'+
		        'chart.draw(data, options);'+
		      '}'+
		    '</script>'+
		    '<style>'+
				'tr {'+
					'font-family: Arial,Helvetica,sans-serif;'+
					'font-size: 13px;'+
				'}'+
				'body {'+
					'font-family: Arial,Helvetica,sans-serif;'+
					'font-size: 13px;'+
				'}'+
			'</style>'+
		  '</head>'+
		  '<body>'+
		  	'<a  target=\'_blank\' href=\'http://jonathan904.github.com/RhyfoxJS\'><img src=\'http://i297.photobucket.com/albums/mm213/jonathan52380/rhyfoxjs_icon_trasn.png\' width=\'200\' height=\'150\'></a>'+
		  	'<h1 style=\'text-align:center\'>RhyfoxJS Reports</h1><hr>'+
		    '<div id="chart_div" style="width: 900px; height: 500px;"></div>';
		    if(this.pageImage){
		  		html+='<img src=\''+this.imagePath+'\' width=\''+this.widthImage+'\' height=\''+this.heightImage+'\'>';
		  	}
		    html+='<p>Report generate for <a target=\'_blank\' href=\'http://jonathan904.github.com/RhyfoxJS\'><b>RhyfoxJS</b></a>:</p>'+
		    '<b>Url:</b>		<a href=\''+this.url+'\' target=\'_blank\'>'+this.url+'</a><br>'+
		    '<b>Name:</b>		'+this.name+'<br>'+
		    '<b>Date:</b>		'+this.timestamp+'<br>'+
		    this.adicionalText+
		    '<table>'+
		    '<tr style=\'background-color:#4BF46D;color:#ffffff;text-align:center\'>'+
		    	'<td style=\'width:60%\'><b>Link</b></td>'+
		    	'<td style=\'width:40%\'><b>Result</b></td>'+
		    '</tr>';
		    var par=1;
		    var color="";
		    this.data.sort();
		    for(i in this.data){
		    	color=par==1?'#A0EBAF':'#F1F8F1';
		    	par=par==1?0:1;
		    	var isFailSuc=this.data[i].result=='Fail'||this.data[i].result=='Success'?true:false,
		    		colorFail='#6E6E6E',
		    		status=typeof this.data[i].status!='undefined'?'('+this.data[i].status+')':"";
		    		;
		    	
		    	html+='<tr style=\'background-color:'+(this.data[i].result=='Fail'?colorFail:color)+';color:#000000\'>'+
		    			'<td><a target=\'_blank\' href=\''+this.data[i].link+'\'>'+this.data[i].link+status+'</a></td>	'+
		    			'<td style=\'text-align:center;background-color:'+(isFailSuc?this.data[i].result=='Fail'?'#F60606':'#0DF03B':'')+'\'><font>'+this.data[i].result+'</font></td>'+
		    		  '</tr>';
		    }
		  html+='</table><hr><p><b>RhyfoxJS (<a target=\'_blank\' href=\'https://twitter.com/RhyfoxJS\'><b>@RhyfoxJS</b></a>)</b> is created by <b>Jonathand Alberto Serrano Serrano</b> (<a target=\'_blank\'  href=\'https://twitter.com/Jonathan904\'>@jonathan904</a>) with the direction of <b>Iv&aacute;n Rey</b>. RhyfoxJS is a project of graduation of the systems engineering program.</p>'+
		  '</body></html>';
			
			file.writeLine(html);
			file.close();
				
		}
		  
	}
	this.UrlNotification=function(urlNft){
		this.urlNft=urlNft;
		this.dataNft=[];
		var instanceNft=this;
		instance.requireFile('../includes/webtoolkit.base64/webtoolkit.base64.js');
		this.Base64=Base64;
		this.setData=function(data){
			var txtData='{';
			for(i in data){
				txtData+='"link'+i+'":"'+data[i].link+'",';
				txtData+='"result'+i+'":"'+data[i].result+'",';
			}
			txtData=txtData.substring(0,txtData.length-1);
			txtData+='}';
			this.dataNft=txtData;
			this.dataNft=this.Base64.encode(this.dataNft);
		}
		this.send=function(){
			var pageNft = require('webpage').create(),
				params = 'data='+this.dataNft,
				params ='data=Mundo';
			pageNft.open(this.urlNft,'post',params,function(status){
				if(status!=='success'){
					instance.objLogger.insertLog('can\'t send the data to specificated Destination URL','error');		
				}else{
					instance.objLogger.insertLog('Data sent successfully','info');
				}
			});
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