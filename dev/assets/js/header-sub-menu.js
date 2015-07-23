if ($('.splash-container').css('display') == undefined ){
		var classID= $('#check-activator').attr('class');
		var newClassId = new Number();;
		newClassId = classID.slice(9);
		$("#header-menu li:nth-child("+newClassId+")").addClass("sub-menu-active");
		var src = $("#header-menu li:nth-child("+newClassId+") img ").attr("src");
		var path= $("#header-menu li:nth-child("+newClassId+") img ").attr("src").replace(/^(.*\/)[^\/]+$/, '$1');
		var fileNameIndex = src.lastIndexOf("/") + 1;
		var curfilename = src.substr(fileNameIndex);	
		var newFilename =curfilename.slice(0,-4);
		var newSrc = path+""+newFilename+"-over.png"; 
		$("#header-menu li:nth-child("+newClassId+") img ").attr("src",newSrc);
		
		
	}