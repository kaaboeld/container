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

(function($) {

	$.fn.collapsible = function(){
		$.each($(this),function(){


			var container = $(this);
			if((container == undefined) || container.children().length == 0) return true;
			var height = container.data("height");

			var content = $("<div/>").addClass("collapsible-content").append(container.children());

			var btnTitle = {
				"show":$("<i/>").append($("<span/>").addClass("icon-chevron-down chevron"),$("<span/>").text("Показать")),
				"hide":$("<i/>").append($("<span/>").addClass("icon-chevron-up chevron"),$("<span/>").text("Скрыть"))
			};

			var btn = $("<div/>").addClass("collapsible-actions").append($("<a/>").attr({"href":"#"}).addClass("action-toggle-collapsible").append(btnTitle.show.clone().children()));

			container.append(content,btn)
			container.find(".collapsible-content").css({
				"height" : height
			});



			container.find(".action-toggle-collapsible").on("click",function(){
				var content = container.find(".collapsible-content");
				$(this).empty();
				var h = "auto";
				if(!container.hasClass("state-collapse")){
					h = height;
					$(this).append(btnTitle.show.clone().children());
				}else{
					$(this).append(btnTitle.hide.clone().children());
				}
				container.toggleClass("state-collapse");

				content.css("height",h);
				return false;
			});
		});
	}
})(jQuery);