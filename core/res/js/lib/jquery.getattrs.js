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
	"use strict";
	$.fn.getAttrs = function() {
		var attributes = {};
		if(!this.length) return this;
		if ( $.browser.msie && parseInt($.browser.version, 10) < 8) {
			var attrs = this[0].attributes;
			for(var i = 0; i < attrs.length; i++) {
				if(attrs[i].specified == true ) {
					attributes[attrs[i].nodeName] = attrs[i].nodeValue;
				}
			}
		} else {
			$.each(this[0].attributes, function(index, attr) {
				attributes[attr.name] = attr.value;
			});
		}
		return attributes;
	}
})(jQuery);