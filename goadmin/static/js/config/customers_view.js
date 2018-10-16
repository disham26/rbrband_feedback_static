ViewMCC = Vue.component('customers-view', CommonRest.extend({
    template: '#template_customer_view',
    data: function(){
		return {
            customers_list:[]
               };
    },
    created: function(){
        this.reset();
    },

    methods: {
        reset:function(){
            var _this = this;
            var url = "/admin/json/customers"
            $.getJSON( url, function(data){
                _this.customers_list = data.details;
            });
        },   
	}
}));