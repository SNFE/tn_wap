'use strict';

;var Webapp = {};

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

/* 登出 */
function logout() {
    Webapp.postLoadData('/auth.do', {'method': 'logout'},
        function(data) {
            window.location.href = '/wap/sign-in.html';
        }, 
        function(e) {
           
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
		$("article",this).slideToggle(200);
		$(this).toggleClass("open");
	});

    var appLink = '';
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
            result = 'Other';
        }

        if(userAgent.match(/iPhone|iPad/i)) {
            appLink = 'http://um0.cn/8ArgH/';
        } else if(userAgent.match(/Android/i)) {
            appLink = 'http://file.touna.cn/app/touna_licai_gwwap.apk';
        } else {
            appLink = 'http://file.touna.cn/app/touna_licai_gwwap.apk';
        }
        
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

    dectectBroswer();

    $('a.app-link').attr("href", appLink);

    $('a.appDownloadBar').attr("href", appLink);
});
