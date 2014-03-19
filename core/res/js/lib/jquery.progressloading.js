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
var _appLogger = $("<div/>").attr({"id":"app-logger"}).addClass("alert")
	.append($("<a/>").attr({"href":"#"}).data({"dismiss":"alert"}).addClass("close icon-remove").html("&nbsp;"),
	$("<h4/>").addClass("alert-heading logger-header"),
	$("<div/>").addClass("logger-content"));

$("body").prepend(_appLogger);

var progressText = {
	"success" : "",
	"error"   : "",
	"loading" : ""
}

var _appProgress = {
	"init" : function(state){
		if(this[state]() == undefined) return false;
		_appLogger.find(".logger-header,.logger-content").empty();
		_appLogger.find(".logger-header").append(progressText[state]);
		_appLogger.removeClass("alert-info alert-warning alert-error alert-success").addClass("alert-"+state).clearQueue().slideDown();
		this[state]();
	},
	"error" : function(data,container,logout){
		_appLogger.removeClass("alert-info alert-warning alert-error alert-success").addClass("alert-error");
		if(logout){
			if(data.SoapFault != undefined && data.SoapFault.Code == "SOAP-ENV:401"){
				if(window["Logout"] != undefined) window.Logout();
				return false;
			}
		}
		var errText = "";
		var soapFaultText = "";
		var exText        = "";
		var statusText    = "";

		if(data.SoapFault != undefined
			&& data.SoapFault.Text != undefined) soapFaultText = data.SoapFault.Text;
		if(data.ex        != undefined
			&& data.ex.faultstring != undefined) exText = data.ex.faultstring;
		if(data.Status    != undefined
			&& data.Status.Text != undefined)    statusText = data.Status.Text;

		errText = statusText + " " + soapFaultText + " " + exText;

		_appLogger.find(".logger-content").empty().append(errText);
		_appLogger.show().delay(10000).slideUp();

	},
	"success" : function(element){
		_appLogger.delay(5000).slideUp();
	},
	"loading" : function(element){},
	"parsererror": function(element){}
};