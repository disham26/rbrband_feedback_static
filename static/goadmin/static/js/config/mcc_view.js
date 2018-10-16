ViewMCC = Vue.component('mcc-view', CommonRest.extend({
    template: '#template_mcc_view',
    data: function(){
		return {
            mcc_list:[]
               };
    },
    created: function(){
        alert(this);
        this.reset();
    },

    methods: {
        reset:function(){
            var _this = this;
            var url = "/admin/json/mcc?max=50"
            $.getJSON( url, function(data){
                _this.mcc_list = data.details; 
            });
        },   
	}
}));