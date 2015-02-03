'use strict';

$(function() {

    //more coll
    /*function getUrl(n) {
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

    var date = new Date();
    var params = {
        'method': 'addChannelView',
        'channelid': getUrl('channelid') || 'A00000',
        'regviewpv': getUrl('regviewpv') || 1,
        'allpv': getUrl('allpv') || 1,
        'regcount': getUrl('regcount') || 1,
        'downloadapp': getUrl('downloadapp') || 1,
        'appdate': date = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate(),
        'regpage': getUrl('regpage') || 1
    }
    Webapp.postLoadData('/appMobile.do', params,
        function(data) {
            console.log("collection is done");
        }, 
        function(e) {
            console.log(e);
    });*/

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
            result = '';
        }

        if(userAgent.match(/iPhone|iPad/i)) {
             appLink = 'http://um0.cn/8ArgH/';
        } else if(userAgent.match(/Android/i)) {
             appLink = 'http://file.touna.cn/app/touna_licai_gwwap.apk';
        } else {
            appLink = 'http://file.touna.cn/app/touna_licai_gwwap.apk';
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

    dectectBroswer();

    $('a.app-link').attr("href", appLink);

    $('a.appDownloadBar').attr("href", appLink);
});

/* 登出 */
function logout() {
    Webapp.postLoadData('/auth.do', {'method': 'logout'},
        function(data) {
            window.location.href = '/wap/sign-in.html';
        }, 
        function(e) {
           
       });
}
