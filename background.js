
var ENABLEPASSCTL = 'EnablePassCtl';
var ENABLESHARECTL = 'EnableShareCtl';

function setEnable(obj, isEnable)
{
	return localStorage.setItem(obj, isEnable);
}
function getEnable(obj)
{
	return localStorage.getItem(obj);
}

if ( null  == getEnable(ENABLEPASSCTL) )
	setEnable(ENABLEPASSCTL, 'true');
if ( null  == getEnable(ENABLESHARECTL) )
	setEnable(ENABLESHARECTL, 'false');

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (sender.tab) // from a content script  + sender.tab.url
		{
			if ( ENABLEPASSCTL == request.greeting)
				sendResponse({farewell: getEnable(ENABLEPASSCTL)});
			else if (ENABLESHARECTL == request.greeting)
				sendResponse({farewell: getEnable(ENABLESHARECTL)});
		}
});

// localStorage
	/*
		localStorage.setItem('age','24');
		localStorage.getItem('age');
		localStorage.removeItem('age');
	*/

// Message -> http://ju.outofmemory.cn/entry/74567
/*
简单的单次请求（Simple one-time requests）

如果只是想简单的给扩展的其它页面发送一次消息，那么可以使用 runtime.sendMessage 或者 tabs.sendMessage 方法，它允许你发送单次的JSON序列化后的数据，可以从 content script 发送给扩展页面，反之亦然。也可以选择性地传入一个处理响应的回调函数。

从 content script 发送请求代码如下：

contentscript.js
================
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
});
从扩展页面发送给 content script 也很类似，只是需要指定发送给那个 tab，下面的例子即为向选中的 tab 发送消息：

background.html
===============
chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
        console.log(response.farewell);
    });
});
注：官方例子中的 getSelected 方法已经被废弃了，可以使用 chrome.tabs.query({active:true}, function(tab) {}) 来替代。

在消息接收完毕时，需要设置一个  runtime.onMessage 事件监听器来处理消息，这部分在 content script 和扩展页面种都是一样的：

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
});
注意：如果有多个页面同时监听 onMessage 事件，那么只有第一个调用 sendResponse() 的页面可以成功返回响应信息，其它的都会被忽略。

小技巧：当事件监听器返回时函数就不可用了，不过如果让函数 return: true 的话，可以让该函数异步响应，直到调用 sendResponse 后才结束，具体说明请见文档。
*/