/**
 * Created by JetBrains PhpStorm.
 * Date: 11/9/11
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
	$.fn.htpl = function(options) {
		var settings = {
			'template' : {},
			'data'     : {},
			'mark' : "#value#",
			'separator' : ".",
			'components' : {},
			'collection' : false
		};
		
		// Merge extended options
		if (options) $.extend(settings, options);

		var result = null;

		var m        = settings.mark;
		var s        = settings.separator;
		var data     = settings.data;
		var template = settings.template;
		var components = settings.components;
		var collection = settings.collection;

		var elements = template;

		function createElement(elements,data){
			var i;
			var count = elements.find("*").length;
			var el = elements.find("*");
			for(i=0; i<count; i++){
				var e = el.eq(i);

				var bind = "";
				if(e.data("bind") != undefined && e.data("bind") != ""){

					var dataStr  = e.data("bind");
					var dataPath = dataStr.split(s);
					var value = getValue(data,dataPath);

					if($.isArray(value) || $.isPlainObject(value)){
						var componentTemplate;
						if(e.data("template") != undefined) componentTemplate = components[e.data("template")];
						var componentParams = {"template":componentTemplate,"data":value,"collection":$.isArray(value)};
						$(e).htpl(componentParams);
					}else{

						
						setValue(e,value);
					}
				}
			}
			return elements;
		}
		

		function setValue(e,value){
			var dataType = "";
			if(e.data("type")){
				dataType = e.data("type");
			}
			switch(dataType){
				case "Date": value = "date->"+value;
				break;
			}
			if($.trim(e.html()) == m){
				e.empty().append(value);
			}else if(e.hasClass(m)){
				e.removeClass(m).addClass(value);
			}else{
				e.each(function(){

					var attr  = this.attributes;
					var count = attr.length;
					var i;
					for(i=0; i<count; i++){
						var attrName  = attr[i].name;
						var attrValue = attr[i].value;
						if(attrValue == m || attrValue == "about:"+m){

							e.attr(attrName,value);
							break;
						}
					}
				});
			}
		}

		function getValue(data,path){
			var value = null;
			var i;
			var count = path.length;
			for(i=0; i<count; i++){
				var p = path[i];
				if(data[p] != undefined){
					if(i == count-1) value = data[p];
					else{
						if($.isPlainObject(data[p])) value = getValue(data[p],path.splice(1));
					}
				}
			}
			if(value != undefined){
				return value;
			}else{
				return null;
			}
		}

		if(collection){
			result = $("<div/>");
			$.each(data,function(key,value){
				result.append(createElement(elements.clone(true,true),value));
			});
			result = result.html();
		}else{
			result = createElement(elements.clone(true,true),data);
		}
		this.append(result);
	}
})(jQuery);