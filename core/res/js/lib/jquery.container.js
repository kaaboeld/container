/**
 *
 * Created by JetBrains PhpStorm.
 * Date: 11/15/11
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */
(function($) {
	var methods = {
		init : function(options){
			var settings = {
				"template" : null,
				"empty" : true
			};
			/*if($("[rel=popover]").length > 0){
				$("[rel=popover]").popover("hide");
			}*/


			// Merge extended options
			if (options) $.extend(settings, options);
			var template = settings.template;

			if(template == null || template.ClientId == undefined) return false;

			var dummyContainer = $("<div/>").addClass("component-container");
			var content = $("<div/>").addClass("container-content");

			var paramList = {};

			if(template.ParamList != undefined){
				$.each(template.ParamList.Param,function(key,item){
					paramList[item.Key] = item._;
				});

			}

			if(template.Template != "") paramList["template"] = template.Template;


			if(template.Name     != "" && template.Target != "Modal"){
				var headerTag = "h3";
				if(paramList.Header != undefined) headerTag = paramList.Header;
				dummyContainer.append($("<"+headerTag+"/>").addClass("component-header").html(template.Name));
			}

			dummyContainer.attr({"id":template.ClientId});
			var templateStructure = "form";

			if(paramList.wrapper != undefined)    templateStructure = paramList.wrapper;
			if(template.TemplateStructure != "")  templateStructure = template.TemplateStructure;
			if(paramList.ReloadMethod != undefined) dummyContainer.attr("data-reloadmethod",paramList.ReloadMethod);


			var controlWrapper = templateStructure;
			if(template.ChildrenList != undefined){
				if(template.ChildrenList.Container != undefined){
					var childList = template.ChildrenList.Container;
					$.each(childList,function(key,child){
						$(dummyContainer).container({"template":child,"empty":false})
					});
				}
			}

			if(controlWrapper == "tab"){
				var tabs = dummyContainer.find(">.component-container").addClass("tab-pane");
				var tabContainer = $("<div/>").addClass("tabbable");
				var tabNav       = $("<ul/>").addClass("nav nav-tabs")
				var tabContent   = $("<div/>").addClass("tab-content");
				var dummyMenuTab = $("<div/>");
				$.each(tabs,function(k,item){
					var tabName = $(item).find(">.component-header").text();
					$(item).find(">.component-header").remove();
					var tabId = $(item).attr("id");
					var tabMenuItem = $("<li/>").append($("<a/>").attr({
						"href":"#"+tabId,
						"data-toggle":"tab"
					}).text(tabName));
					if($(item).data("reloadmethod") != undefined) tabMenuItem.find("a").attr({"data-methodurl":$(item).data("reloadmethod"),"data-target":tabId}).addClass("action-webmethod action-item-reload");
					dummyMenuTab.append(tabMenuItem);
				});

				if(dummyMenuTab.find("li.active").length == 0){
					dummyMenuTab.find("li").eq(0).addClass("active");
					tabs.eq(0).addClass("active");
				}

				tabContainer.append(tabNav.append(dummyMenuTab.html()),tabContent.append(tabs));
				dummyContainer.append(tabContainer);
			}

			dummyContainer.data("paramlist",paramList);
			if(template.ControlList != undefined){
				var isFormbox = (paramList.formbox != undefined) ? Boolean(paramList.formbox) : false;

				var controlList = template.ControlList.Control;
				var form = $("<"+controlWrapper+"/>");
				if(controlWrapper == "form") form.addClass("component-form");

				if(paramList.ExternalForm != undefined){
					$(form).data("externalform",paramList.ExternalForm);
				}

				if(paramList.wrappercss != undefined) form.addClass(paramList.wrappercss);

				$(dummyContainer).append(form);
				$(dummyContainer).find(">"+controlWrapper).genforms({
					"template":controlList,
					"server" : $.extend(true,{},_serverParams,{
						"field":true
					})
				});
				if(isFormbox){
					var formBox = $(dummyContainer).find(">"+controlWrapper);
					var formChildren = formBox.children(":not(button.action-webmethod)");
					var formActions = formBox.find(".action-webmethod:not(:checkbox,a)");
					$(dummyContainer).find(">"+controlWrapper).append(
						$("<div/>").addClass("well").append(formChildren),
						$("<div/>").addClass("form-actions").append(formActions)
					);
				}
			}

			var tplPrefix = "tpl-";
			var tplClass = "";
			if(template.Template != "") tplClass = tplPrefix+template.Template;
			else tplClass = tplPrefix+template.ClientId;
			dummyContainer.addClass(tplClass.toLowerCase());

			var typeClass = "";
			if(paramList.type != undefined)   typeClass = paramList.type;
			if(paramList.column != undefined) typeClass += paramList.column;
			if(paramList.offset != undefined) typeClass += " offset"+paramList.offset;
			dummyContainer.addClass(typeClass);

			if(template.MethodData != "") dummyContainer.data("methoddata",template.MethodData);

			dummyContainer.on('changeData', function(e,key,value){
				switch(key){
					case "state":
						dummyContainer.data("modified",e.timeStamp);
						if(value == "born"){
							if(dummyContainer.data("paramlist").onAfterLoad != undefined){
								var onAfterLoadFunc = dummyContainer.data("paramlist").onAfterLoad;
								if(window[onAfterLoadFunc] != undefined) window[onAfterLoadFunc](controlList);
							}
							if(dummyContainer.data("methoddata") != undefined){

								var params = $.extend({},serverParams);

								$.extend(params, $().getwebmethod(dummyContainer.data("methoddata")));
								//TODO: change to universal method

								if(dummyContainer.data("paramlist").callback) params.callback = dummyContainer.data("paramlist").callback;

								$(dummyContainer).requester(params);
							}

						}
						if(value == "appended"){
							$.each(dummyContainer.find(".help-block").closest(".controls"),function(){
								var item = $(this);
								var w = item.find("input,select,textarea").eq(0).css("width");
								item.find(".help-block").css("width",w);
							});
							if(window["setSiteMap"] != undefined) setSiteMap();

							$(".collapsible").collapsible();
							if($(".element-id-amount").length > 0){
								$(".element-id-amount").trigger("keyup");
							}

						}
					break;
				}
            });
			dummyContainer.data("state","born");
			/**
			 * Loading data
			 */
			if($(this).hasClass("action-webmethod")) settings.empty = false;
			if(settings.empty) this.empty();
			if(settings.empty && $("#"+template.ClientId).length > 0) $("#"+template.ClientId).replaceWith(dummyContainer);
			else if(paramList.inrow != undefined){
				var inrowClass = "row";
				if(paramList.inrow != "") inrowClass += "-"+paramList.inrow;
				var inrow = $("<div/>").addClass(inrowClass+" component-inrow");
				if(this.closest(".component-container").find(".component-inrow").length==0){
					this.append(inrow);
				}
				this.closest(".component-container").find(".component-inrow").append(dummyContainer);

			}else $(this).append(dummyContainer);

			if($(this).attr("id") == "Modal" || $(this).attr("id") == "ModalHelp"){
				$(this).closest(".modal").find(".modal-body .component-header").remove();
				if(template.Name != "") $(this).closest(".modal").find(".modal-header>h3").html(template.Name);
				else $(this).closest(".modal").find(".modal-header>h3").html("&nbsp;");
				$(this).closest(".modal").modal().on("hide",function(){
					$(this).find(".modal-body>div").empty();
				});
			}

			if($(dummyContainer).parent(".tab-content").length > 0){
				$(dummyContainer).addClass("tab-pane");
				$(dummyContainer).find(">.component-header").remove();
				var tabParent = $(dummyContainer).closest(".tabbable");
				tabParent.find((tabParent.find(".nav-tabs>li.active>a").attr("href"))).addClass("active");
			}

			dummyContainer.data("state","appended");

			return true;
		},
		update : function(options){
			var settings = {};
			this.data("state","refrash");
			this.data("state","ready");
			// Merge extended options
			if (options) $.extend(settings, options);
		},
		destroy : function(){

			this.remove();
		}
	}
	$.fn.container = function(method) {
		
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof(method) === 'object' || !method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method ' +  method + ' does not exist on jQuery.container');
		}
	}
})(jQuery);