console.log("jsdbtool.js - start");

//alias 제거 후 컬럼
function getCleanColnm(colnm) {
	//D.deptcd
	var cleanColnm = colnm.split(".")[1].trim();
	return cleanColnm;
}
//조인 컬럼
function getJoinColnm(join) {
	//"U.deptcd = D.deptcd"
	var joinColnm = join.split("=")[0].split(".")[1].trim();
	return joinColnm;
}
//Map 출력
function toKeyArrayPrint(map) {
	var printKeyArrStr = "\n";
	for( var item in map ) {
		printKeyArrStr += item + "=" + map[item]+"\n";
	}
	//alert("Map 출력 : "+printKeyArrStr);
}

//쿼리 결과 출력
function getPrintData(r, printColnmMap) {
	var result = "";
	
	result += "\nResult Count : "+r.length + " Rows";
	result += "\n------------------------------------------------------------";
	
	result += "\n";
	for ( var item in r[0]) {
		if( printColnmMap[item] != null && printColnmMap[item] != "") {
			result += "\t";
			result += item;
		}
	}

	result += "\n------------------------------------------------------------";
	result += "\n";

	for(var i=0;i<r.length;i++) {
		for ( var item in r[i]) {
			if( printColnmMap[item] != null && printColnmMap[item] != "") {
				result += "\t" + r[i][item];
			}
		}
		result += "\n";
	}
	return result;
}

//Json Table Object 로 변환
function getJsonTableObject(tblNm) {
	var jsonTableObj = null;

	if(tblNm.indexOf(".") == -1) {
		//ex) USER => USER.user;
		tblNm = tblNm.toUpperCase()+"."+tblNm.toLowerCase();
	}
	
	jsonTableObj = findGlobalsDB(tblNm);

	return jsonTableObj;
}

//Json Table Legacy Object 로 변환
function getJsonLegacyTableObject(tblNm) {
	var jsonTableObj = null;

	jsonTableObj = findGlobalsDB(tblNm);

	return jsonTableObj;
}

//Json Data를 표로 출력
function getDataView(tblNm) {
	tblNm = tblNm.trim();
	var map = null;
	
	map = getJsonLegacyTableObject(tblNm);
	console.log("getJsonLegacyTableObject - map : "+map);
	
	if(map == null) {
		return tblNm + " is <font color='red'>InValid.</font><br/>";
	}

	var printKeyArrStr = "";
	
	var startTable ="<table border='1'>";
	var endTable ="</table>";
	printKeyArrStr += startTable;

	var idx=0;
	for( var item in map ) {
		if(typeof(map[item]) == "object" ) {
			if(idx == 0) {
				printKeyArrStr += getDataViewMeta(map[item]);
			}
			printKeyArrStr += getDataViewSubMap(map[item]);
		} else {
			//printKeyArrStr += "★ Data is Nothing"+"{"+typeof(map[item])+"}"+map[item];
			printKeyArrStr += "<tr>";
			printKeyArrStr += "<td>";
			printKeyArrStr += item;
			printKeyArrStr += "</td>";
			printKeyArrStr += "<td>";
			printKeyArrStr += map[item];
			printKeyArrStr += "</td>";
			printKeyArrStr += "</tr>";
		}
		idx++;
	}
	//단건 숫자의 경우임
	if(idx==0) {
		printKeyArrStr += "<tr>";
		printKeyArrStr += "<td>";
		printKeyArrStr += map;
		printKeyArrStr += "</td>";
		printKeyArrStr += "</tr>";
	}
	
	printKeyArrStr += endTable;
	
	return printKeyArrStr;
}

//RowMeta
function getDataViewMeta(map) {
	var printKeyArrStr = "";
	printKeyArrStr += "<tr>";
	
	var keys = Object.keys(map); 
	
	for( var i=0; i < keys.length; i++ ) {
		printKeyArrStr += "<th>";
			printKeyArrStr +=keys[i];
		printKeyArrStr += "</th>";
	}
	printKeyArrStr += "</tr>";
	return printKeyArrStr;
}

//Row
function getDataViewSubMap(map) {
	var printKeyArrStr = "";
	printKeyArrStr += "<tr>";
	for( var item in map ) {
		printKeyArrStr += "<td>";
		if(typeof(map[item]) == "object" ) {
			printKeyArrStr += getDataViewSubMap(map[item]);
		} else {
			printKeyArrStr += map[item];
		}
		printKeyArrStr += "</td>";
	}
	printKeyArrStr += "</tr>";
	return printKeyArrStr;
}


console.log("jsdbtool.js - end");