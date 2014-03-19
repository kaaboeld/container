/**
 *
 * Created with JetBrains PhpStorm.
 * Date create: 7/23/12
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */









//Any events listeners or replace core
$("#doauth").live("click",function(){
	var form = $("#authform");

	form.submit();
	return false;
});



$("body").on("submit","form",function(){
	var form   = $(this);
	var data   = form.preparer({"type":"form"});
	var url    = form.attr("action");
	var method = form.attr("method");
	var callback = (form.data("callback") != undefined) ? form.data("callback") : "";
	var params = $.extend({},_serverParams);
	$.extend(params, $().getwebmethod("Local:"+url));
	params.callback   = callback;
	params.webservice = "Local";
	params.url  = "";
	params.data = data;
	$().requester(params);

	return false;
});
/*
$("form").live("submit",function(){

	var form   = $(this);
	var data   = form.preparer({"type":"form"});
	var url    = form.attr("action");
	var method = form.attr("method");
	var callback = (form.data("callback") != undefined) ? form.data("callback") : "";

	var params = $.extend({},_serverParams);
	$.extend(params, $().getwebmethod("Local:"+url));

	params.callback   = callback;
	params.webservice = "Local";
	params.url  = "";
	params.data = data;
	console.log(params)
	return false;
	$().requester(params);
	return false;

*/
	/*$.ajax({
		url : url,
		type : method,
		data : data,
		dataType : "json",
		success : function(r){

			if(window[callback] != undefined) window[callback](r);
		},
		complete:function(res){
			re = res.responseText;
			r = $.parseJSON(re);

			if(r.Error){
				var reqErrText = "";
				if(r.Status != undefined && r.Status.Text != undefined) reqErrText = r.Status.Text;
				err = {
					"SoapFault" :{
						"Code" : 0,
						"Text" : reqErrText
					}
				}

				_appProgress.error(err,null,false)
				return false;
			}
		}
	});*/
	//return false;
//});
$("#mailbox-reg").find("input,submit").live("focusout",function(){
	$(this).closest("form").submit();
});
$("[data-serverid=Password],[data-serverid=Login]").live("keyup",function(){
	var value = $(this).val();
	var re = /[\@|\%|\$|\^|\#|\\|\||\/|\*|\;|\:|\<|\>|\?|\(|\)|\+|\=|\&|\№|\!|\ |\"|\,]|[а-я]/g;///[\d|\w|\@|\.|\_|\-]/g;
	if(re != ""){
		var str = value.replace(re, "");
		$(this).val(str);
	}
});

$("[name=MailUserName]").live("focusout keyup",function(e){
	var field = $($("[name=MailUserName]"));
	var code = [37,38,39,9,40,13];
	if(code.indexOf(e.keyCode) >= 0) return false;

	var value = $(this).val();
	var re = /[\@|\%|\$|\^|\#|\\|\||\/|\*|\;|\:|\<|\>|\?|\(|\)|\+|\=|\&|\№|\!|\ |\"|\,]|[а-я]/g;///[\d|\w|\@|\.|\_|\-]/g;
	if(re != ""){
		var str = value.replace(re, "");
		$(this).val(str);
	}

	var login = field.val().toLowerCase();
	var domain = $("[name=MailDomainName]").val();

	var url = "./res/php/imap/validate.php";

	$.ajax({
		url : url,
		type : "post",
		data : {"login":login,"domain":domain},
		dataType : "json",
		beforeSend : function(){
			field.addClass("loading");
		},
		success : function(r){
			doValidation(r);
		},
		complete : function(){
			field.removeClass("loading");
		}
	});

	var passwd = $("[name=Password]").val();
	var mailbox = login+"@"+domain;

	var token = mailbox+":"+passwd;
	$("[name=Token]").val(token);
	$("[name=Login]").val(mailbox);
	if(e.type = "focusout") $(this).val(login);


});
$(".link-info").live("click",function(){
	$(this).parent().toggleClass("active");
	$("#Page").toggleClass("offset3");
	$(".banner-hidden").stop().slideToggle(300);
	return false;
});
$(".UserGroup .exit,.action-logout").live("click",function(){
	logout();
	return false;
});
$(".action-show-password").on("click",function(){
	var type    = "password";
	var visible = "close";
	var field   = $("[name=password]").eq(0);
	var attr    = field.getAttributes();

	var value   = field.val();
	if($(this).find("i").hasClass("icon-eye-close")){
		type = "text";
		visible = "open";
	}

	attr.type = type;

	var input = $("<input>").attr(attr).val(value);

	field.replaceWith(input);
	$(this).find("i").removeClass("icon-eye-close icon-eye-open").addClass("icon-eye-"+visible);

	return false;
});