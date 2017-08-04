console.log("jsdbngin.js - start");

function parsing(q) {
	var result = "";

	q = q.replace(/\n/gi, "");
	
	//select U.userid, U.usernm, U.deptcd, D.deptnm, U.age, D.useYn, U.sex from USER U inner join DEPT D on(U.deptcd = D.deptcd) where U.sex='M' and D.deptnm like '%솔루션%';
//	var printColnmStr = "U.userid, U.usernm, U.deptcd, D.deptnm";
	var printColnmStr =  getQueryCols(q);
	console.log("printColnmStr : "+printColnmStr);
	
	var printColnmMap = getPrintColnm(printColnmStr);
	//toKeyArrayPrint(printColnmMap);

//	var tableStr = "USER U inner join DEPT D";
	var tableStr = getQueryTables(q);
	console.log("tableStr : "+tableStr);

	var tableArr = getTables(tableStr);
	console.log("tableArr : "+tableArr);
	
	//var A = USER.user;
	//var B = DEPT.dept;
	var A = getJsonTableObject(tableArr[0][0]);
	var B = null;
	if(tableArr[1][0] != null) {
		B = getJsonTableObject(tableArr[1][0]);
	}
	console.log("A : "+A);
	console.log("B : "+B);
	
//	var join = "U.deptcd = D.deptcd";
	var join = null;
	var joinColnm = null;
	var joinType = "inner join"
	
	if(B != null) {
		join = getQueryJoin(q);
		joinColnm = getJoinColnm(join);
		//	alert("joinColnm : "+joinColnm);
	}
	console.log("join : "+join);

//	var condition = "D.deptnm like '%솔루션%'";
	var condition = getQueryLike(q);
	//alert("condition : "+condition);
	
	var where = getWhereColnm(condition);
	//alert("where : "+where);

	result = execute(A, B, printColnmMap, joinType, joinColnm, where);
	
	return result;
}

//실행
function execute(A, B, printColnmMap, joinType, joinColnm, where) {
	var result = "";
	//alert("A:"+A);
	var MA = getDataSet(A, B, joinColnm);
	//alert("MA:"+MA);
	var RMA = whereQuery(MA, where);
	//alert("RMA:"+RMA);
	result = getPrintData(RMA, printColnmMap);
	
	console.log('execute - result : \n'+ result);
	return result; 
}

//집합 생성
function getDataSet(A, B, joinColNm) {
	var MA = A;
	var SB = B;
	if(joinColNm != null) {
		//USER.deptcd = DEPT.deptcd
		for(var i=0;i<MA.length;i++) {
			for(var s=0;s<SB.length;s++) {
				if( eval("MA[i]."+joinColNm) == eval("SB[s]."+joinColNm) ) {
					for ( var item in SB[s]) {
						if(item != joinColNm) {
							MA[i][item]=SB[s][item];
						}
					}
				}
			}
		}
	}
	return MA;
}

//where 조건 메인
function whereQuery(MA, where ) {
	var WR = MA;
	if(where != null) {
		for( var i=0; i < where.length; i++ ) {
			if( where[i][0].indexOf('like') > -1) {
				WR = likeQuery(WR, where[i][1], where[i][2], where[i][3] );
			}
			if( where[i][0].indexOf('compare') > -1) {
				WR = compareQuery(WR, where[i][1], where[i][2], where[i][3] );
			}
		}
	}
	return WR;
}

//비교조건 적용
function compareQuery(MA, cmpColnm, wType, cmpVal ) {
	var RMA = new Array();
	var incre=0;
	
	cmpColnm = getCleanColnm(cmpColnm);
	cmpVal = parseInt(cmpVal);
	
	console.log("cmpColnm : "+cmpColnm+", wType : "+wType+", cmpVal : "+cmpVal);
	
	for(var i=0;i<MA.length;i++) {
		if( wType == "=") {
			if(eval("MA[i]."+cmpColnm) == cmpVal ) {
				RMA[incre++] = MA[i];
			}
		}
		
		if( wType == ">") {
			if(eval("MA[i]."+cmpColnm) > cmpVal ) {
				RMA[incre++] = MA[i];
			}
		}
		
		if( wType == "<") {
			if(eval("MA[i]."+cmpColnm) < cmpVal ) {
				RMA[incre++] = MA[i];
			}
		}
		
		if( wType == ">=") {
			if(eval("MA[i]."+cmpColnm) >= cmpVal ) {
				RMA[incre++] = MA[i];
			}
		}
		
		if( wType == "<=") {
			if(eval("MA[i]."+cmpColnm) <= cmpVal ) {
				RMA[incre++] = MA[i];
			}
		}
		
	}
	return RMA; 
}

//LIKE 조건 적용 	//DEPT.deptnm like '%솔루션%'
function likeQuery(MA, likeColnm, wType, likeVal ) {
	
	likeColnm = getCleanColnm(likeColnm);
	console.log("likeColnm : "+likeColnm+", wType : "+wType+", likeVal : "+likeVal);
	
	var RMA = new Array();
	var incre=0;

	if( likeVal == null || likeVal == "") {
		return MA;
	}
	for(var i=0;i<MA.length;i++) {
		if(eval("MA[i]."+likeColnm+".indexOf('"+likeVal+"')") > -1 ) {
			RMA[incre++] = MA[i];
		}
	}
	return RMA; 
}

//Query Cols
function getQueryCols(q) {
	return q.substring(q.indexOf("select")+"select".length, q.indexOf("from") );
}

//Tables
function getQueryTables(q) {
	if(q.indexOf(" on(") != -1) {
		return q.substring(q.indexOf("from")+"from".length, q.indexOf(" on(") );
	} else if(q.indexOf("where") != -1) {
		return q.substring(q.indexOf("from")+"from".length, q.indexOf(" where") );
	} else {
		return q.substring(q.indexOf("from")+"from".length );
	}
}

//Join
function getQueryJoin(q) {
	return q.substring(q.indexOf(" on(")+" on(".length, q.indexOf(")") );
}

//like
function getQueryLike(q) {
	if(q.indexOf("where") == -1) {
		return null;
	} else {
		if(q.indexOf(";") > -1) {
			return q.substring(q.indexOf("where")+"where".length, q.indexOf(";") );
		} else {
			return q.substring(q.indexOf("where")+"where".length);
		}
	}
}


//출력 컬럼
function getPrintColnm(printColnmStr) {
	//U.userid, U.usernm, U.deptcd, D.deptnm
	var printColArr = new Array();
	var colArr = printColnmStr.trim().split(",");
	console.log("colArr : "+ colArr);
	
	for( var i=0; i < colArr.length; i++ ) {
		//["userid"]=U ,,,
		console.log(colArr[i].trim().split(".")[1].trim() + " / "+colArr[i].trim().split(".")[0].trim());
		printColArr[colArr[i].trim().split(".")[1].trim()]=colArr[i].trim().split(".")[0].trim();
	}
	return printColArr;
}

//테이블
function getTables(tables) {
	//"USER U inner join DEPT D"
	var JOIN = "join"
	var MA = tables.split(JOIN)[0].trim().split(" ")[0].trim();
	var MAalias = tables.split(JOIN)[0].trim().split(" ")[1].trim();
	
	var SB = null;
	var SBalias = null;
	
	if(tables.split(JOIN).length > 1) {
		SB = tables.split(JOIN)[1].trim().split(" ")[0].trim();
		SBalias = tables.split(JOIN)[1].trim().split(" ")[1].trim();
	}
	return [ [MA, MAalias], [SB, SBalias] ];
}

//where 조건타입, 컬럼, 조건기호, 값  [ "compare", eachs[0].trim(), ">=", eachs[1].trim() ]
function getWhereColnm(condition) {
	//U.sex='M' and D.deptnm like '%솔루션%';
	var whereArr = new Array();
	if(condition == null) {
		return null;
	}
	var eachArr = condition.split("and");
	var incre =0;
	for( var i=0; i < eachArr.length; i++ ) {
		 if( eachArr[i].indexOf(" like ") > -1 ) {
				var eachs = eachArr[i].split("like");
				var likeVal = eachs[1].trim();
				var cleanLikeVal = likeVal.replace(/\'/gi, "").replace(/\%/gi, "");
				
				if(likeVal.indexOf('%')==1 && likeVal.lastIndexOf('%') > 1) {
					whereArr[incre] = [ "like", eachs[0].trim(), "like_full", cleanLikeVal ];
					incre++
				} else if(likeVal.indexOf('%')==1) {
					whereArr[incre] = [ "like", eachs[0].trim(), "like_pre", cleanLikeVal ];
					incre++
				} else if(likeVal.lastIndexOf('%') > 1) {
					whereArr[incre] = [ "like", eachs[0].trim(), "like_last", cleanLikeVal ];
					incre++
				} 
		} else if( eachArr[i].indexOf(">=") > -1 ) {
			var eachs = eachArr[i].split(">=");
			whereArr[incre] = [ "compare", eachs[0].trim(), ">=", eachs[1].trim().replace(/\'/gi, "") ];
			incre++
		} else if( eachArr[i].indexOf("<=") > -1 ) {
			var eachs = eachArr[i].split("<=");
			whereArr[incre] = [ "compare", eachs[0].trim(), "<=", eachs[1].trim().replace(/\'/gi, "") ];
			incre++
		} else if( eachArr[i].indexOf("=") > -1 ) {
			var eachs = eachArr[i].split("=");
			console.log(" eachs : "+eachs)
			whereArr[incre] = [ "compare", eachs[0].trim(), "=", eachs[1].trim().replace(/\'/gi, "") ];
			incre++
		} else if( eachArr[i].indexOf(">") > -1 ) {
			var eachs = eachArr[i].split(">");
			whereArr[incre] = [ "compare", eachs[0].trim(), ">", eachs[1].trim().replace(/\'/gi, "") ];
			incre++
		} else if( eachArr[i].indexOf("<") > -1 ) {
			var eachs = eachArr[i].split("<");
			whereArr[incre] = [ "compare", eachs[0].trim(), "<", eachs[1].trim().replace(/\'/gi, "") ];
			incre++
		}
	}
	return whereArr;
}


console.log("jsdbngin.js - end");
