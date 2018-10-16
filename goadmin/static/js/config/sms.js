var issues_vue = Vue.component('admin-sms', {
    template: "#admin_sms",
    props: ["_email"],
    data: function() {
        return {
            message: '',
            
            
        };
    },

    created: function() {
        this.email = this._email;
        this.message='';
        this.reset();
        

    },
   methods: {
        reset: function() {
            //reset function
            console.log("reset called");
            this.message='';
            
            
            var _this = this;
            
            
        }

    }
});