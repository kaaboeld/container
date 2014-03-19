/**
 *
 * Created with JetBrains PhpStorm.
 * Date create: 7/23/12
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */

if(typeof console === "undefined") {
	console = {log:function(){}};
}

var _appClient = "clientname";
var _appLang   = "ru";

var _app = $("<div/>").attr({"id":"app"});
var _appProgresBar = $("<div/>").attr({"id":"app-loading-bar"})
	.addClass("progress progress-striped active")
	.append($("<div/>").addClass("bar"));


$("body").append(_appProgresBar,_app).data("corelibcount",0);

_app.on("changeData", function(e,key,value){});

/**
 * Prepare and loading application modules
 */
require.config({
	paths: {
		app  : "../../../app/res/js",
		core : "../../../core/res/js"
	}
});

var _appModuleList = [];
_appModuleList= ["app/lib/holder","app/func","app/actions"];

$("body").data("corelibcount",$("body").data("corelibcount") + _appModuleList.length);

var linkMap = {};
var _appLinkMap = {};
//_appLinkMap = $.getJSON("/app/map/map.json");


require.onResourceLoad = function (context, map, depArray) {
	var count = $("body").data("corelibcount");
	$("body").data("corelibcount", count - 1);
	var w = parseFloat(100 / count) + "%";
	_appProgresBar.find(".bar").width(w);

	if(count <= 0){
		_appProgresBar.delay(500).css("width",0);
	}
}
require(["core/core"]);

/**
 * Initialization application after loading all js modules
 */
function init(){
	_app = $("#app");
	_app.delay(5).fadeIn("300");
	_serverParams.client = _appClient;

	progressText = {
		"success" : _lang[_appLang].progress.success,
		"error"   : _lang[_appLang].progress.error,
		"loading" : _lang[_appLang].progress.loading
	}

	var methodurl = "API.Interface.Service:";
	methodurl += "GetContainer()";

	var params = $.extend({},_serverParams);
	$.extend(params,$().getwebmethod(methodurl));
	params.callback = "GetContainer";
	var target;
	$().requester(params);
}



