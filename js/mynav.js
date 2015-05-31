window.onload = function() {
	if (!localStorage.getItem("countItem")) {//在第一次访问的时候将收藏站点的计数器初始化为0
		localStorage.setItem("countItem","0");
	}
	var countItem = parseInt(localStorage.getItem("countItem"));//从本地存储中获取站点数目
	for (var i = 0; i < countItem ; i++) {//动态创建本地存储站点的html
		createHtml(JSON.parse( localStorage.getItem("item" + i)));
	}

	var addSite = document.getElementById('btn-add');//添加站点的按钮

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
		if(this.color.r>this.endcolor.r && this.color.g > this.endcolor.g && this.color.b < this.endcolor.b){
			this.color.r += this.countclick*4;
			this.color.g += this.countclick*3;
			this.color.b += this.countclick*2;
		}
	};

	function createSiteObj (url,name) {//将对象存进本地存储
		var site = new Site(url,name);//创建站点对象实例
		site.key = countItem;//添加时将当前对象索引值设为当前数组长度(本地存储中的站点个数)
		countItem++;
		localStorage.setItem("countItem",countItem);//更新本地存储中的站点个数
		localStorage.setItem("item" + site.key , JSON.stringify(site));//将新创建的对象存进本地存储
		return countItem;//相当于数组长度
	}
	function createHtml (obj) {//为添加的站点创建html元素节点并加入原来的文档流,obj为待添加的Site对象
		var body = document.getElementsByTagName('body')[0];
		var tagA = document.createElement("a");
		tagA.setAttribute('href', obj.url);
		tagA.setAttribute('target', "_blank");
		tagA.innerHTML = obj.name;
		body.appendChild(tagA);
	}

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
			}
		}
		else return;
	};
};
