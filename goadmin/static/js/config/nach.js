Vue.component('redirect_mobile', Vue.extend({
    template: "#redirect_mobile",
    data: function(){
	return {mobile:''};
    },
    
    created: function(){

    },
    
    methods: {
	redirect: function(){
	    window.location.href = '/admin/nach/mobile/'+this.mobile;
	}
    }
}));
    
