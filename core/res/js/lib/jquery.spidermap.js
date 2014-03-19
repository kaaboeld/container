/**
 *
 * Created with JetBrains PhpStorm.
 * Date create: 7/27/12
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */
(function($){
	var mappedList;

	var i = 0;

	var a = setInterval(function(){

		if(_app.data("loading")){
			var map = {};
			if($(".state-mapped:not(.state-mapped-checked)").length > 0) $().spidermap();
			if(mappedList !== undefined && mappedList.eq(i).length > 0){
				var el = mappedList.eq(i);
				var mu = $(el).data("methodurl");
				el.addClass("state-mapped-checked").trigger("click");
			}
		}
		i++;

	},100);


	var methods = {
		init : function(options){
			var settings = {
				link : "a.action-webmethod:not(.state-mapped)",
				clean : true
			};
			if (options) $.extend(settings, options);
			var startPoint = ($(this).length == 0)?"body":$(this);
			var mask = settings.link;

			if($(startPoint).find(mask).length == 0){
				return false;
				if(a != undefined) clearInterval(a);
			}

			if(settings.clean) $(startPoint).find(mask).removeClass("state-mapped");


			$(startPoint).find(mask).each(function(){
				if($(this).data("methodurl") != undefined){
					$(this).addClass("state-mapped");
					var methodurl = $(this).data("methodurl");
					linkMap[methodurl] = {
						"alias" : ($(this).data("clientid") != undefined)? $(this).data("clientid") : null
					}
				}
			});
			mappedList = $(".state-mapped:not(.state-mapped-checked):gt(0)");
			count = mappedList.length;
			i = 0;
		}
	};
	$.fn.spidermap = function(method) {
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof(method) === 'object' || !method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method ' +  method + ' does not exist on jQuery.container');
		}
	}
})(jQuery);