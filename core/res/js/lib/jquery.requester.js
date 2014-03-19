/**
 *
 * Created by JetBrains PhpStorm.
 * Date: 11/18/11
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */

(function($) {
	"use strict";
	var methods = {
		request : function(options){

			var settings = {
				"url"        : '/core/res/php/ajax/request.php?Method=',
				"type"       : "post",
				"dataType"   : "json",
				"basicAuth"  : false,
				"session"    : true,
				"cache" : false,
				"data"       : {},
				"webmethod"  : "",
				"webservice" : "",
				"accessToken": "",
				"callback"   : null,
				"client"     : "",
				"form"       : false,
				"showResult" : false,
				"showLoading": true
			}

			if (options) $.extend(settings, options);

			var url      = settings.url + settings.webmethod;
			var type     = settings.type;
			var dataType = settings.dataType;
			var callback = settings.webmethod;
			if(settings.callback != null) callback = settings.callback;

			var data = {};
			// Request data
			data.Data = settings.data;
			//console.log(data,settings)
			//return false;
			//settings.data;
			// Name of webserive
			data.Service = settings.webservice;

			if(settings.session) data.Session = true;

			if(settings.client != "") data.Client = settings.client;
			if(settings.accessToken != "")  data.AccessToken = settings.accessToken;
			if(settings.basicAuth != false) data.BasicAuth   = settings.basicAuth;

			var container = this;
			var params = {};

			var lastLocation = window.location.href;
			var random = Math.floor(Math.random() * 100);

			var beforeContent;

			params = {
				"url"      : url,
				"type"     : type,
				"async"    : true,
				"cache"    : settings.cache,
				"dataType" : dataType,
				"data"     : data,
				"beforeSend":function(){
					if(callback == "doValidation") container.addClass("loading");
					else{
						$("button").prop("disabled",true);
					}
					if(typeof(_app) != "undefined"){
						_app.data("loading",false);
						_appProgress.init("loading");
						_appProgresBar.show().css({"width":0}).animate({"width":100+"%"},10000);
					}

					beforeContent = $(container).children();
				},
				"success"  : function(data){

					if(!data.Error){
						if(callback != "OnBeforeWebMethod" && callback != "doValidation" && $(".modal").hasClass("state-noclose") == false){
							$(".modal").modal("hide");

						}
						$(".modal").removeClass("state-noclose");

					}else{
						$(container).requester("error",{"data" : data,"callback":callback});
					}
					if (lastLocation != window.location.href) return false;

					if((data.Result != undefined || data.Result == null) && $.isEmptyObject(data.Result)){
						if(!$(container).hasClass("action-webmethod"))$(container).empty().append(beforeContent);
					}

					$(container).requester("callback",{
						"callback":callback,
						"data":data,
						"form":settings.form});
				},
				"error"    : function(jqXHR, textStatus, errorThrown){
					if (lastLocation != window.location.href) return false;
				},
				"complete" : function(jqXHR, textStatus){
					if(callback == "doValidation") container.removeClass("loading");
					else{
						$("button").prop("disabled",false);
					}
					if(typeof(_appProgress) != "undefined"){
						_appProgress.init(textStatus);
						_appProgresBar.clearQueue().stop().css("width",100+"%").hide();
					}

					$(container).animate({opacity:1});

					if (lastLocation != window.location.href) return false;

					// Remove marker and enable button
					$("button.action-webmethod.async-disabled" + random).removeClass("async-disabled" + random).prop("disabled", false);

					if(container != null) container.data("state","loading-"+textStatus);

					
					if(window[settings.onComplete] != undefined) window[settings.onComplete]();
				}
			}

			$.ajax(params);
		},
		callback : function(options){

			var settings = {
				"showResult" : false,
				"callback"   : null,
				"data"       : {},
				"form"       : false
			};

			if (options) $.extend(settings, options);

			var data = settings.data;
			if(data.Error && settings.callback != "doValidation"){
				this.data("state","build-error").addClass("state-error");
				if(data.SoapFault != undefined || data.ex != undefined)return false;
			}

			var result = null;
			if(data.Result != undefined && data.Result != null)        result = data.Result;
			if(data.Result != null && data.Result.Result != undefined) result = data.Result.Result;

			var ready = false;
			var container = $(this);

			switch(settings.callback){
				case "GetContainer":

					if(result.Container != undefined && $.isPlainObject(result.Container)){
						result = result.Container;
						ready = container.container({"template":result});
					}else if(result.ContainerLinkList != undefined){
						var linkList = result.ContainerLinkList.ContainerLink;
						$.each(linkList,function(k,item){
							var target = container;

							if(item.Target != undefined && item.Target != "" && $(container).hasClass("tab-pane") == false) target = $("#"+item.Target);

							ready = target.container({"template":item.Container});
							
						});
					}else{
						ready = container.container({"template":result});
					}

					if(ready){
						var readyLayout = container.layout();
						var redyFunc = "getURL";
						if(window[redyFunc] != undefined) window[redyFunc]();
						_app.data("loading",true);
					}
				break;
				case "GetData":
					ready = container.container("data",{"data":result,"template":templateObject});
				break;
				default:
					if(window[settings.callback] != undefined) window[settings.callback](container,data);
				break;
			}

		},
		error : function(options){
			var settings = {
				"data" : {},
				"callback"  : ""
			};
			if (options) $.extend(settings, options);
			var logout = true;
			if(settings.callback == "RefreshWSDL") logout = false;

			_appProgress.error(settings.data,this,logout)
		}
	}

	$.fn.requester = function(method) {

		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof(method) === 'object' || !method){
			return methods.request.apply(this, arguments);
		}else{
			$.error('Method ' +  method + ' does not exist on jQuery.container');
		}
	}
})(jQuery);
