'use strict';

var Webapp = {};

Webapp.postLoadData = function(url, data, success, error) {
	var timeOut = true;
	if (data && (typeof(data) == "object")) {
		data.subtime = new Date().getTime();
	} else {
		data = {
			subtime: (new Date().getTime())
		};
	}
	setTimeout(function() {
		if (timeOut && error) error(0);
	}, 10000);
	$.ajax({
		"url": url,
		"data": data,
		"type": "post",
		"success": function(rtnData) {
			timeOut = false;
			if (rtnData.status == 302) {
				alert(rtnData.desc);
			} else if (rtnData.status == 200) {
				if (success) {
					success(rtnData);
				}
			} else {
				if (error) {
					error(rtnData);
				} else {
					console.log(e);
				}
			}
		},
		"error": function(rtnData, t, tt) {
			timeOut = false;
			if (error) {
				error(rtnData)
			} else {
				alert('服务繁忙');
			}
		},
		dataType: "json"
	});
}

/* 更多理财产品滚动 */
function ivtProdListSlide(){
	var	liMr = parseInt($(".ivtProdList li").css("marginRight")),
		liWidth = parseInt($(".ivtProdList li").outerWidth()) + liMr,
		totalWidth = liWidth * $(".ivtProdList li").size(),
		boxWidth = $(".investmentProduct").width();
	
	$(".ivtProd-next-btn").click(function(){
		if( parseInt($(".ivtProdList").css("left")) <= (-totalWidth) + boxWidth + liMr ){
			$(".ivtProdList").animate({
				left : 0
			})
		}else{
			$(".ivtProdList").animate({
				left : '-='+liWidth
			})
		}
	});
	
	$(".ivtProd-prev-btn").click(function(){
		if( $(".ivtProdList").css("left") >= '0px' ){
			$(".ivtProdList").animate({
				left : boxWidth - totalWidth + liMr
			})
		}else{
			$(".ivtProdList").animate({
				left : '+='+liWidth
			})
		}
	});
	
	/* 更多理财产品Tab */
	$(".ivtProdCon").eq(0).show()
	$(".ivtProdList li").each(function(idx){
		$(this).click(function(){
			$(".ivtProdList li").removeClass("cur");
			$(this).addClass("cur");
			$(".ivtProdCon").hide();
			$(".ivtProdCon").eq(idx).show()
		})
	});
};

/* 检测浏览器 */
function dectectBroswer() {
	var userAgent = navigator.userAgent,
		result = '';

	if(userAgent.match(/Chrome/i)) {
	 	result = 'Chrome';
	} else if(userAgent.match(/Firefox/i)) {
	 	result = 'Firefox';
	} else if(userAgent.match(/Mobile\/[0-9A-z]{6,10} Safari/i)) {
	 	result = 'Mobile Safari';
	} else if(userAgent.match(/Android/i)) {
	 	result = 'Android';
	} else if(userAgent.match(/ucweb/i)) {
	 	result = 'UCWeb';
	} else if(userAgent.match(/MQQBrowser/i)) {
	 	result = 'QQBrowser';
	} else if(userAgent.match(/Windows Phone/i)) {
	 	result = 'Windows Phone';
	} else {
	    document.write('<p>' + navigator.userAgent + '</p>');
	}

	//console.log(result);
	/*$.ajax({
		'url': '/appMobile.do',
		'type': 'post',
		'data': {
			'method': 'addAppMobileUser',
			'browerType': result,
			'regcount': '1',
			'subtime': new Date().getTime()
		},
		success: function(data) {
			console.log(data);
		},
		error: function(e) {
			console.log(e);
		}
	});*/
	
	var params = {
		'method': 'addAppMobileUser',
		'browerType': result,
		'regcount': '1',
	}

	Webapp.postLoadData('/appMobile.do', params,
		function(data) {
			console.log(data);
		},
		function(e) {
			console.log(e);
	});
}

/* 获取验证码 60秒倒计时 */
function idCode60() {
	var totaltime = 60;
	function auto() {
		totaltime--;
		if (totaltime > 0) {
			$(".idCodeBox .idCode").css("background","#ccc");
			$(".idCodeBox .idCode").html( totaltime + ' 秒' );
		} else {
			$(".idCodeBox .idCode").css("background","#59a4ff");
			$(".idCodeBox .idCode").html('获取验证码');
			clearInterval(t);
			$(".idCodeBox .idCode").one("click", function(){
				idCode60();
			});
		};
	};
	var t = setInterval(auto, 1000);
};

/* input validate */
function check() {
	var reg = /[a-zA-Z0-9_-]{6,13}/g;

	if($('.uname').val() == '' || $('.uname').val() == null) {
		alert('请输入用户名');
		$('.uname').focus();
		return false;
	} else if(reg.exec($('.uname').val()) == null){
		$('.uname').val('');
		alert('请输入6~13位用户名');
		$('.uname').focus();
		return false;
	} else {
		return true;
	}

	//TODO -> more validate..
}

$(function(){

	/* 更多理财产品滚动 */
	ivtProdListSlide();
	
	/* header全局menu下拉框 */
	$("header .menu").click(function(){
		$("div",this).slideToggle(200)
	});
	
	/* 投哪APP下载bar */
	$(".appDownloadBar i").click(function(){
		$(".appDownloadBar").fadeOut()
	});
	
	/* 用户选择用户名 下拉框 */
	$(".userIdBox").click(function(){
		$("aside",this).slideToggle();
		$(this).toggleClass("userIdBoxOpen");
	});
	
	$(".userIdBox i").each(function(){
		$(this).click(function(evt){
			evt.stopPropagation();
			$(".userIdBox em").text($(this).text());
			$(".userIdBox aside").slideUp();
			$(".userIdBox").toggleClass("userIdBoxOpen");
		})
	});
	
	/* 用户体验金bar */
	$(".xpRules").click(function(){
		$("article",this).slideToggle();
		$(this).toggleClass("xpRulesOpen");
	});
	
	/* 发送验证码 倒计时 */
	$(".idCodeBox .idCode").one("click", function(){
		idCode60();
	});
	
	/* 投哪指南 内容页下拉  +  资费说明 详细内容下拉 */
	$(".guideLineQApage .guideLineQA li,.expense > div").click(function(){
		$(".guideLineQApage .guideLineQA li article,.expense > div article").not($("article",this)).slideUp();
		$(".guideLineQApage .guideLineQA li,.expense > div").not($(this)).removeClass("open");
		$("article",this).slideToggle();
		$(this).toggleClass("open");
	});

	/* 登录 */
	$('.loginBtn').click(function() {
		if(check()) {
			var date = new Date();
			date = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

			var params = {
				'method': 'addAppMobileUserView',
				'visitdate': date,
				'regcount': '0',
				'logcount': '1',
				'username': $('.uname').val()
			}

			Webapp.postLoadData('/appMobile.do', params,
				function(data) {
					console.log(data);
				},
				function(e) {
					console.log(e);
			});
		} else {
			console.log('else condition'); //for test
		}
	});

	$('.regBtn').click(function() {
		if(check()) {
			var date = new Date();
			date = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

			var params = {
				'method': 'addAppMobileUserView',
				'visitdate': date,
				'regcount': '1',
				'logcount': '0',
				'username': $('.uname').val()
			}

			Webapp.postLoadData('/appMobile.do', params,
				function(data) {
					console.log(data);
				},
				function(e) {
					console.log(e);
			});
		} else {
			console.log('else condition'); //for test
		}
	});
});
