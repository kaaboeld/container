/**
 * Created by JetBrains PhpStorm.
 * Date: 12/6/11
 * Version: 0.0.0
 *
 * Author: kaaboeld
 * -Email: kaaboeld@gmail.com
 * -Site:  http://scrw.co
 * Company: Alanov
 * -Site:   http://alanov.ru
 */

(function ($) {
	"use strict";
	$.fn.genforms = function (options) {
		var settings = {
			"template":null,
			"formTags":["input", "select", "textarea", "date"],
			"imgPath":"./res/img/",
			"wrapper":{
				"tag":"",
				"css":"",
				"child":{
					"tag":"",
					"css":""
				}
			},
			"server":{}
		};
		if (options) $.extend(settings, options);
		var template = settings.template;

		if (template == null) return false;

		var badAttrs = ["align", "style"];
		var form = $(this);
		var formTag = form.get(0).tagName.toLowerCase();

		var imgPath = settings.imgPath;

		var dummy = $("<div/>");
		$.each(template, function (k, item) {
			var type = item.Type.toLowerCase();
			var tag = type;
			var name = item.Name;
			var clientId = item.ClientId == undefined ? "" : item.ClientId;
			var value = item.Value;
			var elemParams = {
				"group":false,
				"wrapper":$.extend({}, settings.wrapper)
			};
			var controlGroup = $("<div/>").addClass("control-group");

			var control = $("<div/>").addClass("controls");
			var label = $("<label/>").addClass("control-label");


			var child = {};
			var element;

			// Main build
			switch (type) {
				case "text":
					element = $("<div/>").addClass();
					break;
				case "link":
					var href = "#";
					if (item.Value != "") href = item.Value;
					element = $("<a/>").attr("href", href);
					break;
				case "thumbnail":
					if (formTag == "table") {
						element = $("<tr/>");
						elemParams.wrapper.child.tag = "td";
					} else {
						element = $("<li/>");
					}

					element.addClass("component-form");
					break;

				case "date":
					element = $("<div/>").addClass("input-append").append(
						$("<input/>").addClass("datepicker " + clientId).attr({
							"name":clientId,
							"value":value
						}).addClass("input-small")
					);

					break;
				case "thead":
					element = $("<tr/>");
					elemParams.wrapper.child.tag = "th";
					break;
				case "message":

					if (formTag == "table") {
						element = $("<tr/>");
						elemParams.wrapper.child.tag = "td";
					} else {
						element = $("<li/>");
					}
					element.addClass("component-form");
					break;
				case "group":
					element = $("<ul/>").addClass("element-group-list");
					elemParams.wrapper.child.tag = "li";
					break;
				case "serviceoperator":
					if (formTag == "table") {
						element = $("<tr/>");
						elemParams.wrapper.child.tag = "td";
					} else {
						element = $("<li/>")
					}

					element.addClass("component-form");
					break;
				case "notification":
					if (formTag == "table") {
						element = $("<tr/>");
						elemParams.wrapper.child.tag = "td";
					} else {
						element = $("<li/>")
					}

					element.addClass("component-form");
					break;
				case "report":
					if (formTag == "table") {
						element = $("<tr/>");
						elemParams.wrapper.child.tag = "td";
					} else {
						element = $("<li/>")
					}

					element.addClass("component-form");
					break;
				case "node":
					element = $("<a/>").attr({
						"data-clientid":item.ClientId
					}).addClass("component-menunode");


					elemParams.wrapper.tag = "ul";
					elemParams.wrapper.css = "nav nav-list";
					break;

				default:
					element = $("<" + tag + "/>");
				break;

			}
			// Extend attrs
			if (item.AttrList != undefined) {
				var attrList = {};
				$.each(item.AttrList.Attr, function (k, attr) {
					var key = attr.Key.toLowerCase();
					if (badAttrs.indexOf(key) < 0) attrList[key] = attr._.toLowerCase();

				});
				var attr = element.getAttrs();

				attr["data-serverid"] = item.ServerId;
				$.extend(attr, attrList);
				element.attr(attr);
/*
				if(element.attr("rel") != undefined && element.attr("rel") == "popover"){
					element.popover({
						placement: 'top'
					});
				}*/
				if(attr.id != undefined) element.attr("id",attr.id);
			}

			if (type == "input" && element.attr("type") == undefined) element.attr("type", "text");


			// Set main params of responsive items
			var isValidate = false;
			var isHidden = false;
			var isWrapped = true;
			var isChecked = false;
			var isAppend = false;
			var isDefault = false;
			var isRequired = false;
			var isAutocomplete = false;
			var doCloseModal = true;

			var currency = "";

			if (item.ParamList != undefined) {
				var paramList = {};
				$.each(item.ParamList.Param, function (k, param) {
					paramList[param.Key.toLowerCase()] = param._;
				});
				if (paramList.webmethod != undefined)  element.addClass("action-webmethod").attr("data-methodurl", paramList.webmethod);
				if (paramList.onchange != undefined)  element.addClass("action-webmethod-onchange").attr("data-methodurl", paramList.onchange);
				if (paramList.onbeforewebmethod != undefined) {
					element.addClass("action-onbefore").attr("data-onbeforemethodurl", paramList.onbeforewebmethod);
					if (paramList.onbeforetarget != undefined) element.attr("data-onbeforetarget", paramList.onbeforetarget);
				}
				if (paramList.onbeforewebmethodlocal != undefined) {
					element.addClass("action-onbefore").attr("data-onbeforemethodurl", paramList.onbeforewebmethodlocal);
					if (paramList.onbeforetargetlocal != undefined) element.attr("data-onbeforetarget", paramList.onbeforetargetlocal);
				}
				if (paramList.target != undefined)   element.attr("data-target", paramList.target);
				if (paramList.callback != undefined) element.attr("data-target", paramList.callback);
				if (paramList.inputgroup != undefined)   element.attr("data-group", paramList.inputgroup);
				if (paramList.confirm != undefined)   element.addClass("action-confirmed").attr("data-confirmtext", paramList.confirm);


				if (paramList.wrapper == "0")         isWrapped = Boolean(parseInt(paramList.wrapper));
				if (paramList.hidden != undefined)   isHidden = Boolean(parseInt(paramList.hidden));
				if (paramList.append != undefined)   isAppend = Boolean(parseInt(paramList.append));
				if (paramList.checked != undefined)   isChecked = Boolean(parseInt(paramList.checked));
				if (paramList['default'] != undefined)   isDefault = Boolean(parseInt(paramList['default']));
				if (paramList.required != undefined)   isRequired = Boolean(parseInt(paramList.required));
				if (paramList.autocomplete != undefined)   isAutocomplete = Boolean(parseInt(paramList.autocomplete));

				if (paramList.serverautocomplete != undefined) {
					element.attr("data-serverautocomplete", paramList.serverautocomplete);
				}

				if (paramList.servervalidate != undefined) isValidate = true;
				if (paramList.clientvalidate != undefined) isValidate = true;
				if (paramList.closemodal != undefined)  doCloseModal = Boolean(parseInt(paramList.closemodal));


				if (paramList.currency != undefined)       currency = paramList.currency;


				if (paramList.state != undefined) {
					element.addClass((type == "button" ? "btn-" : "element-state-") + paramList.state.toLowerCase());

					if (type == "button") {
						element.addClass((paramList.state.toLowerCase() == "good") ? "btn-success" : "btn-danger");
					}
				}
			}


			if (!isWrapped) elemParams.wrapper.child.tag = "";
			// Form element configuration
			if (settings.formTags.indexOf(type) != -1) {
				//TODO: add fix for ie7

				element.attr({"name":item.ServerId});
				if (type != "select") {
					element.attr({
						"value":item.Value
					}).val(item.Value);
				}

				if (isValidate) {
					var elValidate = $(element).addClass("element-validate");
					if (type == "date") elValidate = elValidate.find("input.datepicker");

					if (paramList.servervalidate != undefined) {
						elValidate.addClass("action-webmethod-validate").attr({
							"data-methodurlvalidate":paramList.servervalidate,
							"data-eventvalidate":paramList.servervalidateevent
						});
						$(elValidate).bind(paramList.servervalidateevent, function () {
							var field = $(this);
							clearTimeout($(this).data('timeout'));
							$(this).data('timeout', setTimeout(function(){
								console.log(5)
								validation.server(field)
							}, 2000));

						}).data("timeout",null);
					}
					if (paramList.clientvalidate != undefined) {
						var validateRuleList = paramList.clientvalidate.split("_");
						if (validateRuleList.length > 1) {
							$(elValidate).attr("maxlength", validateRuleList[1]);
						}
						if (validateRuleList[0] == "phone" || validateRuleList[0] == "date") $(elValidate).attr("maxlength", 10);
						$(elValidate).attr("data-maskvalidate", validateRuleList[0]);
						$(elValidate).bind("keyup focus", function (e) {
							if (
								e.keyCode != 37 &&
									e.keyCode != 38 &&
									e.keyCode != 39 &&
									e.keyCode != 9 &&
									e.keyCode != 40 &&
									e.keyCode != 13) validation.client($(this));
						});
					}


				}

				elemParams.group = true;
			}
			if (type != "select") {
				element.val(item.Value);
			} else {
				element.attr("data-selected", item.Value);
			}

			if (attr != undefined && attr.type != undefined) {
				controlGroup.addClass("control-group-" + attr.type);
			}

			element.addClass("element-type-" + type);
			if (item.ClientId != "") element.addClass("element-id-" + item.ClientId.toLowerCase());
			if (isAutocomplete && paramList.serverautocomplete == undefined) $(element).val("");

			if (!doCloseModal) element.attr("data-closemodal", 0);

			switch (type) {
				case "script":
					if(attr != undefined && attr.src != undefined) require([attr.src]);
				break;
				case "input":
					label.html(name);
					switch (item.ClientId) {
						case "Amount":
							element = $("<div/>").addClass("input-append").append(element, $("<span/>").addClass("add-on").text("руб."));
							break;
						case  "Phone":
							element = $("<div/>").addClass("input-prepend").append($("<span/>").addClass("add-on").text("+7"), element);
							break;
					}
					break;
				case "textarea":
					label.html(name);
					break;
				case "button":
					element.addClass("btn").text(name);
					break;
				case "text":

					element.html(item.Value);

					if (currency != "" && element.text() != "") {
						element = $("<div/>").append(
							$("<span/>").addClass("amount-text").append(element.text()),
							$("<span/>").addClass("currency-text").append(currency)
						);
					}
					if (item.Name != "") element = $("<div/>").addClass("control-text").append($("<h5/>").html(item.Name), element);

					break;
				case "select":
					label.html(name);
					break;
				case "date":
					label.html(name);

					if (element.attr("data-group") != undefined) {

						element.find("input.datepicker").attr("data-group", element.attr("data-group"));
						if (paramList.list != undefined)  element.find("input.datepicker").addClass(paramList.list.toLowerCase() + "-list");
						if (paramList.datemin != undefined)  element.find("input.datepicker").attr("data-datemin", paramList.datemin);
						if (paramList.datemax != undefined)  element.find("input.datepicker").attr("data-datemax", paramList.datemax);
					}
					break;
				case "node":
					href = hashPrefx + element.attr("data-methodurl");

					if (_appLinkMap[href.replace(hashPrefx, "")]) {
						href = hashPrefx + _appLinkMap[href.replace(hashPrefx, "")].alias;
					}
					element.attr({"href":href});
					element = $("<li/>").append(element.html(item.Name));
					break;
				case "thead":
					element = $("<thead/>").append(element);
					break;
				case "img":
					if (item.Value != undefined && item.Value != "") {
						element.attr("src", imgPath + item.Value.toLowerCase() + ".png").error(function () {
							$(this).attr("src", "/core/res/img/_.gif").addClass("state-img-error");
						});
					}
					break;
				case "table":
					element.prepend($("<caption/>").html(item.Name));
					break;
				case "link":

					if (element.attr("href") == "#" && element.attr("data-methodurl") != undefined) element.attr("href", hashPrefx + element.attr("data-methodurl"));

					element.html(item.Name);
					break;
				default:
					element.html(item.Name);
					break;
			}

			if (type == "table") element.addClass("table");
			if (isAutocomplete) element.addClass("element-autocomplete");

			var isCheckbox = false;
			if (element.attr("type") != undefined && element.attr("type") == "checkbox") isCheckbox = true;
			var wrapTag = "";
			if (elemParams.wrapper.tag != "") wrapTag = elemParams.wrapper.tag;

			var desc = item.Description;
			if (isCheckbox) {

				if (isChecked) $(element).attr("checked", "checked");

				control.append(label.empty().addClass("checkbox").append(element, $("<span/>").append(name)));
			} else {
				if (label.text() != "") controlGroup.append(label);

				if (desc != "" && !isAppend) {
					control.append(element, $("<p/>").addClass("help-block").html(desc));

				} else if (desc != "" && isAppend) {
					control.append($("<div/>").addClass("input-append").append(element, $("<span/>").addClass("add-on").append(desc)));
				} else {
					control.append(element);
				}
			}


			if (elemParams.group) controlGroup.append(control);

			if (isRequired) controlGroup.addClass("control-required");

			if (item.ChildrenList != undefined) {

				var controlList = item.ChildrenList.Control;

				var childTpl = {"template":controlList};

				if (elemParams.wrapper.tag != "") {
					$(element).append($("<" + wrapTag + "/>").addClass(elemParams.wrapper.css));

					$(element).find(wrapTag).genforms(childTpl);
				} else if (elemParams.wrapper.child.tag != "") {

					$(element).genforms({
						"template":controlList,
						"wrapper":$.extend({}, elemParams.wrapper)
					});
				} else if (isCheckbox) {
					$(control).genforms(childTpl);
				} else if (isAutocomplete) {
					var acList = [];
					$.each(controlList, function () {
						acList.push({
							"label":this.Name,
							"value":this.Value
						});
					});
					$(element).data({"aclist":acList});
				} else {
					if (type == "select" && controlList.length == 1) {
						$(element).prop("disabled", true).addClass("disabled");
					}
					$(element).genforms(childTpl);
				}
			} else if (elemParams.wrapper.child.tag != "") {

				wrapTag = elemParams.wrapper.child.tag;

				if (elemParams.group) controlGroup = $("<" + wrapTag + "/>").append(controlGroup);
				else element = $("<" + wrapTag + "/>").append(element);
			}

			var result = elemParams.group ? controlGroup : element;

			if (isHidden) result.addClass("hidden-element");
			if (isDefault) result.addClass("default-element");

			dummy.append(result);

		});
		form.append(dummy.children());

		if (form.find(".element-autocomplete").length > 0) {
			$.each(form.find(".element-autocomplete"), function () {

				var name = $(this).attr("name");
				var serverAutocomplete = ""
				if ($(this).data("serverautocomplete") != undefined) serverAutocomplete = $(this).data("serverautocomplete");
				$(this).attr("name", "_ac_" + name);
				$(this).closest(".controls").append(
					$("<span/>").addClass("ac-chevron").html("&nbsp;"),
					$("<input/>").attr({"name":name, "type":"hidden"}).addClass("ac_value")
				);
				if ($(this).data("aclist") != undefined) {
					var accfg = $.extend({}, cfgAutocomplete, {source:$(this).data("aclist")});
					$(this).autocomplete(accfg);
				} else {
					if (serverAutocomplete == "") $(this).prop("disabled", true);
				}
				if (serverAutocomplete != "") {
					$(this).addClass("element-autocomplete-server");
					$(this).closest(".controls").find(".ac_value").val($(this).val());
				}

			});
		}
		if (form.find("select").length > 0) {
			$.each(form.find("select"), function () {
				if ($(this).attr("data-selected") != undefined && $(this).attr("data-selected") != "") {
					$(this).val($(this).attr("data-selected"));
				}
			});
		}

		if (form.find(".datepicker").length > 0) {
			// Create datepicker
			form.find(".datepicker").datepicker(cfgDatepicker);
			// Create interval selection
			form.find(".datepicker.DateBegin, .datepicker.DateEnd").datepicker("option", "onSelect", function (selectedDate) {
				onDateSelect(selectedDate, $(this));
			});
			// Select default date
			form.find(".datepicker").each(function () {
				$(this).datepicker("setDate", $(this).val());
				onDateSelect($(this).val(), $(this));

				$(this).datepicker("option", "onSelect", function () {
					$(".element-type-date").find("button").addClass("btn");
				});
				if ($(this).hasClass("dates-list")) {
					$(this).datepicker("option", "beforeShowDay", function (date) {
						var unavailableDates = [];
						if ($(this).data("unavailable") != undefined) unavailableDates = $(this).data("unavailable");

						var m = (date.getMonth() + 1);
						var month = (m < 10) ? "0" + m : m;
						var d = date.getDate();
						var day = (d < 10) ? "0" + d : d;
						var dmy = date.getFullYear() + "-" + month + "-" + day;
						if ($.inArray(dmy, unavailableDates) < 0) {
							return [true, "", ""];
						} else {
							return [false, "", "Уже выбрана"];
						}
					});

					$(this).datepicker("option", "onSelect", function () {
						var value = $(this).val();
						var listTable = $(".element-id-datestable");
						if (listTable.find("tbody").length == 0) listTable.append($("<tbody/>"));
						var eq = listTable.find("tbody").find("tr").length;

						var unavailableDates = [];
						if ($(this).data("unavailable") != undefined) unavailableDates = $(this).data("unavailable");
						unavailableDates.push(value);
						$(this).data("unavailable", unavailableDates);

						var input = $("<input/>").addClass("input-small").prop("readonly", true).attr({"name":"Dates[" + eq + "]", "data-group":"FormInputList"}).val(value);
						var tr = $("<tr/>").append(
							$("<td/>").addClass("column-date").append(input.clone()),
							$("<td/>").addClass("column-actions").append($("<button/>").addClass("btn action-remove-tr").append($("<i/>").addClass("icon-remove"))));
						listTable.find("tbody").append(tr.clone());


					});

				}
				if ($(this).data("datemin"))
					$(this).datepicker("option", "minDate", new Date($(this).data("datemin")));

				if ($(this).data("datemax"))
					$(this).datepicker("option", "maxDate", new Date($(this).data("datemax")));
			});
			form.find(".element-type-date>button").addClass("btn");
		}


		var emptyMessage = "Нет данных";
		if (formTag == "table") {
			form.find("thead>tr:empty").remove();
		}

		if (formTag == "table" && form.find("td").length > 0) {

			var isSorted = true;
			var containerData = form.closest(".component-container").data();

			if (containerData != null && containerData.paramlist != undefined && containerData.paramlist.sorting != undefined)
				isSorted = Boolean(parseInt(form.closest(".component-container").data().paramlist.sorting));

			if (isSorted && form.find("tbody").length > 0) form.tablesorter();
		} else if (formTag == "table") {
			form.replaceWith($("<div/>").append(emptyMessage));
		}

		return true;
	};

	function onDateSelect(selectedDate, selector) {
		var showDate = selectedDate.split("-");
		selector.parent().find("div.date-viewer").text(showDate[2] + "." + showDate[1] + "." + showDate[0]);

		var isFrom = selector.hasClass("DateBegin");
		var propertyName = isFrom ? "DateEnd" : "DateBegin";
		var notThis = $(".datepicker." + propertyName);

		var option = isFrom ? "minDate" : "maxDate",
			instance = selector.data("datepicker"),
			date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);

		var notThisOpt = notThis.datepicker("option", option);
		if (notThisOpt != null && notThisOpt - date == 0) {
			return;
		}

		notThis.datepicker("option", option, date);
	}

})(jQuery);
