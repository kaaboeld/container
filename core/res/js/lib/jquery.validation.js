/**
 *
 * Created with JetBrains PhpStorm.
 * Date create: 7/24/12
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */


function doValidation(obj,data){

	var container;
	if(obj.Error == undefined) container = obj;
	else if(obj.Target != undefined) container = $("[name="+obj.Target+"]");

	if(data == undefined && obj.Error != undefined) data = obj;

	var state = "success";
	if(data.Error) state = "error";

	container.removeClass("validate-state-error validate-state-success state-error state-success");

	container.addClass("validate-state-"+state);
	var parent = container.closest(".control-group");
	parent.find(".help-inline").remove();

	var msg = (data.Message != undefined) ? data.Message : "";
	if(data.SoapFault != undefined && data.SoapFault.Text != undefined) msg += " " + data.SoapFault.Text;

	var fieldMsg = $("<span/>").addClass("help-inline").text(msg);
	parent.find(".controls").append(fieldMsg);
	parent.removeClass("error");
	if(state == "error") parent.addClass("error");

}
// TODO: others validation rights
var validation = {
	"client" : function(element){
		var e = $(element);
		var mask = e.data("maskvalidate");
		var value = e.val();
		var re = "";
		var pattern = "";
		switch(mask){
			case "amount":
				re  = /[^\d|\.]/g;
				break;
			case "number":
				re  = /[^\d]/g;
				break;
			case "phone":
				re = /[^\d]/g;
				break;
			case "email":
				re = /[^\d|\w|\@|\.|\_|\-]/g;
				pattern = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
				break;
			case "date":
				re = /[^\d|\-]/g;
				pattern = "^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$";
				break;
		}
		var str = value;

		if(re != ""){
			str = value.replace(re, "");
			e.val(str);
		}
		if(pattern != ""){
			pattern = new RegExp(pattern, "g");
			var err = {};
			err.Error = false;
			if(e.val().match(pattern) == null) err.Error = true;

			doValidation(e,err);
		}
	},
	"server" : function(element){
		var e = $(element);
		var methodurl = e.data("methodurlvalidate");
		var params = $.extend({},_serverParams);
		$.extend(params,$().getwebmethod(methodurl));
		var form = e.closest("form");
		if(e.closest(".component-form").length > 0) form = e.closest(".component-form");

		var formParams  = form.preparer({"type":"form"});

		$.each(params.data,function(key,value){

			if(formParams[key] != undefined && formParams[key] != "") params.data[key] = formParams[key];

			if(params.data[key] == "" || params.data[key] == null) delete params.data[key];
		});

		params.callback = "doValidation";
		e.requester(params);
	}
};