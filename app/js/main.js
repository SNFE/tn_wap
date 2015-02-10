'use strict';

var $ = require('jquery');

// 使用 Amaze UI 源码中的模块
//var addToHome = require('../../node_modules/amazeui/js/ui.add2home');

// 使用 NPM 中的模块
//var detector = require('detector');

$(function() {
	/*$('#browser-info').append('浏览器信息：<pre>' +
	JSON.stringify(detector.browser) +
	'</pre>'
	);

	addToHome();*/

  	//header全局menu下拉框 
	$('header .menu').click(function() {
		$('div',this).slideToggle('200');
	});

});

