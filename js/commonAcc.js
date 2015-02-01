/* get user info */
;function getAccount() {
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
