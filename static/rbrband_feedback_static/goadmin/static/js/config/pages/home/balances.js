
var app = new App({
    el: '#app',
    data: {results:JSON.parse(str),//results,
	   /**
	    * how to program the progress bars on top of the page
            */
	    show_progresses:[
		function(db){
		   var count = db({"balance":0}).count();
		   console.log('new: ', count, ' given: ', db().sum("given"));
		   var total = db().count();
		   var result = round2(count*100/total);
		   return {name:'name', icon:'flag', tagline:'% new users among ' + total, header: result, progress:result, 'label':'New'};
	       },

		function(db,_this){
		    var sum1 = db().sum("balance")/100;
		    var total = db().count();
		    var result = round2(sum1*100/total);
		    return {name:'approved', icon:'account_balance', tagline:'Approved across ' + total +' users', header: '₹ '+ sum1, progress:result, 'label':'Balance'};
	       },
	       	       		
		function(db,_this){
		    var sum1 = db().sum("balance")/100;
		    var total = db().count()
		    var new_users = db({"balance":0}).count();
		    var result = round2((total-new_users)*100/total);
		    return {name:'given', icon:'done', tagline:'Balance '+sum1 + ' across users:', header: (total-new_users), progress:result, 'label':'Given'};
		}

	       ]
	  }
});
