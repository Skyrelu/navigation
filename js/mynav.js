window.onload = function() {
	init();
	bindEvent();
};
var countItem;//定义全局变量 导航中的站点数目
function Site (url,name) {//定义站点对象的构造函数
	this.key = 0;//相当于索引初始化为0
	this.url = url;//网站链接
	this.name = name;//链接描述
	this.countclick = 0;//点击次数
	this.color = {r:219,g:226,b:234};//背景颜色
}
Site.prototype.startcolor = {r:219,g:226,b:234};//起始的背景颜色
Site.prototype.endcolor = {r:47,g:97,b:148};//最终的背景颜色
Site.prototype.getCurrentColor = function() {//计算当前背景颜色
	if(this.color.r>this.endcolor.r && this.color.g > this.endcolor.g && this.color.b > this.endcolor.b){
		this.color.r -= 4;
		this.color.g -= 3;
		this.color.b -= 2;
	}
};
function init () {//页面初始化
	if (!localStorage.getItem("countItem")) {//在第一次访问的时候将收藏站点的计数器初始化为0
		localStorage.setItem("countItem","0");
	}
	countItem = parseInt(localStorage.getItem("countItem"));//从本地存储中获取站点数目
	for (var i = 0; i < countItem ; i++) {//动态创建本地存储站点的html
		if (localStorage.getItem("item" + i)) {
			createHtml(JSON.parse( localStorage.getItem("item" + i)));
		}
		else continue;
	}
}
function createSiteObj (url,name) {//将对象存进本地存储
	var site = new Site(url,name);//创建站点对象实例
	site.key = countItem;//添加时将当前对象索引值设为当前数组长度(本地存储中的站点个数)
	countItem++;
	localStorage.setItem("countItem",countItem);//更新本地存储中的站点个数
	localStorage.setItem("item" + site.key , JSON.stringify(site));//将新创建的对象存进本地存储
	return countItem;//相当于数组长度
}
function createHtml (obj) {//为添加的站点创建html元素节点并加入原来的文档流,obj为待添加的Site对象
	var content = document.getElementById('content-site');
	var tagA = document.createElement("a");
	var hovermask = document.createElement("span");
	var iconpencil = document.createElement("span");
	var iconbin = document.createElement("span");
	var text = document.createElement("span");
	content.appendChild(tagA);
	tagA.appendChild(hovermask);
	tagA.appendChild(text);
	hovermask.appendChild(iconpencil);
	hovermask.appendChild(iconbin);
	text.innerHTML = obj.name;

	hovermask.setAttribute('class', "hover-mask");
	iconpencil.setAttribute('class', "icon-pencil");
	iconbin.setAttribute('class', "icon-bin");
	text.setAttribute('class', "text");
	

	tagA.setAttribute('href', obj.url);
	tagA.setAttribute('target', "_blank");
	tagA.setAttribute('key', obj.key);
	tagA.setAttribute('class',"normal");
	tagA.style.background = "rgba("+obj.color.r+","+obj.color.g+","+obj.color.b+",0.5)";
	
	
	tagA.onclick = function () {
		var key = this.getAttribute('key');
		var siteObj =JSON.parse( localStorage.getItem("item"+key) );
		var site = new Site(siteObj.url,siteObj.name);
		site.key = siteObj.key;
		site.countclick = siteObj.countclick + 1;
		site.color = siteObj.color;
		site.getCurrentColor();
		this.style.background = "rgba("+site.color.r+","+site.color.g+","+site.color.b+",0.5)";
		localStorage.setItem("item"+key,JSON.stringify(site));
	};
}
function editSiteObj (key,url,name) {
	var state = document.getElementById('state');
	if (localStorage.getItem("item"+key)) {
		var obj = JSON.parse(localStorage.getItem("item"+key));
		if (obj.url==url && obj.name==name) {	
			state.innerHTML = "未做任何改动！";
			return;
		} 
		else{
			obj.url = url;
			obj.name = name;
			localStorage.setItem("item"+key,JSON.stringify(obj));

			var domA = document.querySelector("a[key='"+key+"']");
			var text = domA.querySelector("span.text");
			domA.setAttribute("href",url);
			text.innerHTML = name;
			state.innerHTML = "修改成功！";
		}
		
	}
	else return;
}
function deleteSiteObj (key) {
	var state = document.getElementById('state');
	if (localStorage.getItem("item"+key)) {
		var content = document.getElementById('content-site');
		var domA = document.querySelector("a[key='"+key+"']");
		content.removeChild(domA);

		localStorage.removeItem("item"+key);
		for (var i = parseInt(key)+1; i < countItem; i++) {
			var obj = JSON.parse(localStorage.getItem("item"+i));
			if (obj) {
				obj.key = i-1;
				localStorage.setItem("item"+obj.key,JSON.stringify(obj));
			}
			var a = document.querySelector("a[key='"+i+"']");
			if(a){
				a.setAttribute('key', i-1);
			}
			
		}
		countItem--;
		localStorage.setItem("countItem",countItem);
		localStorage.removeItem("item"+countItem);
		state.innerHTML = "删除成功！";
	}
	else return;
}
function bindEvent () {//绑定按钮的事件
	addSiteEvent();
	editSiteStateEvent();
	editSiteEvent();
	deleteSiteEvent();
	closeBox();
}

function addSiteEvent () {
	var addSite = document.getElementById('btn-add');//添加站点的按钮
	addSite.onclick = function () {//将用户输入存进本地存储并动态创建html
		var inputUrl = document.getElementById('input-url');
		var inputName = document.getElementById('input-name');
		var url = inputUrl.value;
		var name = inputName.value;
		if (url && name) {
			var key = createSiteObj(url,name) - 1;
			if (key >= 0) {
				var localItem = JSON.parse( localStorage.getItem("item"+key) );
				createHtml(localItem);
				inputUrl.value = "";
				inputName.value = "";
			}
		}
		else return;
	};
}
function editSiteStateEvent () {
	var editSite = document.getElementById('btn-edit');
	var inputUrl = document.getElementById('input-url');
	var inputName = document.getElementById('input-name');
	var btnadd = document.getElementById('btn-add');
	var domAs = document.getElementsByTagName("a");
	var i = 0;
	editSite.onclick = function () {
		if (this.value==="修改") {
			this.value = "完成";
			inputUrl.setAttribute('class', "input-edit");
			inputUrl.setAttribute('readonly',"readonly");
			inputName.setAttribute('class', "input-edit");
			inputName.setAttribute('readonly',"readonly");
			btnadd.setAttribute('class', "input-edit");
			btnadd.setAttribute('readonly',"readonly");
			for (i = 0; i < domAs.length; i++) {
				domAs[i].setAttribute("class","edit");
				domAs[i].setAttribute('onclick', "return false;");
			}
		}
		else if (this.value==="完成") {
			this.value = "修改";
			inputUrl.removeAttribute('class');
			inputUrl.removeAttribute('readonly');
			inputName.removeAttribute('class');
			inputName.removeAttribute('readonly');
			btnadd.removeAttribute('class');
			btnadd.removeAttribute('readonly');
			for (i = 0; i < domAs.length; i++) {
				domAs[i].setAttribute("class","normal");
				domAs[i].removeAttribute('onclick');
			}
		}
		else{ return false;}
		
	};
}
function editSiteEvent () {
	var editBtns = $('.icon-pencil');
	var overlay = $('.overlay');
	var dialog = $('#dialog-edit');
	var tips = $('.tips');
	var tipsBtn = $('#tips-confirm-btn');
	var inputUrl = $('#edit-input-url');
	var inputName = $('#edit-input-name');
	var confirm = $('#edit-confirm-btn');
	var key;
	editBtns.click(function () {
		var a = $(this).parents('a');
		key = a.attr('key');
		overlay.addClass('show');
		dialog.addClass('dialog-show');
		tips.addClass('tips-show');
		inputUrl.val(a.attr('href'));
		inputName.val(a.find('span.text').text());
	});
	confirm.click(function () {
		editSiteObj (key,inputUrl.val(),inputName.val());
		dialog.addClass('dialog-rotate');
		tips.addClass('tips-rotate');
	});
	tipsBtn.click(function () {
		overlay.removeClass('show');
		tips.removeClass('tips-show');
		tips.removeClass('tips-rotate');
		dialog.removeClass('dialog-show');
		dialog.removeClass('dialog-rotate');
	});
}
function closeBox () {
	var close = $('.icon-cross');
	var cancel = $('#delete-cancel-btn');
	var closefun = function(){
		var overlay = $('.overlay');
		var dialog = $(this).parents('.dialog');
		overlay.removeClass('show');
		dialog.removeClass('dialog-show');
	};
	close.click(closefun);
	cancel.click(closefun);
}
function deleteSiteEvent () {
	var dialog = $('#dialog-delete');
	var overlay = $('.overlay');
	var deleteBtns = $('.icon-bin');
	var tips = $('.tips');
	var tipsBtn = $('#tips-confirm-btn');
	var confirm = $('#delete-confirm-btn');
	var siteName = $('span#siteName');
	var key;
	deleteBtns.click(function () {
		var a = $(this).parents('a');
		key = a.attr('key');
		overlay.addClass('show');
		dialog.addClass('dialog-show');
		tips.addClass('tips-show');
		siteName.text("【"+a.find('span.text').text()+"】");
	});
	confirm.click(function () {
		if (key) {
			deleteSiteObj(key);
			dialog.addClass('dialog-rotate');
			tips.addClass('tips-rotate');
		} 
		else{

		}
	});
	tipsBtn.click(function () {
		overlay.removeClass('show');
		tips.removeClass('tips-show');
		tips.removeClass('tips-rotate');
		dialog.removeClass('dialog-show');
		dialog.removeClass('dialog-rotate');
	});
}
function setmemory() {
	countItem = parseInt(localStorage.getItem("countItem"));//从本地存储中获取站点数目
	function reduceAfter(i) {
		for (var j = i+1; j <countItem; j++) {
			if (localStorage.getItem("item" + j)) {
				var obj = JSON.parse(localStorage.getItem("item"+j));
				obj.key = j-1;
				localStorage.setItem("item"+obj.key,JSON.stringify(obj));
			}
			else continue;
		}
	}
	function find (i) {
		if (localStorage.getItem("item" + i)) {
			return true;
		} 
		else{
			return false;
		}
	}
	
	for (var i = 0; i < countItem ; i++) {
		while(!find(i)) {
			reduceAfter(i);
		}
	}
}