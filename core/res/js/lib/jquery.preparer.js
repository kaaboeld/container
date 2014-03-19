/**
 * Created by JetBrains PhpStorm.
 * Date: 11/7/11
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
	$.fn.preparer = function (options) {
		var settings = {
			type:"date",
			disabled:true,
			pattern:"",
			date:{
				separators:[".", "-", "_", "/"],
				input:{
					// TODO: remove date value to top
					value:"1.12.11",
					isMonthFirst:undefined
				},
				output:{
					format:"dd MM yyyy",
					friendly:true
				}
			}
		};

		// Merge extended options
		if (options) $.extend(true, settings, options);

		var result = null;

		switch (settings.type) {
		/**
		 * Conver string to date
		 */
			case "date":
				var date;
				if (settings.date.input.format != undefined) {
					date = Date.parseDate(settings.date.input.value, settings.date.input.format);
				} else {
					// Separate date
					for (var i = 0; i < settings.date.separators.length; i++) {
						date = settings.date.input.value.split(settings.date.separators[i]);
						if (date.length == 3) {
							// Parse date parts to Int for speed up operations of preparing
							for (var j = 0; j < 3; j++) {
								date[j] = parseInt(date[j], 10);
								if (isNaN(date[j])) continue;
							}

							break;
						}
					}
					// Failed to separate date
					if (date == undefined) {

						return false;
					}

					// Interchange day and month, if need
					if ((date[1] > 12 && settings.date.input.isMonthFirst == undefined) ||
						(settings.date.input.isMonthFirst != undefined && settings.date.input.isMonthFirst)) {
						date[0] += date[1];
						date[1] = date[0] - date[1];
						date[0] -= date[1];
					}

					// Add century, if not set
					if (date[2] < 100) date[2] += 2000;

					// Failed to detect day/month
					if (date[0] > 31 || date[1] > 12 ||
						date[0] < 1 || date[1] < 1 || date[2] < 0) {

						return false;
					}

					date = new Date(date[1] + "/" + date[0] + "/" + date[2]);
				}


				$("body").append("Date: " + date.format(settings.date.output.format, settings.date.output.friendly));

				break;
		/**
		 * Convert object to array if need
		 */
			case "list":
				var list = [];
				if ($.isArray(this)) list = this;
				else list.push(this);

				result = list;
				break;
		/**
		 * Conver string to array
		 */
			case "strtolist":
				var list = this.split(settings.pattern);
				if (list[list.length - 1] == "") delete list[list.length - 1];
				result = list;
				break;
		/**
		 * Prerare form data for send server request
		 */
			case "form":

				var fieldArray = this.find("input,select,textarea");
				var count = fieldArray.length;

				var asoccArr = {};

				if (count > 0) {

					for (var i = 0; i < count; i++) {
						var item = fieldArray.eq(i);

						var isChecked = true;
						if (item.is(":checkbox") && !item.prop("checked")) isChecked = false;
						if (item.is(":radio") && !item.prop("checked")) isChecked = false;
						//TODO: add fix for ie7
						if (item.attr("name") == undefined) return false;
						var name = item.attr("name");
						var key = "";
						var val = item.val();

						key = name;

						if (item.attr("data-group") != undefined) {
							var valGroup = {};
							var keyGroup = item.attr("data-group");

							if (asoccArr[keyGroup] == undefined) asoccArr[keyGroup] = [];
							if (isChecked && val != "") asoccArr[keyGroup].push({"Key":key, "_":val});


						} else {

						}
						if (asoccArr[key] == undefined && isChecked) asoccArr[key] = val;


						//}

					}
				}
				result = asoccArr;

				break;
		}
		return result;
	}
})(jQuery);

/**
 * Date and time patterns
 * yyyy = year
 * MM = month
 * MMM = month abbreviation (Jan, Feb … Dec)
 * MMMM = long month (January, February … December)
 * ddd = day of the week in words (Monday, Tuesday … Sunday)
 * dd = day
 * hh = hour in am/pm (1-12)
 * HH = hour in day (0-23)
 * mm = minute
 * ss = second
 * a = am/pm marker
 * SSS = milliseconds
 */
window.Date.prototype.format = function (format, friendly) {
	if (format == undefined) return this;

	var daysInWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
	var shortMonthsInYear = ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"];
	var longMonthsInYear = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
	var friendlyNames = {
		"-31":"Месяц назад",
		"-30":"Месяц назад",
		"-7":"Неделю назад",
		"-2":"Позавчера",
		"-1":"Вчера",
		"0":"Сегодня",
		"1":"Завтра",
		"2":"Поселзавтра",
		"7":"Через неделю",
		"-30":"Через месяц",
		"-31":"Через месяц"
	}

	var pattern = "";
	var retValue = "";

	var year = this.getFullYear(),
		month = this.getMonth(),
		dayOfMonth = this.getDate(),
		dayOfWeek = this.getDay();

	var hour = this.getHours(),
		minute = this.getMinutes(),
		second = this.getSeconds(),
		millis = this.getMilliseconds();

	if (friendly) {
		var now = new Date();
		var diff = Math.ceil((this - now) / (1000 * 60 * 60 * 24));
		if (friendlyNames[diff + ""] != undefined) return friendlyNames[diff + ""];
	}

	for (var i = 0; i < format.length; i++) {
		var currentPattern = format.charAt(i);
		pattern += currentPattern;
		switch (pattern) {
			case "ddd":
				retValue += daysInWeek[dayOfWeek];
				pattern = "";
				break;
			case "dd":
				if (format.charAt(i + 1) == "d") {
					break;
				}
				if (String(dayOfMonth).length === 1) {
					dayOfMonth = '0' + dayOfMonth;
				}
				retValue += dayOfMonth;
				pattern = "";
				break;
			case "MMMM":
				retValue += shortMonthsInYear[month];
				pattern = "";
				break;
			case "MMM":
				if (format.charAt(i + 1) === "M") {
					break;
				}
				retValue += longMonthsInYear[month];
				pattern = "";
				break;
			case "MM":
				if (format.charAt(i + 1) == "M") {
					break;
				}
				month++;
				if (String(month).length === 1) {
					month = '0' + month;
				}
				retValue += month;
				pattern = "";
				break;
			case "yyyy":
				retValue += year;
				pattern = "";
				break;
			case "yy":
				if (format.charAt(i + 1) == "y" &&
					format.charAt(i + 2) == "y") {
					break;
				}
				retValue += String(year).slice(-2);
				pattern = "";
				break;
			case "HH":
				retValue += hour;
				pattern = "";
				break;
			case "hh":
				// time.hour is "00" as string == is used instead of ===
				hour = (hour == 0 ? 12 : hour < 13 ? hour : hour - 12);
				hour = String(hour).length == 1 ? '0' + hour : hour;
				retValue += hour;
				pattern = "";
				break;
			case "h":
				if (format.charAt(i + 1) == "h") {
					break;
				}
				hour = (hour == 0 ? 12 : hour < 13 ? hour : hour - 12);
				retValue += hour;
				pattern = "";
				break;
			case "mm":
				retValue += minute;
				pattern = "";
				break;
			case "ss":
				// ensure only seconds are added to the return string
				retValue += (second < 10 ? "0" : "") + second;
				pattern = "";
				break;
			case "SSS":
				retValue += (millis < 10 ? "00" : millis < 100 ? "0" : "") + millis;
				pattern = "";
				break;
			case "a":
				retValue += hour >= 12 ? "PM" : "AM";
				pattern = "";
				break;
			case " ":
				retValue += currentPattern;
				pattern = "";
				break;
			case "/":
				retValue += currentPattern;
				pattern = "";
				break;
			case ":":
				retValue += currentPattern;
				pattern = "";
				break;
			default:
				if (pattern.length === 2 && pattern.indexOf("y") !== 0 && pattern != "SS") {
					retValue += pattern.substring(0, 1);
					pattern = pattern.substring(1, 2);
				} else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
					pattern = "";
				}
		}
	}

	return retValue;
};

/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, version 2.1.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 */

Date.parseFunctions = {count:0};
Date.parseRegexes = [];

/**
 * Date and time patterns
 * ---- Year ----
 * Y - A full numeric representation of a year, 4 digits
 * y - A two digit representation of a year
 * ---- Month ----
 * F - long month (January, February … December)
 * m, n - Numeric representation of a month
 * M - month abbreviation (Jan, Feb … Dec)
 * ---- Day ----
 * d, j - Day of the month
 * D - A textual representation of a day of the week
 * l - A full textual representation of the day of the week
 * N - ISO-8601 numeric representation of the day of the week(1 - 7)
 * w - Numeric representation of the day of the week
 * z - The day of the year
 * ---- Time ----
 * g, G, h, H - hours
 * i - Minutes
 * s - Seconds
 * a - Lowercase am and pm
 * A - Uppercase am and pm
 */
Date.parseDate = function (input, format) {
	if (Date.parseFunctions[format] == null) {
		Date.createParser(format);
	}
	var func = Date.parseFunctions[format];
	return Date[func](input);
};

Date.createParser = function (format) {
	var funcName = "parse" + Date.parseFunctions.count++;
	var regexNum = Date.parseRegexes.length;
	var currentGroup = 1;
	Date.parseFunctions[format] = funcName;

	var code = "Date." + funcName + " = function(input){\n"
		+ "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n"
		+ "var d = new Date();\n"
		+ "y = d.getFullYear();\n"
		+ "m = d.getMonth();\n"
		+ "d = d.getDate();\n"
		+ "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
		+ "if (results && results.length > 0) {";
	var regex = "";

	var special = false;
	var ch = '';
	for (var i = 0; i < format.length; ++i) {
		ch = format.charAt(i);
		if (!special && ch == "\\") {
			special = true;
		}
		else if (special) {
			special = false;
			regex += String.escape(ch);
		}
		else {
			var obj = Date.formatCodeToRegex(ch, currentGroup);
			currentGroup += obj.g;
			regex += obj.s;
			if (obj.g && obj.c) {
				code += obj.c;
			}
		}
	}

	code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
		+ "{return new Date(y, m, d, h, i, s);}\n"
		+ "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
		+ "{return new Date(y, m, d, h, i);}\n"
		+ "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n"
		+ "{return new Date(y, m, d, h);}\n"
		+ "else if (y > 0 && m >= 0 && d > 0)\n"
		+ "{return new Date(y, m, d);}\n"
		+ "else if (y > 0 && m >= 0)\n"
		+ "{return new Date(y, m);}\n"
		+ "else if (y > 0)\n"
		+ "{return new Date(y);}\n"
		+ "}return null;}";

	Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");
	eval(code);
};

Date.formatCodeToRegex = function (character, currentGroup) {
	switch (character) {
		case "D":
			return {g:0,
				c:null,
				s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};
		case "j":
		case "d":
			return {g:1,
				c:"d = parseInt(results[" + currentGroup + "], 10);\n",
				s:"(\\d{1,2})"};
		case "l":
			return {g:0,
				c:null,
				s:"(?:" + Date.dayNames.join("|") + ")"};
		case "S":
			return {g:0,
				c:null,
				s:"(?:st|nd|rd|th)"};
		case "w":
			return {g:0,
				c:null,
				s:"\\d"};
		case "z":
			return {g:0,
				c:null,
				s:"(?:\\d{1,3})"};
		case "W":
			return {g:0,
				c:null,
				s:"(?:\\d{2})"};
		case "F":
			return {g:1,
				c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n",
				s:"(" + Date.monthNames.join("|") + ")"};
		case "M":
			return {g:1,
				c:"m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n",
				s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};
		case "n":
		case "m":
			return {g:1,
				c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
				s:"(\\d{1,2})"};
		case "t":
			return {g:0,
				c:null,
				s:"\\d{1,2}"};
		case "L":
			return {g:0,
				c:null,
				s:"(?:1|0)"};
		case "Y":
			return {g:1,
				c:"y = parseInt(results[" + currentGroup + "], 10);\n",
				s:"(\\d{4})"};
		case "y":
			return {g:1,
				c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
					+ "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
				s:"(\\d{1,2})"};
		case "a":
			return {g:1,
				c:"if (results[" + currentGroup + "] == 'am') {\n"
					+ "if (h == 12) { h = 0; }\n"
					+ "} else { if (h < 12) { h += 12; }}",
				s:"(am|pm)"};
		case "A":
			return {g:1,
				c:"if (results[" + currentGroup + "] == 'AM') {\n"
					+ "if (h == 12) { h = 0; }\n"
					+ "} else { if (h < 12) { h += 12; }}",
				s:"(AM|PM)"};
		case "g":
		case "G":
		case "h":
		case "H":
			return {g:1,
				c:"h = parseInt(results[" + currentGroup + "], 10);\n",
				s:"(\\d{1,2})"};
		case "i":
			return {g:1,
				c:"i = parseInt(results[" + currentGroup + "], 10);\n",
				s:"(\\d{1,2})"};
		case "s":
			return {g:1,
				c:"s = parseInt(results[" + currentGroup + "], 10);\n",
				s:"(\\d{2})"};
		case "O":
			return {g:0,
				c:null,
				s:"[+-]\\d{4}"};
		case "T":
			return {g:0,
				c:null,
				s:"[A-Z]{3}"};
		case "Z":
			return {g:0,
				c:null,
				s:"[+-]\\d{1,5}"};
		default:
			return {g:0,
				c:null,
				s:String.escape(character)};
	}
};

String.escape = function (string) {
	return string.replace(/('|\\)/g, "\\$1");
};

Date.y2kYear = 50;
Date.monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
Date.dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
Date.monthNumbers = {
	Jan:0,
	Feb:1,
	Mar:2,
	Apr:3,
	May:4,
	Jun:5,
	Jul:6,
	Aug:7,
	Sep:8,
	Oct:9,
	Nov:10,
	Dec:11
};
Date.patterns = {
	ISO8601LongPattern:"Y-m-d H:i:s",
	ISO8601ShortPattern:"Y-m-d",
	ShortDatePattern:"n/j/Y",
	LongDatePattern:"l, F d, Y",
	FullDateTimePattern:"l, F d, Y g:i:s A",
	MonthDayPattern:"F d",
	ShortTimePattern:"g:i A",
	LongTimePattern:"g:i:s A",
	SortableDateTimePattern:"Y-m-d\\TH:i:s",
	UniversalSortableDateTimePattern:"Y-m-d H:i:sO",
	YearMonthPattern:"F, Y"
};