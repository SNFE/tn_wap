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

//coll - begin
var adsFollow = function(utm_source, utm_medium, utm_term, utm_content, utm_campaign) {
    var args = {
    	"method":"adsFollowRegester",
    	"utmSource":utm_source,
    	"utmMedium":utm_medium,
    	"utmTerm":utm_term,
    	"utmContent":utm_content,
    	"utmCampaign":utm_campaign
    };

    Webapp.postLoadData('/auth.do', args,
        function(data) {}, 
        function(e) {}
    );
}

function getUrl(n) {        
	var hrefstr, pos, parastr, para, tempstr;
    hrefstr = window.location.href;
    pos = hrefstr.indexOf("?");
    parastr = hrefstr.substring(pos + 1);
    para = parastr.split("&");
    tempstr = "";
    for (var i = 0; i < para.length; i++) {
        tempstr = para[i];
        pos = tempstr.indexOf("=");
        if (tempstr.substring(0, pos).toLowerCase() == n.toLowerCase()) {
            return decodeURIComponent(tempstr.substring(pos + 1));
        }
    }        
    return null;
}

function getPrevUrl(n) {
	var prevUrl, pos, parastr, para, tempstr;
	prevUrl = document.referrer;
	pos = prevUrl.indexOf("?");
    parastr = prevUrl.substring(pos + 1);
    para = parastr.split("&");
    tempstr = "";
    for (var i = 0; i < para.length; i++) {
        tempstr = para[i];
        pos = tempstr.indexOf("=");
        if (tempstr.substring(0, pos).toLowerCase() == n.toLowerCase()) {
            return decodeURIComponent(tempstr.substring(pos + 1));
        }
    }
    return null;
}

/* 登出 */
function logout() {
    Webapp.postLoadData('/auth.do', {'method': 'logout'},
        function(data) {
            window.location.href = '/wap/sign-in.html';
        }, 
        function(e) {
           
        }
    );
}

$(function() {

	//if login
    Webapp.postLoadData('/auth.do', {'method': 'isLogin'},
        function(data) {
            if(!data.result) {
                $("header .menu").click(function() {
                    $("div",this).eq(0).slideToggle(100);
                });
                $('.topLogin').show();
            } else {
                $("header .menu").click(function() {
                    $("div",this).eq(1).slideToggle(100);
                });
                $('.topLogin').html('账户').attr('href', 'user-account.html');
            }    
        }, 
        function(e) {
        	$("header .menu").click(function() {
                $("div",this).eq(0).slideToggle(100);
            });
            $('.topLogin').show();  
        }
    );

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

   
    //coll begin
    /* 网址跟踪 */
    if(getUrl("utm_source")) {
    	adsFollow(getUrl("utm_source"),getUrl("utm_medium"),getUrl("utm_term"),getUrl("utm_content"),getUrl("utm_campaign")); 
    }

    var collDate = new Date();
	var month = '';
	var day = '';
	if((collDate.getMonth()+1)<10) {
		month = '0'+(collDate.getMonth()+1).toString();
	}
	if(collDate.getDate() < 10) {
		day = '0' + collDate.getDate().toString();
	}
	collDate = collDate.getFullYear() + '-' + month + '-' + day;

	/* 渠道统计 */
    if(getUrl('channelid')) {    
	    var params = {
	        'method': 'addChannelView',
	        'channelid': getUrl('channelid') ,
	        'regviewpv': getUrl('regviewpv') ,
	        'allpv': getUrl('allpv'),
	        'regcount': getUrl('regcount'),
	        'downloadapp': getUrl('downloadapp'),
	        'appdate': collDate,
	        'regpage': getUrl('regpage')
	    }

	    Webapp.postLoadData('/appMobile.do', params,
	        function(data) {
	            console.log(data);
	        }, 
	        function(e) {
	            console.log(e);
	    });
	} 

	if(document.referrer != '') {
		if(getPrevUrl('channelid')) {
			var params = {
		        'method': 'addChannelView',
		        'channelid': getPrevUrl('channelid') ,
		        'regviewpv': getPrevUrl('regviewpv') ,
		        'allpv': getPrevUrl('allpv'),
		        'regcount': getPrevUrl('regcount'),
		        'downloadapp': getPrevUrl('downloadapp'),
		        'appdate': collDate,
		        'regpage': getPrevUrl('regpage')
		    }

		    Webapp.postLoadData('/appMobile.do', params,
		        function(data) {
		            console.log(data);
		        }, 
		        function(e) {
		            console.log(e);
		    });
		}
	}
	//coll - end
});
