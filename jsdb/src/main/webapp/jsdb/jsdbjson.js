//alert("jsdbjson.js - start");
GlobalsDB = new Array();
USER = { "user": [
					{ "userid":"user01","usernm":"홍길동","age":"22", "deptcd":"101", "sex":"2", "stat":"Y" },
					{ "userid":"user02","usernm":"강산에","age":"14", "deptcd":"101", "sex":"1", "stat":"N" },
					{ "userid":"user03","usernm":"김철수","age":"26", "deptcd":"101", "sex":"2", "stat":"Y" },
					{ "userid":"user04","usernm":"윤도현","age":"32", "deptcd":"102", "sex":"1", "stat":"N" },
					{ "userid":"user05","usernm":"김숙","age":"12", "deptcd":"102", "sex":"2", "stat":"Y" },
					{ "userid":"user06","usernm":"예원","age":"14", "deptcd":"102", "sex":"1", "stat":"N" },
					{ "userid":"user07","usernm":"싸이","age":"27", "deptcd":"101", "sex":"2", "stat":"Y" },
					{ "userid":"user08","usernm":"이완구","age":"42", "deptcd":"102", "sex":"1", "stat":"N" }

				]
			};

DEPT = { "dept" : [
					{ "deptcd":"101", "deptnm":"솔루션", "useYn":"Y" },
					{ "deptcd":"102", "deptnm":"SI사업부", "useYn":"N" }
				]
			};

SUN = { "header": [ 
		         {  "resultCode":"0000",  "resultMsg":"OK" } 
		       ]
		     ,
		      "items": [ 
		         { "LON":"128.9565111", "BASEDT":"20150127", "LAT":"37.7254", "SUNSETDE":"17:41:33", "SUNRISEDE":"07:32:41"  } , 
		         { "LON":"128.9565111", "BASEDT":"20150208", "LAT":"37.7254", "SUNSETDE":"17:54:54", "SUNRISEDE":"07:22:26"  } , 
		         { "LON":"128.9565111", "BASEDT":"20150209", "LAT":"37.7254", "SUNSETDE":"17:56:00", "SUNRISEDE":"07:21:25"  } , 
		         { "LON":"128.9565111", "BASEDT":"20150210", "LAT":"37.7254", "SUNSETDE":"17:57:06", "SUNRISEDE":"07:20:23"  } , 
		         { "LON":"128.9565111", "BASEDT":"20150227", "LAT":"37.7254", "SUNSETDE":"18:15:05", "SUNRISEDE":"06:59:39"  } , 
		         { "LON":"128.9565111", "BASEDT":"20150304", "LAT":"37.7254", "SUNSETDE":"18:20:06", "SUNRISEDE":"06:52:42"  } , 
		         { "LON":"128.9565111", "BASEDT":"20150326", "LAT":"37.7254", "SUNSETDE":"18:40:54", "SUNRISEDE":"06:19:55"  } , 
		         { "LON":"127.4236111", "BASEDT":"20150326", "LAT":"38.24701389", "SUNSETDE":"18:47:11", "SUNRISEDE":"06:25:54"  } , 
		         { "LON":"128.2210111", "BASEDT":"20150326", "LAT":"37.50943611", "SUNSETDE":"18:43:47", "SUNRISEDE":"06:22:55"  } , 
		         { "LON":"128.0646556", "BASEDT":"20150326", "LAT":"37.45658056", "SUNSETDE":"18:44:23", "SUNRISEDE":"06:23:33"  } 
		       ]
		};

GlobalsDB = [ 
              		{ "name":"USER","table":USER },
              		{ "name":"DEPT","table":DEPT },
              		{ "name":"SUN","table":SUN }
              	];

function getListGlobalsDB() {
	return GlobalsDB;
}

function findGlobalsDB(name) {
	//alert("name:"+name);
	var names = name.split(".");
	//alert("names:"+names);
	if(name.indexOf(".") > -1) {
		var gbDB = getListGlobalsDB();
		for(var i=0;i<gbDB.length;i++) {
			if( gbDB[i]["name"] == names[0] ) {
				return gbDB[i]["table"][names[1]];
			}
		}
	} else {
		var gbDB = getListGlobalsDB();
		for(var i=0;i<gbDB.length;i++) {
			if( gbDB[i]["name"] == name ) {
				return gbDB[i]["table"];
			}
		}
	}
	return null;
}

function addGlobalsDB(callName, result) {
	var idx = GlobalsDB.length;
	GlobalsDB[idx] = { "name":callName,"table":result };
	return GlobalsDB;
}

//alert("jsdbjson.js - end");