Vue.component('progress-component', {
    template: '#check_progress',
    props:["_txid"],
    data: function(){
  	return{
  	    txid:'',
  	    progress:[],
  	    hastx:false
  	};
    },
    
    created: function(){
	this.txid = this._txid;
    },
    
    methods:{
	getstatus: function(){
	    var _this = this;
	    _this.progress = []; 
	    this.hastx = true;
	    var url = "/admin/nach/progress/json/"+_this.txid+"/status"
	    $.getJSON( url, function(data){
	        if(data.success){
	            _this.progress = data.progress;
	        }
            });
 	}
    }
});

FeatureName = Vue.component('feature-name', CommonRest.extend({
    template: '#feature_name',
    data: function(){
	return {
	    //template variables must be defined here
	    picked:{}
	};
    },

    created: function(){
    	//console.log('created feature-name with this.url: ', this.url);
    	this.refresh(); //inbuilt
    },

    methods: {
    	added: function(data){
    	    console.log('in added with ', data);
    	},

    	refreshed: function(data){
	    this.log('refreshed, count is ', this.count);
    	    console.log('in refreshed with ', data);
    	    if(data.success){
    		this.items = data.data;
		this.count = data.count;
    	    }
    	},

	got: function(data){
    	    console.log('in show with ', data);
    	    if(data.success){
    		this.picked = data.data;
	    	var chosen_id = data.data.id
	    	this.edit({id:chosen_id}, {"quantity": 10});
    	    }
    	},

    	clicked:function(item){
    	    this.chosen = item;
    	    console.log('item is ', item);
    	    this.get(item); //inbuilt
    	}
    }
}));

Vue.component('card-state', {
    template: '#card_state',
    props:["_proxy"],
    data: function(){
    return{
        proxy:'',
        state:1,
        };
    },
    
    created: function(){
        this.proxy = this._proxy
        return this.getState();
    },
    
    methods:{
        getState: function(){
            var _this = this;
            //_this.state = 1; 
            //this.hastx = true;
            var url = "/admin/json/card/state?proxy="+_this.proxy
            $.getJSON( url, function(data){
                if(data.success){
                    _this.state = data.state;
                }
            });
        }
    }
});

