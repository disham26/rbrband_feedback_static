Vue.component('admin-call', Vue.extend({
    template: "#admin_call",
    data: function(){
		return {
            filtered_calls:[],
            phoneAlias: '',
			chosen:{}, //chosen from Exotel call detail
            hasMapping:false,
            mapping:{}, // Mapping data and used in refresh chosen
            filtered_details:[],
            cards:[],   // used in getCardMapping for View cards
            transactions:[], // used in txnDetail for view transactions
            banktx: [],
            hasbanktx: false,
            acc_detail:{},  // used in  accountDetail
            bills:[],       // used in view Bills
            summary:{},     // used to get summary in view bills
            events:[],      // used to get all transactions under view bills
            total:[]        // used to get all bills under title
		};
    },
    computed: {
        ordered_bills: function(){
            return _.sortBy(this.bills, function(x){ 
                return -1 * x.from;
            });
        },
        ordered_txn: function(){
            return _.sortBy(this.transactions, function(x){
                date = Number(new Date(x.uts)); 
                return -1 * date;
            });
        },
        ordered_bank_txn: function(){
            return _.sortBy(this.banktx, function(x){
                date = Number(new Date(x.uts)); 
                return -1 * date;
            });
        },
    },
    created: function(){
    	this.reset();
    },

    methods: {
        reset:function(){
            //show all calls again
            var _this = this;
            var url = "/admin/json/calls/latest?max=25"
            $.getJSON( url, function(data){
                _this.filtered_calls = data.call;  
            });
        },

        clickCol1: function(call){
            this.chosen = call;
            this.refreshCol2();
        },

        refreshCol2: function(){
            this.refreshCol3();
            this.refreshChosen();
        },

        refreshCol3: function(){
            this.filtered_details = [];
            this.cards = [];
            this.transactions = [];  
            this.banktx = [];  
            this.hasbanktx = false; 
            this.acc_detail = {};
            this.bills = [];
            this.total = [];
            this.refreshCol4();
        },

        refreshCol4: function(){
            this.summary = {};
            this.events = [];
        },

        refreshChosen: function(){
            var _this = this;
            _this.mapping = {};
            var url = "/admin/json/phone/"+_this.chosen.call_from+"/details"
            _this.hasMapping = false;
            $.getJSON( url, function( data ) {
                console.log("data is ",data)
                if(data.success){
                    _this.hasMapping = true;
                    _this.mapping = data.mapping;
                }else{
                    console.log("no data for phone",phone)
                }
                console.log("hasmapping",_this.hasMapping)
            });
            _this.phoneAlias = undefined;
            console.log("mapping",_this.mapping)
        },

        detail:function(chosen){
            var _this = this;
            _this.phoneAlias = undefined;
            _this.filtered_details = _this.details[chosen.call_from]
        },

        refreshAliasPhone: function(){
            this.chosen.call_from = this.phoneAlias
            this.refreshCol3();
            this.refreshChosen();
        },

        getCardMapping: function(){
            var _this = this
            _this.refreshCol3();
            var custId = 'test.'+_this.mapping.customerId+'.test'
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

        txnDetail: function(chosen){
            var _this = this;
            _this.refreshCol3();
            var url = "/admin/json/proxy/"+_this.mapping.proxy+"/transactions"
            $.getJSON( url, function(data){
                if(data.success){
                    _this.transactions = data.transaction;
                }
            });
        },
        
        bankTxnDetail: function(chosen){
            var _this = this;
            _this.refreshCol3();
            _this.hasbanktx = false;
            var url = "/admin/json/"+_this.mapping.customerId+"/transactions"
            $.getJSON( url, function(data){
                if(data.success){
                    _this.banktx = data.transaction;
                    if(_this.banktx.length > 0){
                        _this.hasbanktx = true;
                    }
                }
            });
        },

        accountDetail: function(){
            var _this = this;
            _this.refreshCol3();
            _this.acc_detail = _this.mapping;
            console.log("account detail",_this.acc_detail)
        },

        viewBills: function(){
            // hit /api/1/app/audit/bills
            // with custom header X-Credential-Username with admin.customer_id.admin
            var _this = this
            _this.refreshCol3();
            var custId = 'admin.'+_this.mapping.customerId+'.admin'
            $.ajax({
                url: "/api/1/app/audit/bills",
                //data: { signature: authHeader },
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', custId);},
                success: function(data) {
                    if(data.bills!=null){
                        _this.bills = data.bills;
                    }
                    console.log('bills',_this.bills)
                }
            });
        },

        viewBillSummary: function(bill){
            var _this = this
            _this.refreshCol4();
            var custId = 'admin.'+_this.mapping.customerId+'.admin'
            $.ajax({
                url: "/api/1/app/audit/bill/"+bill.id+"/summary",
                //data: { signature: authHeader },
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', custId);},
                success: function(data) {
                    if(data.summary!=null){
                        _this.summary = data.summary;
                    }
                }
            });    

        },

        viewBillTransactions:function(bill){
            var _this = this
            _this.refreshCol4();
            var custId = 'admin.'+_this.mapping.customerId+'.admin'
            $.ajax({
                url: "/api/1/app/audit/bill/"+bill.id+"/transactions",
                //data: { signature: authHeader },
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', custId);},
                success: function(data) {
                    if(data.events!=null){
                        _this.events = data.events;
                    }
                }
            });
        },

        totalBills: function(chosen){
            var _this = this;
            _this.refreshCol3();
            var url = "/1/1/app/audit/bills/"+_this.mapping.customerId+"/total"
            $.getJSON( url, function(data){
                //TODO: if success, only then
                if(data.success){
                    if(data.bills!=null){
                        _this.total = data.bills;
                    }
                }
            });
            console.log("total",_this.total);
        },

        pretty_time: function(t){
            return new Date(t*1000).toString().substr(0,16);
        },

        pretty_hour: function(t){
            return new Date(t*1000).toString().substr(0,24);
        },

        pretty_money: function(r){
            return "Rs. "+r/100;
        },
	}
}));

