var issues_vue = Vue.component('rbrband-profile', {
    template: "#rbrband_profile",
    props:["_bandcreator"],
    data: function() {
        return {
            band_creator:'',
            band_name: '',
            band_genre:'',
            band_description:'',
            band_location:'',
            band_contact:'',
            band_charge:'',
            show_band_form:false,

            musicianid:'',

            user: [
                {

                    first_name:'',
                    name:'',
                    id:'',
                    birthday:'',
                    email:'',
                    gender:'',
                    location:'',
                    link:'',
                    isloggedin:false,
                    bandsAssociated:0
                }
            ],
        };
    },
    created: function() {
        
        //console.log("Created function called");
        this.band_creator = this._bandcreator;
        console.log("Created called, band_creator is :"+this._bandcreator);
        this.reset();
        
    },

    methods: {
        reset: function() {
            var _this = this; 
        },
        show_form: function(){
            console.log("show_form called");
            this.show_band_form=true;
        } ,
        checkForm: function (e) {
            console.log("Check Form called");
      if (this.band_name && this.band_location && this.band_contact && this.band_charge && this.band_genre) {
        console.log("all is well");
        alert("all is well");
        return true;
      }
      console.log("all is not well")
      this.errors = [];

      if (!this.band_name) {
        alert('Band Name required.');
        return;
      }
      if (!this.band_location) {
        alert('Band City required.');
        return;
      }
      if (!this.band_contact) {
        alert('Contact Details required.');
        return;
      }
      if (!this.band_charge) {
        alert('Charges required.');
        return;
      }
      if (!this.band_genre) {
        alert('Genre required.');
        return;
      }
      e.preventDefault();
    }

    }
});