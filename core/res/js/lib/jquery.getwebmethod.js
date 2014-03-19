/**
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
	"use strict";
	$.fn.getwebmethod = function(str) {

		var result = {};

		if(str == undefined) return false;

		var strPart = [];
		var methodServicePart = [];
		var paramPart = [];
		if(str.split("(").length > 1){
			strPart = str.split("(");

			var paramStr = strPart[1].slice(0, -1);
			if(paramStr.split(",").length > 0 && paramStr.split(",")[0] != "") paramPart = paramStr.split(",");
			
			methodServicePart = strPart[0].split(":");
		}else{
			methodServicePart = str.split(":");
		}

		if(methodServicePart.length > 0){
			result["webservice"] = methodServicePart[0];
			result["webmethod"]  = methodServicePart[1];
		}
		
		if(paramPart.length > 0){
			var param = {};
			$.each(paramPart,function(k,v){
					if(v.split("=").length > 1){
						var vPart = [];
						vPart = v.split("=");
						param[vPart[0]] = vPart[1].replace(/'/g,"");
					}else{
						param[v] = null;
					}
			});
			result["data"] = param;
		}

		return result;
	}

})(jQuery);