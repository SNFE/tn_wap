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

/* login input validate */
function check() {
	var reg_un = /[a-zA-Z0-9_-]{4,20}/g;
	//var	reg_pw = /[]/g;

	if($('.uname').val() == '' || $('.uname').val() == null) {
		alert('请输入用户名');
		$('.uname').focus();
		return false;
	} else if(reg_un.exec($('.uname').val()) == null){
		$('.uname').val('');
		alert('请输入4~20位用户名');
		$('.uname').focus();
		return false;
	} else if($('.pw').val() == '' || $('.pw').val() == null) {
		alert('请输入密码');
		$('.pw').focus();
		return false;
	} else {
		return true;
	}
	//TODO -> more validate..
}

/* reg input check */
/*function regCheck(value, selector) {
	var reg = '';
	if(selector == 'uname') {
		reg = /^([\u4E00-\u9FA5\uf900-\ufa2d]|[a-zA-Z])([\u4E00-\u9FA5\uf900-\ufa2d\.\·]|[a-zA-Z0-9_-]){3,19}$/;

	}
}*/

/* get user info */
function getAccount() {
	Webapp.postLoadData('/account.do', {'method': 'loadAccountInfo'},
        function(data) {
            console.log(data);
            $('.uname').html(data.result.user.username);
			$('.use-money').html(data.result.account.use_money.toFixed(2) + '元');
        }, 
        function(e) {
            console.log(e);
    });

    Webapp.postLoadData('/account.do', {'method': 'loadProfitInfo'},
        function(data) {
            console.log(data);
            $('.total').html(data.result.account.total_money + '元');
            $('.profile-money').html(data.result.profit.total_in_money + '元');
        }, 
        function(e) {
            console.log(e);
    });

    Webapp.postLoadData('/virtual.do', {'method': 'getProfitForApp'},
        function(data) {
            console.log(data);
            $('.jin-money').html(data.result.result.useMoney.toFixed(2) + '元');
            $('.exp-profile-money').html(data.result.result.interest.toFixed(2) + '元');
            $('.phone').html(data.result.phone);
        }, 
        function(e) {
            console.log(e);
    });
}

$(function(){

	/* 更多理财产品滚动 */
	ivtProdListSlide();
	
	/* header全局menu下拉框 */
	/*$("header .menu").click(function(){
		$("div",this).slideToggle(200)
	});*/
	
	/* 投哪APP下载bar */
	$(".appDownloadBar i").click(function(){
		$(".appDownloadBar").fadeOut()
	});
	
	/* 用户选择用户名 下拉框 */
	$(".userIdBox").click(function(){
		$("aside",this).slideToggle();
		$(this).toggleClass("userIdBoxOpen");
	});
	
	/*$(".userIdBox i").each(function(){
		$(this).click(function(evt){
			evt.stopPropagation();
			$(".userIdBox em").text($(this).text());
			$(".userIdBox aside").slideUp();
			$(".userIdBox").toggleClass("userIdBoxOpen");
		})
	});*/
	
	/* 用户体验金bar */
	$(".xpRules").click(function(){
		$("article",this).slideToggle();
		$(this).toggleClass("xpRulesOpen");
	});
		
	/* 投哪指南 内容页下拉  +  资费说明 详细内容下拉 */
	$(".guideLineQApage .guideLineQA li,.expense > div").click(function(){
		$(".guideLineQApage .guideLineQA li article,.expense > div article").not($("article",this)).slideUp();
		$(".guideLineQApage .guideLineQA li,.expense > div").not($(this)).removeClass("open");
		$("article",this).slideToggle();
		$(this).toggleClass("open");
	});

	/* 登录 */
	$('#loginBtn').click(function() {
		if(check()) {
			var date = new Date();
			date = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate();

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

			/* login */
			var paramss = {
				'method': 'login',
				'username': $('.uname').val(),
				'md5Pwd': $.md5($('.pw').val())
			}

			Webapp.postLoadData('/auth.do', paramss,
				function(data) {
					console.log(data);
					window.location.href = '/wap/user-account.html';
				}, 
				function(e) {
					console.log(e.desc);
			});
		} else {
			console.log('login validate error'); //for test
		}
	});

	/* 注册 */
	$('.regBtn').click(function() {
		var flag = false;

		var uname = $('#uname').val(),
			phone = $('#phone').val(),
			validCode = $('#validCode').val(),
			pw = $('#pw').val(),
			regU = /^([\u4E00-\u9FA5\uf900-\ufa2d]|[a-zA-Z])([\u4E00-\u9FA5\uf900-\ufa2d\.\·]|[a-zA-Z0-9_-]){3,19}$/,
			regP = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}|18[0-9]{9}$/,
			regC = /^[0-9a-zA-Z]{6}$/,
			regPw = /^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/;
		if(regU.exec(uname) == null) {
			alert('请输入正确的用户名!');
			return false;
		} else if(regP.exec(phone) == null) {
			alert('请输入正确的手机号码!');
			return false;
		} else if(regC.exec(validCode) == null) {
			alert('请输入正确的验证码!');
			return false;
		} else if(regP.exec(phone) == null) {
			alert('请输入正确的手机号码!');
			return false;
		} else if(pw == '') {
			alert('请输入密码!');
			return false;
			if(regPw.exec(pw) == null) {
				alert('密码格式不正确。要求6-20位字符，必须同时含有字母和数字!');
				return false;
			}
		} else if($('#pw-confirm').val() != pw) {
			alert('两次密码不一致!');
			return false;
		}else {
			flag = true;
		}

		if(flag) {
			/* reg */
			var params = {
				'method': 'registerByPhone',
				'username': uname,
				'md5Pwd': $.md5(pw),
				'phone': phone,
				'channel': 'wap',
				'phoneCode': validCode,
				'smsRandom': smsRandom
			}

			Webapp.postLoadData('/auth.do', params,
				function(data) {
					$('.regBtn').attr('disabled','disabled').css({cursor: 'default',background:"rgb(182, 184, 185)"});
					console.log(data);

					/* collect */
					var visitdate = new Date();
					visitdate = visitdate.getFullYear() + '-' + visitdate.getMonth()+1 + '-' + visitdate.getDate();

					var params = {
						'method': 'addAppMobileUserView',
						'visitdate': visitdate,
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

					window.location.href = '/wap/user-account.html';
				},
				function(e) {
					console.log(e);
					alert(e.desc);
					$('.regBtn').css({cursor: 'pointer', 'backgroundColor': '#59a4ff'}).removeAttr("disabled");
			});
		} else {
			alert('注册失败');
			$('.regBtn').css({cursor: 'pointer', 'backgroundColor': '#59a4ff'}).removeAttr("disabled");
		}
	});

	$('#validCode').focus(function() {
		var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}|18[0-9]{9}$/;
		var flag = true;
		if(reg.exec($('#phone').val())) {
			if($('#idCode').hasClass('flagCode')) {
				$('.idCode').css({cursor: 'pointer', 'backgroundColor': '#59a4ff'}).removeAttr("disabled");
				$('#idCode').removeClass('flagCode');
			}
		} else {
			alert("请填写手机号码");
			$('#phone').focus();
		}
	});
	
	var smsRandom = '';
	/* reg phone msg */
	$("#idCode").click(function(){
		var params = {
			'smsType': 'register',
			'smsPhone': $('#phone').val(),
			'joinType': 'wap'
		}

		Webapp.postLoadData('/smsApi.do', params,
			function(data) {
				console.log(data);
				smsRandom = data.smsRandom;
			},
			function(e) {
				console.log(e);

		});

		/* 发送验证码 倒计时 */
		var totaltime = 120;

		function auto() {
			totaltime--;
			if (totaltime > 0) {
				$(".idCodeBox .idCode").css("background","rgb(182, 184, 185)");
				$(".idCodeBox .idCode").val( totaltime + ' 秒' ).attr('disabled','disabled').css({cursor: 'default'});
			} else {
				$(".idCodeBox .idCode").css("background","#59a4ff");
				$('#idCode').addClass('flagCode');
				$(".idCodeBox .idCode").val('重新获取验证码').removeAttr('disabled').css({cursor: 'pointer'});
				clearInterval(t);
				/*$(".idCodeBox .idCode").one("click", function(){
					idCode60();
				});*/
			};
		};
		var t = setInterval(auto, 1000);
	});

	/* 根据手机号获取一个多个用户名 */
	$('.pw').focus(function() {
		var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}|18[0-9]{9}$/,
			html = '';
		if(reg.exec($('.uname').val()) != null) {
			var params = {
				'method': 'appPhoneQueryForApp',
				'phone': $('.uname').val()
			}

			Webapp.postLoadData('/auth.do', params,
				function(data) {
					console.log(data);
					//->> test result: {"method":"appPhoneQuery","result":{"count":3,"list":{"47345":"fsdfsd","47348":"test2","47349":"test3"}},"status":200,"subtime":"1422494625928"}
					var result = data.result,
						list = result.list;
					if(list) {
						if(result.count > 1) {
							html = '<em>' + list[0] + '</em><aside>';
							var i = 1
							for(;i<result.count;i++) {
								html += '<i>' + list[i] + '</i>';
							}
							html += '</aside>';
						}

						$('.userIdBox').html('').html(html).show().prev().show();
					}

					$(".userIdBox i").each(function(){
						$(this).click(function(evt){
							evt.stopPropagation();
							$(".userIdBox em").text($(this).text());
							$('.uname').val($(this).text());
							$(".userIdBox aside").slideUp();
							$(".userIdBox").toggleClass("userIdBoxOpen");
						})
					});
				}, 
				function(e) {
					console.log(e);
			});

			
		} else {
			console.log("not a phone number");
			return false;
		}
		
	});
});
