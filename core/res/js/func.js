/**
 *
 * Created with JetBrains PhpStorm.
 * Date create: 7/25/12
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */
function getErrors(data,container,global,logout){}
function OnBeforeWebMethod(container, data){
	var e = $(container);
	var methodurl = e.data("methodurl");
	var params = $.extend({},_serverParams);
	$.extend(params,$().getwebmethod(methodurl));
	if(e.data("onbeforetarget") != undefined){
		var bt = e.data("onbeforetarget");

		$("[name="+e.data("onbeforetarget")+"]").val(data.Result.Id);
	}
	$.each(data.Result,function(k,v){
		if(k != "Id") $("[name="+k+"]").val(v);
	});
	if(e.closest(".component-form").length > 0){

		var form = e.closest(".component-form");
		var formParams  = form.preparer({"type":"form"});
		$.each(params.data,function(key,value){

			if(key.split("@").length > 1){

				delete params.data[key];
				var ks = key.split("@");
				var kType = ks[1];
				var kName = ks[0];
				key = kName;
			}
			if(formParams[key] != undefined && formParams[key] != "") params.data[key] = formParams[key];

			if(params.data[key] == "" || params.data[key] == null) delete params.data[key];

		});
		var target = e.closest(".component-container");
		if(e.data("target") != undefined) target = "#" + e.data("target");

		params.callback = "GetContainer";
		if(params.webmethod == "RegistredCredentialsAuthorized"){
			params.callback = "doFinishRegistration";
		}
		$(target).requester(params);
	}
}

function prepareRequestParams(methodurl,form,elem,callback){
	var params = $.extend({},_serverParams);
	$.extend(params,$().getwebmethod(methodurl));
	params.callback = "GetContainer";

	if(form != undefined){
		var formParams  = form.preparer({"type":"form"});
		$.each(params.data,function(key,value){
			if(key.split("@").length > 1){
				delete params.data[key];
				var ks = key.split("@");
				var kType = ks[1];
				var kName = ks[0];
				key = kName;
			}
			if(formParams[key] != undefined && formParams[key] != "") params.data[key] = formParams[key];
			if(params.data[key] == "" || params.data[key] == null) delete params.data[key];
		});
	}

	if(elem != undefined && elem.hasClass("action-onbefore")){
		params.callback = "OnBeforeWebMethod";
	}

	return params;
}

function getURL(){
	var methodurl,params;
	if($(".method-area").length > 0){
		$.each($(".method-area"),function(){
			$(this).empty();
			methodurl = $(this).data("methodurl");
			params = prepareRequestParams(methodurl);
			if($(this).data("callback") != undefined) params.callback = $(this).data("callback");
			$(this).removeClass("method-area").requester(params);
		});
	}
	var hash = location.hash;
	if (location.search != "" && !$.browser.opera) {
		location.href = location.href.replace(/(\/\?[^#]*)#/i, "#");
	}
	if(globalHash == hash){
		return false;
	}else{
		methodurl = hash.replace(hashPrefx,"");
		$.each(_appLinkMap,function(k,v){
			if(v.alias == methodurl) methodurl = k;
		});
		params = prepareRequestParams(methodurl);
		$("#Page").requester(params);
	}



	globalHash = hash;
}

