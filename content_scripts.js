window.onload = function()
{
	var ENABLEPASSCTL = 'EnablePassCtl';
	var ENABLESHARECTL = 'EnableShareCtl';

//////////////////////////  start 拖拽框架   ///////////////////////////////////////
	function ooDrag(obj)
	{	
		var _this = this;
		this.oDiv = obj;
		this.disX = null;
		this.disY = null;
		
		this.oDiv.onmousedown = function(e){
				 _this.fnDown(e);
				 return false;
		};
	};
	ooDrag.prototype = {
		fnDown:function(e){
				  var _this = this;
				  var ev = e || window.event; 
				  
				  this.disX = ev.clientX - this.oDiv.offsetLeft;
				  this.disY = ev.clientY - this.oDiv.offsetTop;
				  
				  if(this.oDiv.setCapture) {
					    this.oDiv.setCapture();
						this.oDiv.onmousemove = function(e){
							_this.fnMove(e);
						};
						this.oDiv.onmouseup=function(){
							_this.fnUp();
						    _this.oDiv.releaseCapture();
						    _this.oDiv.onmousemove = null;
						    _this.oDiv.onmouseup = null;
						}; 
				  }else{
						document.onmousemove = function(e){
						    _this.fnMove(e);
						};
						document.onmouseup = function(){
							_this.fnUp();
					    };
				};}
		,fnMove:function(e){
				  var ev = e || window.event;
				  this.oDiv.style.left = ev.clientX - this.disX+'px';
				  this.oDiv.style.top = ev.clientY - this.disY+'px';
		}
		,fnUp:function(){
				  document.onmousemove = null;
				  document.onmouseup = null;
		}
	};

	function ooLimitDrag(obj,oParent){
		this.oParent = oParent || document;
		ooDrag.call(this,obj);
	}
	for(var i in ooDrag.prototype){
	    ooLimitDrag.prototype[i] = ooDrag.prototype[i];
	}
	ooLimitDrag.prototype.fnMove = function(e){
		var ev = e || window.event;
							 
		var l = ev.clientX - this.disX;
		var t = ev.clientY - this.disY;
		
		if(l<10){
			l = 0;
		}else if(l>this.oParent.clientWidth - this.oDiv.offsetWidth - 10){
			l = this.oParent.clientWidth - this.oDiv.offsetWidth;
		};
		if(t<10){
			t = 0;
		}else if(t>this.oParent.clientHeight - this.oDiv.offsetHeight - 10){
			t = this.oParent.clientHeight - this.oDiv.offsetHeight;
		};
		
		this.oDiv.style.left = l + 'px';
		this.oDiv.style.top = t + 'px';
	}
//////////////////////////  end 拖拽框架   ///////////////////////////////////////

	if ( !chrome.runtime )
		chrome.runtime = chrome.extension;
	chrome.runtime.sendMessage({greeting: ENABLEPASSCTL}, function(response) {
   		if ( String('true') == response.farewell )
   		{
   			var bDragImg = false;
   			var bHidden = true;

   			/// 弹出 div
   			var oContentDiv = document.createElement("div");
			oContentDiv.setAttribute("id", "ContentDiv");
			oContentDiv.style.position = "fixed";
			oContentDiv.style.width = "220px";
			oContentDiv.style.height = "90px";
			oContentDiv.style.right = "-200px";
			oContentDiv.style.bottom = "0px";
			oContentDiv.style.border = "1px solid gray";
			oContentDiv.style.fontSize = "14px";
			oContentDiv.style.zIndex = "99999";
			oContentDiv.style.background = "#E7E7E7";
			oContentDiv.style.color = "blue";
			oContentDiv.style.opacity = "0.8";
			oContentDiv.style.overflow = "hidden";
			oContentDiv.style.cursor = "move";
			new ooLimitDrag(oContentDiv, document || document.body);
			document.getElementsByTagName("body")[0].appendChild(oContentDiv);

			// 左面div容器
			var oLeftDiv = document.createElement("div");
			oLeftDiv.style.width = "20px";
			oLeftDiv.style.height = "90px";
			oLeftDiv.style.float = "left";
			oLeftDiv.style.cursor = "hand";
			oLeftDiv.style.cursor = "pointer";
			oContentDiv.appendChild(oLeftDiv);

			// 回到顶部
			var oGoToTopDiv = document.createElement("div");
			oGoToTopDiv.setAttribute("id", "GoToTopDiv");
			oGoToTopDiv.title = "Scroll To Top";
			oGoToTopDiv.style.width = "20px";
			oGoToTopDiv.style.height = "45px";
			oGoToTopDiv.style.float = "left";
			oGoToTopDiv.style.background = "url(" + chrome.runtime.getURL('res/pic.png') + ") 0px 0px";
			oGoToTopDiv.onclick = function()
			{
				window.scrollTo('0','0');
			}
			oLeftDiv.appendChild(oGoToTopDiv);
		
			// 展开
			var oShowDiv = document.createElement("div");
			oShowDiv.setAttribute("id", "ShowDiv");
			oShowDiv.style.width = "20px";
			oShowDiv.style.height = "45px";
			oShowDiv.style.float = "left";
			oShowDiv.style.background = "url(" + chrome.runtime.getURL('res/pic.png') + ") 0px -90px"; 
			oShowDiv.onclick = function()
			{
				var oTop = document.getElementById("ContentDiv");

				if ( bHidden )
				{
					oContentDiv.style.left = document.documentElement.clientWidth - 222 + "px";
					oShowDiv.style.background = "url(" + chrome.runtime.getURL('res/pic.png') + ") 0px -180px"; 
				}
				else
				{
					oContentDiv.style.left = document.documentElement.clientWidth - 21 + "px";
					oShowDiv.style.background = "url(" + chrome.runtime.getURL('res/pic.png') + ") 0px -90px"; 
				}

				oContentDiv.style.top = document.documentElement.clientHeight - 92 + "px";
				bHidden = !bHidden;
			}
			oLeftDiv.appendChild(oShowDiv);

			/// 图片
			var oImg = document.createElement("img");
			oImg.setAttribute("id", "ImgCurser");
			oImg.src = chrome.runtime.getURL("res/curser.png");
			oImg.style.float = "left";
			oImg.style.margin = "10px";
			oImg.style.cursor = "hand";
			oImg.style.cursor = "pointer";
			oImg.onmousedown = function(event)
			{
				var e = event || window.event;
				e.cancelBubble = true;

				bDragImg = true;
				this.src = chrome.runtime.getURL("res/curser1.png");
				this.style.clip = "rect(29px 31px 56px 0px)";
				document.body.style.cursor = "url(" + chrome.runtime.getURL('res/curser.cur') + "),auto"; 
			
				document.onmousemove = function(event)
				{
					if ( !bDragImg )
						return;

					event = event ? event : window.event; 
					var obj = event.srcElement ? event.srcElement : event.target;

					if ( "INPUT" == obj.nodeName)
						document.getElementById("InputPass").value = obj.value;
				};
				document.onmouseup = function(event)
				{
					if ( !bDragImg ) return;

					bDragImg = !bDragImg;
					document.body.style.cursor = "default";
					document.getElementById("ImgCurser").src = chrome.runtime.getURL("res/curser.png");
				};
			};
			oImg.ondragstart = function(){ return false; };
			oContentDiv.appendChild(oImg);

			// 提示信息
			var oLnkTitle = document.createElement("a");
			oLnkTitle.style.float = "left";
			oLnkTitle.style.color = "blue";
			oLnkTitle.style.fontWeight = "bold";
			oLnkTitle.style.textDecoration = "none";
			oLnkTitle.style.lineHeight = "52px";
			oLnkTitle.style.textAlign = "center";
			oLnkTitle.style.cursor = "default";
			oLnkTitle.href = "javascript: void(0);";
			oLnkTitle.innerText = "拖动靶心捕捉密码";
			oContentDiv.appendChild(oLnkTitle);

			var oSpan = document.createElement("span");
			oSpan.style.fontSize = "12px";
			oSpan.style.float = "left";
			oSpan.style.margin = "4px 0px 0px 6px";
			oContentDiv.appendChild(oSpan);

			var oLnkText = document.createElement("a");
			oLnkText.style.color = "black";
			oLnkText.style.fontWeight = "bold";
			oLnkText.style.textDecoration = "none";
			oLnkText.style.textAlign = "center";
			oLnkText.style.paddingRight = "4px";
			oLnkText.href = "javascript: alert('捕捉到的密码: ' + document.getElementById('InputPass').value);";
			oLnkText.innerText = "密码:";
			oSpan.appendChild(oLnkText);

			var oInput = document.createElement("input");
			oInput.setAttribute("id", "InputPass");
			oInput.style.width = "150px";
			oInput.style.padding = "1px";
			oInput.style.border = "1px solid black";
			oInput.onclick = function()
			{
				this.select();
			}
			oSpan.appendChild(oInput);

			// 单独密码搜索模块
		   	document.onkeydown = function(event)
			{
				var e = event || window.event || arguments.callee.caller.arguments[0];
				if ( e && event.ctrlKey && 73 == window.event.keyCode ) // Ctrl + i
			 	{
			 		var aInput = document.getElementsByTagName("input");
			 		if (0 == aInput.length)
			 			return;

					for (var i = 0, len = aInput.length, _this = null; i < len; i++)
					{
						_this = aInput[i];
						if ("text" == _this.type && (new RegExp(/username/gi)).test(aInput[i].name))
						{
							_this.setAttribute("style","font-weight:bold; color:yellow; background-color:gray");
							console.log("网址: " + decodeURIComponent(window.location.href));
							console.log("账号: " + _this.value);
						}
						if ("password" == _this.type)
						{
							console.log("密码: " + _this.value);
							_this.type = "text";
							_this.setAttribute("style","font-weight:bold; color:red; background-color:black");
							break;
						}
					}
			 	}
			}
   		} 
	});

	chrome.runtime.sendMessage({greeting: ENABLESHARECTL}, function(response) {
   		if ( String('true') == response.farewell )
   		{
   			var g_oBlogListLen = 0;
			var g_bLogin = false;

			(function(window){
				window.SinaBlogVideoShareTool = function(){};

				window.sbvt = function()
				{
					return new SinaBlogVideoShareTool();
				};
			})(window);

			SinaBlogVideoShareTool.prototype =
			{
				_init : function()
				{
					this.TYPE_TEXT = 3;
					this.TYPE_FORWARD = 4;
					this.TYPE_MEDIA = 5;

					this.IDX_INFO = 0;
					this.IDX_SOURCE_TIME = 1;
					this.IDX_TEXT = 2;
					this.IDX_FEED_EXPAND = 3;
				}
				,getBlogText : function(oBlog, iIndex)
				{
					var oWB_text = oBlog.children[iIndex];
					var tempStr = "";
					for (var z = 0, k = oWB_text.childNodes.length; z < k; z++)
					{
						var temp = oWB_text.childNodes[z];

						if( "A" == temp.nodeName && "a_topic" == temp.class ) //# 超链接a节点 去除话题
							tempStr += temp.children[0].getAttribute("title");
						else if ( "IMG" == temp.nodeName) //# 图片img节点
							tempStr += temp.title;
						else if ( "#text" == temp.nodeName ) //# 文本节点
							tempStr+= temp.nodeValue;
					}

					return tempStr.replace(/#(\S*)#|L微博视频|L秒拍视频|O秒拍视频|O网页链接|@/g, "");
				}
				,getBlogPicSource : function(oBlog, iIndex)
				{
					var sTemp = "";
					var iPicLenth = oBlog.children[iIndex].getElementsByTagName("img").length;
					for (var i = 0, j = iPicLenth; i < j; i++)
					{
						if ( i != 0 )
							sTemp += "||";

						var oldSrc = oBlog.children[iIndex].getElementsByTagName("img")[i].getAttribute("src");
						var idx = oldSrc.indexOf("/", 22);
						var newStr = oldSrc.substr(0, 22) + "mw690" + oldSrc.substr(idx);
						sTemp += newStr;
					}

					return sTemp;
				}
				,getBlogVideoSource : function(oBlog, iIndex)
				{
					oBlog = oBlog.children[iIndex];
					for (var a = 0 ,b = oBlog.children.length; a < b; a++)
					{
						var oVideoLink = oBlog.children[a];
						if ( "秒拍视频" == oVideoLink.getAttribute("title") || "微博视频" == oVideoLink.getAttribute("title"))
							return oVideoLink.getAttribute("href");
					}
				}
				,shareBlog : function(sAuthor, sText, sPic, sVideo)
				{
					/*
			          参数说明
						名称		类型	默认值	是否必选	描述
						url			String	无		否			分享页面链接
						type		String	icon	否			按钮样式，button|icon
						size		String	small	否			按钮尺寸：big|middle|small
						count		String	y		否			显示分享数: y|n
						title		String	无		否			分享的文字内容(可选，默认为所在页面的title)
						pic			String	无		否			分享图片的路径(可选)，多张图片通过"||"分开。
						searchPic	Boolean	true	否			是否要自动抓取页面上的图片。true|falsetrue:自动抓取,false:不自动抓取。
						language	String	zh_ch	否			语言设置：zh_cn|zh_tw
						width		Number	无		否			指定宽度
						height		Number	无		否			指定高度，根据按钮样式的不同而不同
						appkey		String	无		否			显示微博信息来源
					*/
					/*
					url:location.href,
					showcount:'1', 是否显示分享总数,显示：'1'，不显示：'0'  
					desc:'', 默认分享理由(可选) 
					summary:'', 分享摘要(可选) 
					title:'', 分享标题(可选) 
					site:'', 分享来源 如：腾讯网(可选) 
					pics:'',  分享图片的路径(可选) 
					style:'203',
					width:98,
					height:22
					*/
					sPic = sPic ? sPic : "";
					sVideo = sVideo ? sVideo : "";
					if ( "" != sVideo && confirm("是否同时分享 " + sAuthor + " 的这条视频到QQ空间?") )
						window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" + sText + "&pics=" + sPic + "&url=" + sVideo);
					window.open("http://service.weibo.com/share/share.php?app_src=3G5oUM&ralateUid=2965220663&searchPic=true&language=zh_cn" + "&title=" + sText + "&url=" + sVideo + "&pic=" + sPic);
				},
				init : function(Dom)
				{
					this._init();
					var _this = this;

					var aWB_detail = Dom.getElementsByClassName("WB_detail");
					g_oBlogListLen = aWB_detail.length;
					if( 0 == g_oBlogListLen) return;
					console.log("get " + g_oBlogListLen + " blog!");

					for (var i = 0; i < g_oBlogListLen; i++) 
					{
						(function(cSbvt, _this){
							//# 是否登陆微博 div.class == WB_info
							var aWB_info = _this.children[0];
							g_bLogin = aWB_info && "WB_info" == aWB_info.getAttribute("class");
							if(!g_bLogin) return;

							//# 添加分享按钮到div.class == WB_info的div下
							if ( aWB_info.getElementsByTagName("input")[0]) return;
							var oMyShareButton = document.createElement("input");
							oMyShareButton.value ="  一键分享  ";
							oMyShareButton.type = "button";
							oMyShareButton.class = "btnForward";
							oMyShareButton.setAttribute("style", "cursor:pointer; border: 0; border-radius: 8px; background-color: #211E1E; color: yellow; float : right; margin:0px 40px; padding :2px");
							oMyShareButton.onmouseover = function ()
							{
								this.style.color = "red";
								this.style.borderRadius = "6px";
							}
							oMyShareButton.onmouseout = function ()
							{
								this.style.color = "yellow";
								this.style.borderRadius = "8px";
							}
							oMyShareButton.onclick = function()
							{
								var sAuthor = aWB_info.children[0].innerText;
								var iWB_detail__div_length = _this.children.length;
								if ( "WB_tag_s" == _this.children[iWB_detail__div_length-1].getAttribute("class")) //# 个人主页WB_detail下会多一个div
									iWB_detail__div_length -= 1;

								switch (iWB_detail__div_length)//# 判断要转发微博类型
								{
									case cSbvt.TYPE_TEXT: //# 文字
										var sBlogText = cSbvt.getBlogText(_this, cSbvt.IDX_TEXT);
										cSbvt.shareBlog(sAuthor, sBlogText);
									break;

									case cSbvt.TYPE_MEDIA: //# 视频 图片
										var sBlogText = cSbvt.getBlogText(_this, cSbvt.IDX_TEXT);
										var sBlogPicSource = cSbvt.getBlogPicSource(_this, cSbvt.IDX_FEED_EXPAND);
										var sBlogVideoSource = cSbvt.getBlogVideoSource(_this, cSbvt.IDX_TEXT);

										if (sBlogVideoSource)
											cSbvt.shareBlog(sAuthor, sBlogText, "", sBlogVideoSource);
										else
											cSbvt.shareBlog(sAuthor, sBlogText, sBlogPicSource, "");
									break;

									case cSbvt.TYPE_FORWARD: //# 转发的微博
										var oForwardBlog_detail = _this.children[3].children[1];
										var sForwardAuthor = oForwardBlog_detail.children[0].children[0].innerText;

										var sForwardBlogText = cSbvt.getBlogText(oForwardBlog_detail, 1);
										var sForwardBlogPicSource = cSbvt.getBlogPicSource(oForwardBlog_detail, 2);
										var sForwardBlogVideoSource = cSbvt.getBlogVideoSource(oForwardBlog_detail, 1);

										if (sForwardBlogVideoSource)
											cSbvt.shareBlog(sForwardAuthor, sForwardBlogText, "", sForwardBlogVideoSource);
										else
											cSbvt.shareBlog(sForwardAuthor, sForwardBlogText, sForwardBlogPicSource, "");
									break;
									default: //# 未知类型
										alert("Error code: WB_detail__div_length_" + iWB_detail__div_length + ", 未知类型, 暂不支持转发, 你可以把此问题报告给QQ:1014779236,协助做的更好!");
									break;
								}
							}
							aWB_info.appendChild(oMyShareButton);
						})(_this, aWB_detail[i]);
					}
				}
			}

			if ( /weibo.com/g.test(window.location))
			{
				setTimeout(function(){
					sbvt().init(document);
					if ( !g_bLogin && g_oBlogListLen > 0 && confirm("检测到你的新浪微博未登陆,因此视频一键分享插件无法使用,请登陆后再试!"))
						document.getElementsByClassName("S_txt1")[7].click();
				}, 2000);
				window.onscroll = function(){sbvt().init(document)};	
			}

			if (/service.weibo.com\/share\//g.test(window.location)) 
			{
				setTimeout(function(){
					var oShareText = document.getElementById("weiboPublisher");
					if (oShareText)
						oShareText.value = oShareText.value.replace(/分享自/g, "喜欢就关注");
					
					var oPicContain = document.getElementById("picContent");
					if (oPicContain)
					{
						var aPicContainImg = oPicContain.getElementsByTagName("img");
						for (var i = 0, j = aPicContainImg.length; i < j; i++)
							aPicContainImg[i].click();
					}

					var aSelect_img_list = document.getElementsByClassName("select_img");
					var iSelect_img_list = aSelect_img_list.length;
					if (iSelect_img_list)
					{
						for (var i = 1, j = iSelect_img_list; i < j; i++)
						aSelect_img_list[i].click();

						document.getElementsByClassName("layer_close_btn layer_close_btn_large")[0].click();
					}

					var oAddBtn = document.getElementsByClassName("WB_btnA")[0];
					if (oAddBtn)
						oAddBtn.click();

					var aLnk = document.getElementsByClassName("wwg_foot")[0];
					var oLnk = aLnk.children[0];
					oLnk.innerText = "分享优化: 新浪微博分享工具";
					oLnk.setAttribute("href","http://weibo.com/2965220663");
					oLnk.setAttribute("style", "color: green");

					var oShareButton = document.getElementById("shareIt");
					if (oShareButton)
					{
						var iTime = 6;
						var iTimer = null;

						var oTextNode = document.createElement("a");
						oTextNode.id = "iAutoShare"
						oTextNode.href= "javascript:void(0);";
						oTextNode.style = "color:red; margin-right: 20px";
						oTextNode.innerText =  iTime + "s 后自动分享";
						oTextNode.onclick = function(){
							clearInterval(iTimer);
							this.style.display="none";
						};
						aLnk.insertBefore(oTextNode, oLnk);

						iTimer = setInterval(function(){
							if (0 != --iTime)
								aLnk.children[0].innerText = iTime + "s 后自动分享";
							else
							{
								clearInterval(iTimer);
								oShareButton.click();
							}	
						},1000);
					}

					var oText = document.getElementsByClassName("stat_plus")[0];
					if (oText)
					{
						var i = 6;
						setInterval(function(){
							if ( 0 == --i) window.close();
							oText.innerHTML = i + "秒后 <a href=\"javascript\:void(0);\" onclick=\"window.opener = null; window.close();\">关闭窗口</a>";
						}, 1000);
					}
				}, 500)
			}
   		}
	});
}

