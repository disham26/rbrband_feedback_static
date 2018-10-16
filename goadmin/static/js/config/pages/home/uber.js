var app = new App({
    el: '#app',
    data: {results:[
	{id:1,
	 name:'Rram',
	 label:'Ram',
         given:5000,
	 approved:5000,
	 selected:false,
	 repaid:100,
	 calculated:false
	},
	{id:2,
	 name: "Banana",
	 label: "Banana",
         given:1000,
	 approved:5000,
	 repaid:0,
	 price: 12,
	 weight:5,
	 selected:false,
	 calculated:false
	    },
	    {id:3,
	     name: "Grapes",
	     label: "Grapes",
	     weight: 0.1,
	     price: 45,
             given:500,
	     approved:1000,
	     repaid:500,
	     selected:false,
	     calculated:false
	    },
	    {id:4,
	     name: "Pineapple",
	     label: "Pineapple",
	     weight:10,
	     price: 200,
             given:2000,
	     approved:1500,
	     repaid:1900,
	     selected:false,
	     calculated:false
	    },
	    {id:5,
	     name: "guava",
	     label: "Guava",
             given:10000,
	     approved:12000,
	     repaid:6000,
	     price: 5,
	     weight: 140,
	     selected:false,
	     calculated:false
	    },
	{id:6,
	     name: "guava 1",
	     label: "Guava",
             given:0,
	     approved:5000,
	     price: 5,
	     weight: 140,
	     selected:false,
	     calculated:false
	},
	{id:7,
	     name: "guava 2",
	     label: "Guava",
             given:0,
	     approved:1000,
	     price: 5,
	     weight: 140,
	     selected:false,
	     calculated:false
	    }
           ],
	   /**
	    * how to program the progress bars on top of the page
            */
	    show_progresses:[
		function(db){
		   var count = db({"given":0}).count();
		   console.log('new: ', count, ' given: ', db().sum("given"));
		   var total = db().count();
		   var result = round2(count*100/total);
		   return {name:'name', icon:'flag', tagline:'% new users among ' + total, header: result, progress:result, 'label':'User'};
	       },

		function(db,_this){
		   console.log('find given: ', db);
		    var sum1 = db().sum("approved");
		    var sum2 = db().sum("given");
		    var count = db().count();
		   var result = round2(sum1*100/sum1+sum2);
		   return {name:'approved', icon:'gavel', tagline:'Approved across ' + count +' users', header: '₹ '+ sum1, progress:result, 'label':'Approved'};
	       },
	       	       
		function(db,_this){
		    console.log('find given: ', db);
		   var total = db().count()
		    var new_users = db({"given":0}).count();
		   var sum = db().sum("given");
		   var result = round2((total-new_users)*100/total);
		    return {name:'given', icon:'done', tagline:'Given across ' + (total-new_users) +' users', header: '₹ '+ sum, progress:result, 'label':'Given'};
		},
		
		function(db,_this){
		   console.log('find given: ', db);
		    var sum1 = db().sum("repaid");
		    var sum2 = db().sum("given");
		    var count = db().count();
		   var result = round2(sum1*100/sum2);
		   return {name:'repaid', icon:'done_all', tagline:'Repaid across ' + count +' users', header: '₹ '+ sum1, progress:result, 'label':'Repaid'};
	       },

	       ]
	  }
});
