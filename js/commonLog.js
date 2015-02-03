/* login input validate */
;function check() {
	var reg_un = /^([a-zA-Z])([a-zA-Z0-9_-]){3,19}|(13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}|18[0-9]{9})$/,
		reg_pw = /^(?![^a-zA-Z]+$)(?!\D+$).{6,20}$/;

	if($('.uname').val() == '' || $('.uname').val() == null) {
		alert('请输入用户名或手机号');
		$('.uname').focus();
		return false;
	} else if(reg_un.exec($('.uname').val()) == null){
		$('.uname').val('');
		alert('请输入4~20位用户名或手机号');
		$('.uname').focus();
		return false;
	} else if((/\s+/g).exec($('.pw').val())) {
		alert('密码不能有空格');
		$('.pw').focus();
		return false;
	} else if($('.pw').val() == '' || $('.pw').val() == null) {
		alert('请输入密码');
		$('.pw').focus();
		return false;
	} else if(reg_pw.exec($('.pw').val()) == null) {
		alert('密码格式不正确');
		$('.pw').focus();
		return false;
	} else {
		return true;
	}
}

/* 登录 */
$('#loginBtn').click(function() {
	if(check()) {
		$('.loading').css('display', 'block');
		$('.mask').css('display', 'block');

		var date = new Date();
		var month = '';
		var day = '';
		if((date.getMonth()+1)<10) {
			month = '0'+(date.getMonth()+1).toString();
		}
		if(date.getDate() < 10) {
			day = '0' + date.getDate().toString();
		}
		date = date.getFullYear() + '-' + month + '-' + day;

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
				alert(e.desc);
				$('.loading').css('display', 'none');
				$('.mask').css('display', 'none');
				window.location.href = '/wap/sign-in.html';
		});	
	} else {
		console.log('login validate error'); //for test
	}
});

/* 根据手机号获取一个多个用户名 */
$('.pw').focus(function() {
	var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}|18[0-9]{9}$/,
		html = '';

	if(reg.exec($('.uname').val()) != null) {

		var params = {'param': $('.uname').val()};
		Webapp.postLoadData('/auth_checker.do?type=phone', params,
			function(data) {
				console.log(data);
			},
			function(e) {
				console.log(e);
				if(e.responseText == 'y') {
					alert("手机号码未注册");
					$('.uname').focus();
					return false;
				} else {				
					return false;
				}
		});

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
						for(;i < result.count;i++) {
							html += '<i>' + list[i] + '</i>';
						}
						html += '</aside>';
						$('.userIdBox').html('').html(html).show().prev().show();
					}
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
