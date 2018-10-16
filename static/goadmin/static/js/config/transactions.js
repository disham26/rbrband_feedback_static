Vue.component('transaction-group', Vue.extend({
    template: "#transaction_group",
    data: function(){
		return {
            phoneAlias: '', // No from input
            customerId: '',
            name: '',
            weeks: [],
            months: []
		};
    },

    methods: {
        refreshPhone: function(callback){
            var _this = this;
            _this.customerId = ''
            var url = "/admin/json/phone/"+_this.phoneAlias+"/details"
            $.getJSON( url, callback);
        },
        grouping: function(event){
            var _this = this
            _this.weeks = []
            _this.months = []
            _this.refreshPhone(
                function(data) {
                    console.log("data is ",data)
                    if(data.success){
                        _this.customerId = data.mapping.customerId;
                    }else{
                        console.log("no customer for ",_this.phoneAlias)
                    }
                    console.log("grouping customerId",_this.customerId)
                    if(event == 'none'){            //If no grouping
                        console.log("No grouping")
                    }else if(event == 'week'){      // Group By Week
                        var custId = 'admin.'+_this.customerId+'.admin'
                        $.ajax({
                            url: "/api/1/app/customers/transactions/weeks",
                            type: "GET",
                            beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', custId);},
                            success: function(data) { 
                                _this.weeks = data.weeks;
                                }
                        });
                    }else if(event == 'month'){ // Group By Month
                        var custId = 'admin.'+_this.customerId+'.admin'
                        $.ajax({
                            url: "/api/1/app/customers/transactions/months",
                            type: "GET",
                            beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', custId);},
                            success: function(data) { 
                                _this.months = data.months;
                                }
                        });
                    }
                }
            );
        },
        displayName: function(event){
            var _this = this
            _this.name = ''
            _this.phoneAlias = event
            if(event.length == 10){
                _this.refreshPhone(
                    function(data){
                        if(data.success){
                            _this.name = data.mapping.name
                        }
                    }
                );
            }
        }
	}
}));

