/* 注册 */
;$('.regBtn').click(function() {
	var flag = false;

	var uname = $('#uname').val(),
		phone = $('#phone').val(),
		validCode = $('#validCode').val(),
		pw = $('#pw').val(),
		regU = /^([a-zA-Z])([a-zA-Z0-9_-]){3,19}$/,
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
	} else if(regPw.exec(pw) == null) {
		alert('密码格式不正确。要求6-20位字符，必须同时含有字母和数字!');
		return false;
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
	var flag = false;
	if(reg.exec($('#phone').val())) {
		var params = {'param': $('#phone').val()};
		Webapp.postLoadData('/auth_checker.do?type=phone', params,
			function(data) {
				console.log(data);
			},
			function(e) {
				console.log(e);
				if(e.responseText == 'y') {
					flag = true;
					console.log('cell phone is not reg, flag is: ' + flag);
				} else {
					alert("手机号码已存在");
					$('#phone').focus();
				}

				if(flag) {
					console.log('flag is: ' + flag);
					if($('#idCode').hasClass('flagCode')) {
						$('.idCode').css({cursor: 'pointer', 'backgroundColor': '#59a4ff'}).removeAttr("disabled");
						$('#idCode').removeClass('flagCode');
					}
				}
		});
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
