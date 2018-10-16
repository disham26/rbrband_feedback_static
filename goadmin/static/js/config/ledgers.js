Vue.component('admin-ledgers', Vue.extend({
    template: "#admin_ledgers",
    data: function(){
		return {
			/* chosen_caller:"",
			title: "", */
            phoneAlias: '',
			/* chosen:{}, */
            hasLedgers:false,
            /* mapping:{},
            transactions:[],
            cards:[],

			filtered_details:[],
			filtered_bills: [],*/
			customer_ledgers:[] 
		};
    },

    created: function(){
    	this.reset();
    },

    methods: {
        reset:function(){
            //show all calls again
            var _this = this;
            _this.hasLedgers = false;
            var url = "/admin/json/ledger/"+_this.phoneAlias;
            $.getJSON( url, function(data){
                if(data.success){
                    _this.hasLedgers = true;

                    _this.customer_ledgers = data.data;  

                }
            });
        },

       /*  clicked: function(call){        
            this.chosen = call;
            this.resetDetails();
            this.refreshChosen();
            this.resetTransactions();   
        }, */
        
        resetDetails: function(){
            this.filtered_details = [];
        },

      /*   refreshChosen: function(){
            var _this = this;
            _this.mapping = {};
            var phone = _this.phoneAlias?_this.phoneAlias:_this.chosen.call_from;
            var url = "/admin/json/phone/"+phone+"/details"
            _this.hasMapping = false;
            $.getJSON( url, function( data ) {
                //if data does not exist, reset phoneAlias to false
                console.log("data is ",data)
                if(data.success){
                    _this.hasMapping = true;
                    _this.mapping = data.mapping;
                }else{
                    console.log("no data for phone",phone)
                }
                _this.phoneAlias = undefined;
                console.log("hasmapping",_this.hasMapping)
            });
            console.log("mapping",_this.mapping)
        }, */

      /*   resetTransactions: function(){
            this.transactions = [];
        },

        detail:function(chosen){
            var _this = this;
            _this.phoneAlias = undefined;
            _this.filtered_details = _this.details[chosen.call_from]
        },

        refreshAliasPhone: function(){
            this.refreshChosen();
        },

        getCardMapping: function(){
            _this = this
            var custId = 'test.'+_this.mapping.customerId+'.test'
            _this.transactions = []
            $.ajax({
            url: "/api/1/app/mappings/cards",
            //data: { signature: authHeader },
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', custId);},
            success: function(data) { 
                _this.cards = data.cards;
                }
            });
        },

        txn_detail: function(chosen){
            var _this = this;
            _this.cards = [];
            var url = "/admin/json/proxy/"+_this.mapping.proxy+"/transactions"
            $.getJSON( url, function(data){
                //TODO: if success, only then
                _this.transactions = data.transaction;  
            });
        },
 */
   /*  	filterByCalled: function(call_to){
    		var _this = this;
    		_this.filtered_calls = _.filter(_this.filtered_calls, function(call){
    			return call.call_to == call_to;
    		})
    	},
    	
        viewBills: function(){
            // hit /api/1/app/audit/bills
            // with custom header X-Credential-Username with admin.customer_id.admin
        } */
	}
}));

