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

var accessToken = "";
var coreLibPath = "core/lib/";

var _coreModuleList = [
	//"/app/map/map.json",
	"core/lang",
	coreLibPath+"jquery-ui",
	//Bootstrab libs
	coreLibPath+"bootstrap-modal",
	coreLibPath+"bootstrap-tab",
	coreLibPath+"bootstrap-dropdown",
	//
	coreLibPath+"jquery.cookie",
	coreLibPath+"jquery.ba-hashchange",
	//Container libs
	coreLibPath+"jquery.spidermap",
	coreLibPath+"jquery.getwebmethod",
	coreLibPath+"jquery.progressloading",
	coreLibPath+"jquery.getattrs",
	coreLibPath+"jquery.requester",
	coreLibPath+"jquery.preparer",
	coreLibPath+"jquery.validation",
	coreLibPath+"jquery.collapsible",
	coreLibPath+"jquery.genforms",
	coreLibPath+"jquery.layout",
	coreLibPath+"jquery.htpl",
	coreLibPath+"jquery.container",
	"core/func",
	"core/actions"

];

_coreModuleList = _coreModuleList.concat(_appModuleList);
$("body").data("corelibcount",$("body").data("corelibcount") + _coreModuleList.length);



var hashPrefx = "#!/";
var globalHash = "";

var _serverParams = {};
_serverParams = {
	"url"        : '/core/res/php/ajax/request.php?Method=',
	"session"    : false,
	"data"       : {},
	"cache" : true,
	"webmethod"  : "",
	"webservice" : "",

	"client"     : "clientname"
};

var cfgDatepicker = {
	dateFormat: "yy-mm-dd",
	nextText: '',
	prevText: '',
	changeYear: true,
	firstDay: 1,
	showOn: "button",
	buttonImage: "",
	buttonText: "<i class='icon-calendar'></i>",
	buttonImageOnly: false,
	onSelect: function(dateText){
		$(this).parent().find("div.date-viewer").text(dateText);
	}
};

var cfgAutocomplete = {
	minLength : 0,
	focus: function( event, ui ) {
		$(this).val( ui.item.label );
		return false;
	},
	select: function( event, ui ) {
		$(this).val(ui.item.label);
		$(this).closest(".controls").find(".ac_value").val(ui.item.value);

		if($(this).data("methodurl") == undefined) return true;
		var form = $(this).closest("form");
		if($(this).closest(".component-form").length > 0) form = $(this).closest(".component-form");
		var methodurl = $(this).data("methodurl");

		var params = $.extend({},serverParams);
		$.extend(params,$().getwebmethod(methodurl));
		var form = $(this).closest(".component-form");
		var formParams  = form.preparer({"type":"form"});

		$.each(params.data,function(key,value){

			if(formParams[key] != undefined && formParams[key] != "") params.data[key] = formParams[key];

			if(params.data[key] == "" || params.data[key] == null) delete params.data[key];
		});
		var target = $(this).closest(".component-container");
		if($(this).data("target") != undefined) target = $(this).attr("data-target");

		if(typeof(target) !== "object" && $("[name=_ac_"+target+"]").length > 0){

			params.callback = "DoAcList";
			act = $("[name=_ac_"+target+"]");
			if(!act.hasClass("element-autocomplete-server")) act.val("").prop("disabled",true);
			act.requester(params);
		}else{

			if($(this).data("target") != undefined) target = "#" + $(this).data("target");
			params.callback = "GetContainer";
			$(target).requester(params);
		}
		return false;
	}
};
require(_coreModuleList,function(){
	accessToken = ($.cookie("access_token") != null) ? $.cookie("access_token") : "";
	_serverParams.accessToken = accessToken;
	window["init"]();
});
if($.browser.msie && $.browser.version <= 7.0){
	$(window).hashchange(function(){
		getURL();
	});
}else{
	$(window).bind("hashchange",function(){
		getURL();
	});
}

var _modal = $("<div/>").addClass("modal").append(
	$("<div/>").addClass("modal-header").append($("<button/>").attr({"type":"button"}).addClass("close icon-remove").attr("data-dismiss","modal"),$("<h3/>")),
	$("<div/>").addClass("modal-body").append(
		$("<div/>").attr("id","Modal")
	)
);
var _modalHelp = _modal.clone();
_modalHelp.find("#Modal").attr("id","ModalHelp");
$("body").append(_modal,_modalHelp);