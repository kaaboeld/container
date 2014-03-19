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

//Any functions gettings from events and other functions of app or replace core

$.fn.getAttributes = function() {
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

function mailAuth(container,data){
	if(data.Error) return false;
	var formid = "authform";
	var form = $("<form/>").attr({
		"action" :"https://auth.hnet.ru/dev/getlocation.php",
		"method" : "post",
		"id"     : formid
	}).append(
		$("<input/>").attr({"type":"text","name":"authstr"}).val(data.authstr),
		$("<input/>").attr({"type":"text","name":"client_id"}).val("nsk"),
		$("<input/>").attr({"type":"text","name":"redirect_uri"}).val("http://deva2.alanov.ru/"),
		$("<input/>").attr({"type":"text","name":"response_type"}).val("code"),
		$("<input/>").attr({"type":"text","name":"mode"}).val("json")
	);
	$("body").append(form);

	form.iForm({
		sucess: function () {
			$("#"+formid).remove();
			if(data.Location != undefined) location = data.Location;
			else location = "/";
		}
	});
	form.submit();

}
function makeTopbar(container, data){
	if (data.Result.GroupList != undefined) {
		$().topbar({
			Group: data.Result.GroupList.Group,
			ActiveInterfaceId: null,
			fixed:false
		});
	}
}
function doFinishRegistration(container,data){
	var url = "./res/php/auth/login.php";
	if(data.Result != undefined && data.Result.AbonentId){
		$.ajax({
			url : url,
			type : "post",
			data : data.Result,
			dataType : "json",
			success : function(r){
				mailAuth(r);
			}
		});
	}else location = "./";
}
function doMailboxRegistraion(params){
	var url = "./res/php/imap/registration.php";
	var d = params.data;
	$.ajax({
		url : url,
		type : "post",
		data : d,
		dataType : "json",
		success : function(r){

		}
	});
}
function doTokenList(container, data){
	var url = "./res/php/imap/getmailbox.php";
	if(data.Result != undefined
		&& data.Result.TokenList != undefined
		&& data.Result.TokenList.TokenListItem != undefined
		&& data.Result.TokenList.TokenListItem.length > 0){

		var d = data.Result.TokenList.TokenListItem;
		$.ajax({
			url : url,
			type : "post",
			data : {"token":d[0]},
			dataType : "json",
			success : function(r){
				if(!r.Error) location = "./";
			}
		});
	}else return false;

}
function doDomainPrice(container, data){
	if(data.Result != null){
		var result = data.Result;
		var dummy = $("<div/>");
		if (result.ActionList != undefined) {
			if (result.ActionList.Action.length > 0) {
				beforeHtml = result.ActionList.Action[0].Value;
			}
			if (result.ActionList.Action.length > 1) {
				afterHtml = result.ActionList.Action[1].Value;
			}
		}
		if (result.DNSPriceList != undefined) {
			dummy.append(
				$("<table/>").addClass("table").append(
					$("<thead/>").append(
						$("<tr/>").append(
							$("<th/>").text("Домен (доменная зона)"),
							$("<th/>").text("Регистрация"),
							$("<th/>").text("Продление"),
							$("<th/>").text("Поддержка на DNS-серверах")
						)
					),
					$("<tbody/>")
				)
			);
			var tbody = dummy.find("tbody");
			for (var i = 0; i < result.DNSPriceList.PriceDNS.length; i++) {
				var price = result.DNSPriceList.PriceDNS[i];
				tbody.append(
					$("<tr/>").append(
						$("<td/>").text(price.NameDNSZone),
						$("<td/>").text(price.RegistrationPrice + " руб."),
						$("<td/>").text(price.ExtensionPrice + " руб. в год"),
						$("<td/>").text(price.RegistrationInfotekaPrice + " руб. в год")
					)
				);
			}
		}
		container.append(dummy);
	}
}


function logout(){
	var c = ["access_token","oauth2_nsk","session_id","roundcube_sessid","roundcube_sessauth"];
	$.each(c,function(){
		$.cookie(this, null,{"path":"/"});
	});
	location = "/";
}