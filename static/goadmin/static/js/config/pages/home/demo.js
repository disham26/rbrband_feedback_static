var page = new Page({
    el: '#page',
    data: {results:
	   [{id:1,
	     name: "Apple",
	     label: "Apple",
	     price: 35,
	     weight: 40,
	     selected:false,
	     calculated:false
	    },
	    {id:2,
	     name: "Banana",
	     label: "Banana",
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
	     selected:false,
	     calculated:false
	    },
	    {id:4,
	     name: "Pineapple",
	     label: "Pineapple",
	     weight:10,
	     price: 200,
	     selected:false,
	     calculated:false
	    },
	    {id:5,
	     name: "guava",
	     label: "Guava",
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
	       function(db,_this){
		   var val = db().count();
		   var sum = db().sum("price");
		   var result = round2(val*100/_this.filtered.length);
		   return {name:'name', icon:'supervisor_account', tagline:'Across ' + val +' users', header: '₹ '+ sum, progress:result, 'label':'Users'};
	       },
	       
	       function(db,_this){
		   var sum = db().sum("weight");
		   var avg = round2(sum/ db().count());
		   var result = round2(avg * 100/ db().sum("weight"));
		   return {name:"weight", icon:'account_balance', progress:result, tagline:'Average weight ₹ '+avg, header: '₹ ' + sum, label: "Weight"};
	       },
	       
	       function(db,_this){
		   var avg = round2(db().sum("price")/ db().count());
		   var result = round2(avg * 100/ db().sum("price"));
		   return {name:"price", icon:'account_balance', tagline: 'Avg Price ₹ '+result, progress:result, header:'₹ '+ avg, "label": "Price"};
	       }]
	  },
	  filters: [
		{id:11,label:"price > ", hasInput:true, selected:false,  calculated:'',func:function(x, filter){
				if(!this.input){return false;}
				if(!x.price){return false;}
				return {result: x.price > parseInt(this.input,10) ? true:false, calculated:'> '+ this.input};
			    }},
			    {id:5,label:"price > avg", hasInput:false, selected:false, calculated:'',func:function(x, filter){
				var sum = db().sum("price");
				var avg = sum/ db().count();
				if(!x.price){return false;}
				return {result: x.price > avg, calculated: '₹ '+ avg};
			    }},
			    {id:6,label:"price < avg", hasInput:false, selected:false, calculated:'',func:function(x, filter){
				var sum = db().sum("price");
				var avg = sum/ db().count();
				if(!x.price){return false;}
				return {result: x.price < avg, calculated: '₹ '+ avg};
			    }},
			    {id:7,label:"price > ₹ 5", hasInput:false, selected:false,  calculated:'',func:function(x, filter){
				if(!x.price){return false;}
				return {result: x.price > 5, calculated: ''};
			    }},
			    {id:8,label:"name has ", hasInput:false, selected:false, calculated:'',func:function(x, filter){
				if(!x.label){return false;}
				var label = x.label.toLowerCase();
				return {result: label.indexOf('naidu') > -1 ? true:false, calculated:'contains naidu'};
			    }},
			    {id:9,label:"has > 2 docs", hasInput:false, selected:false,  calculated:'g',func:function(x, filter){
				if(!x.docs){return false;}
				return {result: x.docs.length > 2 ? true:false, calculated:'contains naidu'};
			    }}

	  ]
});
