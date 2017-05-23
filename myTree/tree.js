function Tree(treeContainer){
	this.container=treeContainer;
	this.createTree=function(str){
			for(var i in str){
				this.fetchData(str,this.container,1,1,this.countJSONEKey(str),true);
			}
			
			
	}
	
	/**
	* json 某层的父节点机器下子节点的json
	* obj 父div的dom对象
	* nodeno 第几层的节点 1表示root节点 默认传1
	* whiteSpace 前面的空白图片数  主要针对二级节点是最后一个节点，且有子节点，子节点前面显示的空白图片数
	* curValLen 当前json对象的key对应的value的值数组长度 -1为最后一个数组元素的位置
	* parentNodeIsLast 父节点是否是最后一个节点
	*/
	this.fetchData=function(json,obj,nodeno,whiteSpace,curValLen,parentNodeIsLast){
		//var regexp= /^[0-9]*$/;
		var nodeth="node"+nodeno;
		var loopPlus=0;
		var white = whiteSpace;
		var contextLoop = 0;
		var lastLoop = 0;
		for(var data in json){
			var isLast=false;
			if(loopPlus+1 ==curValLen){
				isLast=true;
			}
			if(typeof(json[data]) != "string"){ // 如果key对应的value不是一个string类型，则说明有子节点
					contextLoop ++;
					var divObj = document.createElement("DIV");   //生成一个div
					divObj.id=nodeth+"_context"+contextLoop;
					if(nodeno==1){
						divObj.style.display="block";  //初始化默认除一级节点外都不显示
					}else{
						divObj.style.display="none";
					}
					this.appendImg(divObj,nodeno-1,white,parentNodeIsLast,true,isLast);//添加每个节点前的连接线
					//var d = data;
					//var flag = regexp.test(data);
					var aObj = document.createElement("A");
					aObj.href="javascript:;";
					aObj.setAttribute("onclick","expandOrClose(this)");
					var imgObj = document.createElement("IMG");
					if(nodeno == 1){
						imgObj.src="./imgs/line_plusone.gif";
					}else{
						if(loopPlus+1 == curValLen){
							imgObj.src="./imgs/line_plusbottom.gif";
						}else{
							imgObj.src="./imgs/line_plus.gif";
						}
					}
					aObj.appendChild(imgObj);
					divObj.appendChild(aObj);
					var chkbox=document.createElement("INPUT");
					chkbox.type="checkbox";
					chkbox.setAttribute("onclick","checkedOrUncheck(this)");
					divObj.appendChild(chkbox);
					var txtNode = document.createTextNode(data);
					divObj.appendChild(txtNode);
					obj.appendChild(divObj);
					if(parentNodeIsLast&&isLast&&nodeno!=1){
						white ++;
					}
					if(parentNodeIsLast&&isLast&&nodeno==2){  //二级节点是最后一个时，空白图片数要+2才行
						white+=2;  
					}
					this.fetchData(json[data],divObj,nodeno+1,white,this.countJSONEKey(json[data]),isLast);
					//white--;
			}else{
				//alert(data);
				//alert(json[data]);
				lastLoop ++;
				var divObj= document.createElement("DIV");
				divObj.style.display="none";
				divObj.id=nodeth+"_last"+lastLoop;
				this.appendImg(divObj,nodeno-1,white,parentNodeIsLast,false,isLast);//添加每个节点前的连接线
				var imgObj = document.createElement("IMG");
				if(loopPlus+1 == curValLen){
					imgObj.src = "./imgs/joinbottom.gif";
				}else{
					imgObj.src = "./imgs/join.gif";
				}
				divObj.appendChild(imgObj);
				var chkbox=document.createElement("INPUT");
				chkbox.type="checkbox";
				chkbox.setAttribute("onclick","checkedOrUncheck(this)");
				divObj.appendChild(chkbox);
				var txtNode = document.createTextNode(data);
				divObj.appendChild(txtNode);
				obj.appendChild(divObj);
			}
			loopPlus++;
		}
	}
	
	/**
	* parentObj 父节点的dom对象
	* lvl 层数  表明是第几层节点如果第三层节点需要两个img标签 lvl的值必须为当前节点的层数-1
	* parentNodeIsLast 如果parentObj是 同级节点中的最后一个 那么此层节点的连线开始处应该有=层数个空白图片
	* whiteSpace 前面应该有几个空白图片 实际使用时应该 -1 ，因为排除第二层节点是最后一个节点的情况下，其他的节点层数-1应该是前面空白图片数
	* hasChildren 是否有子节点
	* isLast 是否是最后一个节点
	*/ 
	this.appendImg=function (parentObj,lvl,whiteSpace,parentNodeIsLast,hasChildren,isLast){
			for(var i=1;i<=lvl;i++){
				var imgObj=document.createElement("img");
				if(whiteSpace > 1){  //如果whiteSpace大于1 则表明此节点属于第二层最后一个节点下的子节点
					if(parentNodeIsLast && hasChildren){ //第二层最后一个节点下每层的最后一个含有子节点的节点
						if(i<whiteSpace){
							imgObj.src="./imgs/empty.gif";
						}
					}else if(!parentNodeIsLast && i<whiteSpace-1){  //第二层最后一个子节点下的节点如果父节点不是父层最后一个节点并且
						imgObj.src="./imgs/empty.gif";
					}else if(parentNodeIsLast && !hasChildren){  //第二层下 父节点是最后一个 当前节点又没有子节点
						if(i<whiteSpace-1 || i==lvl){
							imgObj.src="./imgs/empty.gif";
						}else{
							imgObj.src="./imgs/line.gif";
						}
						
					}else{  
						imgObj.src="./imgs/line.gif";
					}
					
				}else{
					if(parentNodeIsLast && !hasChildren){  // 其他情况下 父节点是最后一个当前节点又没有子节点 前面少个线
						if(i==1 || i==lvl){
							imgObj.src="./imgs/empty.gif";
						}else{
							imgObj.src="./imgs/line.gif";
						}
					}else{
						if(i==1){
							imgObj.src="./imgs/empty.gif";
						}else{
							imgObj.src="./imgs/line.gif";
						}
					}
				}
				
				
				parentObj.appendChild(imgObj);
			}		
	}
	/**
	* 计算当前json对象有多少key
	*/
	this.countJSONEKey=function(json){
		var count = 0;
		for(var i in json){
			count++;
		}
		return count;
	}
	
}


function $(str){
	return document.getElementById(str);
}

/**
* 点击 + 号和 -号时的展开收起操作  直接使子节点的div不显示即可 display:none
*/
function expandOrClose(obj){
	var img = obj.children[0];
	var imgSrc = img.src;
	var imgName = imgSrc.substr(imgSrc.indexOf("line"));
	var newIcon = switchPlusMinusIcon(imgName);
	img.src=newIcon;
	var parentObj = obj.parentNode;
	var kids = parentObj.children;
	for (var i = 0; i < kids.length; i++) {
		if(kids[i].tagName == "DIV"){
			var attrs = kids[i].attributes;
			var attr = attrs.getNamedItem("id");
			var val = attr.value;
			//console.log(val.indexOf("context")>0);
			var style = kids[i].style;
			if(style.display == "none"){
				style.display = "block";
			}else{
				style.display = "none";
			} 
			
		}
	}

}

function checkedOrUncheck(obj){
	var parentObj = obj.parentNode;
	var gradObj = parentObj.parentNode;
	var childNodeList = parentObj.children;
	var isLastNode = true;
	for(var i=0;i<childNodeList.length;i++){
		if(childNodeList[i].tagName == "DIV"){
			isLastNode = false;
			break;
		}
	}
	var childNodeList = parentObj.querySelectorAll("input");
	//alert(childNodeList);
	if(obj.checked == true){
		forwardRecursive(obj);
		for (var i = 0; i < childNodeList.length; i++) {
			childNodeList[i].checked=true;	
		}
	}else{
		for (var i = 0; i < childNodeList.length; i++) {
			childNodeList[i].checked=false;	
		}
		forwardRecursive(obj);
	}
}

/**
* 既不是第一层也不是最后一层的复选框 需要向前递归选中 或 反选
* obj 当前需要操作的复选框对象
*/
function forwardRecursive(obj){
	var active = obj.checked;
	var parentObj = obj.parentNode;
	var gradObj = parentObj.parentNode;
	if(gradObj.id=="container"){
		return ;
	}
	var ckinput = gradObj.querySelector("input");
	if(active){
		if(!ckinput.checked){ //如果上层的复选框未被选中 表明需要迭代向上选中
			ckinput.checked=true;
			forwardRecursive(ckinput);
		}
	}else{
		var checkboxs = gradObj.querySelectorAll("input"); // 父层节点中所有checkbox
		var isAvailiableUnchecked = true;
		for (var i = 1; i < checkboxs.length; i++) {
			var res = checkboxs[i].checked;
			if( res){
				isAvailiableUnchecked = false;  //如果父层节点下还有复选框被选中 则此父节点不能被反选
				break;   
			}
			
		}
		if(isAvailiableUnchecked){ //可以被反选 继续向上迭代
			ckinput.checked=false;
			forwardRecursive(ckinput);
		}
	}
}


function switchPlusMinusIcon(iconName){
	var suffix = iconName.substring(iconName.indexOf("_")+1,iconName.lastIndexOf("."));
	var flag = iconName.indexOf("plus")>0 ? true : false;
	var  to =null;
	if(flag){
		switch(suffix){
			case "plus": to="minus";break;
			case "plusone":to="minusone";break;
			case "plusbottom":to="minusbottom";break;
		}
	}else{
		switch(suffix){
			case "minus": to="plus";break;
			case "minusone":to="plusone";break;
			case "minusbottom":to="plusbottom";break;
		}
	}
	return "./imgs/line_"+to+".gif";
}