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


$("body").on("change",".action-webmethod-onchange",function(e){

	var form = $(this).closest("form");
	if($(this).closest(".component-form").length > 0) form = $(this).closest(".component-form");
	var methodurl = $(this).data("methodurl");

	var params = $.extend({},_serverParams);
	$.extend(params,$().getwebmethod(methodurl));
	var form = $(this).closest(".component-form");
	var formParams  = form.preparer({"type":"form"});

	$.each(params.data,function(key,value){
		if(formParams[key] != undefined && formParams[key] != "") params.data[key] = formParams[key];
		if(params.data[key] == "") delete params.data[key];
	});
	var target = $(this).closest(".component-container");
	if($(this).data("target") != undefined) target = "#" + $(this).data("target");
	params.callback = "GetContainer";
	$(target).requester(params);
	return false;
});
$("body").on("click",".action-webmethod",function(){

	if($(this).hasClass("element-id-butonregistreddomain")) $("[name=ReferalId]").val("nsk.ru");
	if($(this).data("closemodal") != undefined) $(".modal").addClass("state-noclose");

	if($(this).hasClass("action-confirmed")){
		var confirmText = "";
		if($(this).data("confirmtext") != "") confirmText = $(this).data("confirmtext");
		if(!confirm(confirmText)) return false;
	}

	var methodurl = $(this).data("methodurl");
	if($(this).hasClass("action-onbefore")) methodurl = $(this).data("onbeforemethodurl");


	var form = $(this).closest(".component-form");
	if(form.data("externalform") != undefined) form = $("#"+form.data("externalform"));

	var required = true;

	if(form.find(".control-required").length > 0 && !$(this).hasClass("element-id-statichelp")){
		var reqFields = form.find(".control-required").find("input,select,textarea");
		var reqFieldsEmpty = "";
		$.each(reqFields,function(){
			var validateErr = {"Error":true};
			if($(this).val() == ""){
				required = false;
				reqFieldsEmpty += $(this).closest(".control-group").find(".control-label").text()+"; ";
			}else{
				validateErr = {"Error":false};
			}
			doValidation($(this),validateErr);
		});
	}
	if(!required){
		var err = {};
		var reqErrText = "Не заполнены обязательные поля: " + reqFieldsEmpty;
		err = {
			"SoapFault" :{
				"Code" : 0,
				"Text" : reqErrText
			}
		}
		getErrors(err,form,true);
		return false;
	}

	var params = prepareRequestParams(methodurl,form,$(this));

	var target = $(this).closest(".component-container");
	if($(this).data("callback") != undefined) params.callback = $(this).data("callback");
	if($(this).data("target") != undefined)   target = "#" + $(this).data("target");
	if($(this).hasClass("action-onbefore"))   target = $(this);

	if(params.webservice == "Local"){
		params.data = form.preparer({"type":"form"});
		params.url  = "/app/";

	}
	if($(this).hasClass("action-item-reload")){
		$(".tab-pane").removeClass("active");
	}
	if($(this).closest(".tab-pane").length > 0 && target != "#Modal") target = $(this).closest(".tab-pane");
	if(params.webmethod == "RegisterDomainAndUserLevel1" || params.webmethod == "RegisterMailBox") params.callback = "doFinishRegistration";
	$(target).requester(params);
	if(target == "#Modal" || $(this).parent(".modal.state-noclose")) return false;

});
