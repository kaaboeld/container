/**
 * Created by JetBrains PhpStorm.
 * Date: 11/21/11
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
		init : function(){
			var layout = this;

			$.each(layout.find(".layout-container"),function(key,item){
				var paramList = $(item).data("paramlist");
				$.each(paramList, function(key,value){
					if(methods[key] && value == true){
						$(item).layout(key);
					}
				});
				$(item).data("state","layout-success");
			});


			return true;
		}
	}
	$.fn.layout = function(method) {

		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof(method) === 'object' || !method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method ' +  method + ' does not exist on jQuery.container');
		}
	}
})(jQuery);