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

