CommonElement = Vue.component('commonelement', {
    props: ["_items","user","name","label","obj","link","_infos","_links","_forms","_templates","requires"],
    created: function () {
	var event = this.$options._componentTag+'_sibling.chose';
	eventHub.$on(event, this.chose)
	this.items = this._items;
	this.infos = this._infos;
	this.links = this._links;
	this.forms = this._forms;
	this.templates = this._templates;
	console.log('user is ', this.user.phone, ' listen to ', event,' this.chosen is ', this.chosen, ' for ', this.name, ' infos is ', this.infos, ' obj is ', this.obj, ' templates: ', this.templates);

    }
});

CommonCardParent = CommonElement.extend({
    data: function(){ return { chosen_name:''}; },
    methods: {
	chose: function(chosen){
	    console.log('change parent chosen to ', chosen.obj.name)
	    this.chosen_name = chosen.name;
	    var self = this;
	    console.log(' items is ', this.items, ' current is ', this.$options._componentTag, ' this.chosen is ', this.chosen, ' clicked: ', this.name, ' link: ', chosen.obj.link);

	    /*//test
	    this.chosen = true;
	    return;
	    ///test*/
	    
	    if(chosen.obj.link){
		window.location.href = chosen.obj.link;
	    }
	    
	    $.ajax({url:window.location.href +"/picked/"+this.$options._componentTag.split('_')[1]+'/',
		    type:'POST',
		    dataType: 'json',
		    data:JSON.stringify({picked: chosen.name}),
		    statusCode: {
			204: function(data) {
			    console.log('got ', data, ' current this.items is ', self.items)
			    //<switch
			    var ux = (data)? data.ux : null;
			    switch(ux){
			    case 'inplace':{
				if (data.items) {
				    self.items = data.items;
				}
				eventHub.$emit(self.$options._componentTag+'.chose', data.component)
				break;
			    }
				
			    case 'replace':{
				if (data.items){
				    self.items = data.items;
				}
				break;
			    }

			    case 'append':{
				if (data.items) {
				    self.items = self.items.concat(data.items);
				}
				break;
			    }
				
			    case 'redirect':{}
			    default:{
				window.location.href = window.location.href;
				break;
			    }
			    }
			    //</switch
			    
			}
		    }
		   });//end ajax	
	}
    }
});
				 

CommonCard = Vue.component('commoncard', {
    props: ["icon","label","name","link","obj"],
    data: function(){
	return {chosen: false};
    },
    created: function () {
	eventHub.$on(this.$options._componentTag+'.chose', this.chose)
	this.chosen = this.$parent.chosen_name == this.name ? true : false;
	console.log('my icon is ',this.icon);
    },
    methods: {
	clicked: function(){
	    console.log('clicked ', this.$options._componentTag);
	    eventHub.$emit(this.$options._componentTag+'.chose', this);
	},
	chose: function(){
	    if (this.name == this.$parent.chosen_name) {
       		console.log('chose : ', this.name, ' this.x = ', this.x);
		this.chosen = true;
	    }else{
		this.chosen = false;               
	    }
	    this.x = true
	}
    }
});

BfAddress = Vue.component('bf-signup-address', Vue.extend({
    template:"#bf_signup_address",
    props:["_kycinfo"],
    data: function(){
	return {address1:'',kycinfo:{}};
    },
    created: function(){
	if (this._kycinfo){
		this.kycinfo = this._kycinfo
	}
	console.log("kycinfo: ",this.kycinfo, ' of type', (typeof this.kycinfo));
    }
}));

BfBank = Vue.component('bf-signup-bank', Vue.extend({
    template:"#bf_signup_bank",
    data: function(){
	return {bankAcc:''};
    }
}));

BfSignup = Vue.component('bf-signup', Vue.extend({
    template:"#bf_signup",
	props:["_phone","_mapping","_kycinfo"],
    data: function(){
	return {dob: '',proxyKitNumber: '', vehiclePlate:'', phone:'', plateUuid:'',
		isNewPhone:true, existingCustomer:false,
		marketplace:'', signupLocation:'', kycinfo:{},
		issueCard:true, addBank:true, addVehicle: true};
    },
    created: function(){
	this.phone = this._phone;
	if (this._kycinfo){
		this.kycinfo = JSON.parse(this._kycinfo)
	}
	if(this._mapping){
	    this.mappingId = this._mapping;
	    this.isNewPhone = false;
	}
	console.log("Max set for dob is"+this.dob.value);
	console.log('bf-signup created with ',this.phone, " mappingid: ", this.mappingId, "kycinfo: ",this.kycinfo, ' of type', (typeof this.kycinfo));
    },errors:[],

    methods: {

	submitted: function(e){
		console.log(e);
		console.log("Inside submitted function");
		console.log(this.submitUrl);
		console.log("DOB is"+this.dob);
	//	console.log("value of dob is"+document.getElementById("dob").value);
		this.dob = this.correctDate(this.dob);
		/* alert(this.dob);
		alert(NewDate);
		this.dob = NewDate;
		alert(this.dob.value); */
		console.log("New Date is"+this.dob);
		//alert(this.dob);	
		//e.preventDefault();
		},
		correctDate:function(dob) {
			console.log("Inside correctDate");
			var NewDate = dob.split("-");
			var newDate = NewDate[2]+"/"+NewDate[1]+"/"+NewDate[0];
			console.log("New Date is"+newDate);
			dob=NewDate;
			return newDate;
	  }
 
	},
	    
    computed: {
	correctedDob:function(){
			return this.dob;
		},
	minSignupDate:function(){
       return '1900-01-01';
	},
	maxSignupDate:function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear()-18;
 		if(dd<10){
        	dd='0'+dd
    		} 
    	if(mm<10){
        mm='0'+mm
    		} 
		today = yyyy+'-'+mm+'-'+dd;
		return today;
	},
	submitUrl: function(){
	    return "/admin/signup/mobile/" + this.phone;
	},
	showSubmit: function(){
	    return (this.existingCustomer ||  this.addBank || this.addVehicle || this.issueCard);
	}
    }
}));

CommonBase = Vue.component('commonbase',{
    props: ["_debug"],
    template:'<div>Loading...</div>',
    methods: {
	log: function(){
	    var args = arguments;
	    console.log.apply(null, [this.$options._componentTag,':'].concat(args));
	}
    }
});

CommonPagination = Vue.component('pagination',CommonBase.extend({
    template:"#pagination",
    props: ["_page","_pages"],
    data: function(){
	return {page:1,pages:0};
    },

    created: function(){
	if(typeof this._page != "undefined"){
	    this.page = this._page;
	}
	if(typeof this._pages != "undefined"){
	    this.pages = this._pages;
	}
	this.log('pages is ', this._pages, ' page is ', this._page);
    },
    
    watch: {
	page: function(){
	    this.$emit('page-change',this.page);
	}
    }
}));

CommonRest = Vue.component('commonrest', CommonBase.extend({
    props: ["_url","_page","_max","props"],
    data: function(){
    	return {items:[],chosen:{},count:0, page:1, max:100, pages:0};
    },
    
    created: function () {
	var event = this.$options._componentTag;
	eventHub.$on(event, this.clicked)
	if(this._url){	
	    this.url = this._url;
	}
	if(this._debug){	
	    this.debug = this._debug;
	}
	this.log('pagination is ', this.pagination);
    },

    watch: {
	page: function(newVal){
	    this.refresh();
	},
	count: function(){
	    var pages = this.count/this.max;
	    pages = pages<1?1:pages; 
	    this.log('commonrest this.count is ', this.count, ' page is ', pages);
	    this.pages = pages;
	    console.log('settting this.pages to ', this.pages, ' count is ', this.count);
	}
    },
    
    methods:{
	refresh: function(){
	    var _this = this;
	    var url = this.url+'?max='+this.max+'&page='+this.page;
	    $.getJSON(this.url, function(resp){
	 	console.log('commonrest: GET ', url, ' gave ', resp)
                if(resp.success){
		    _this.count = resp.count;
                    if(_this.refreshed){_this.refreshed(resp)};
                }
            });
	},

	get: function(item){
	    var _this = this;
	    var _url = this.url+'/id/'+item.id;
	    $.ajax({
	 	url: _url,
		type:'GET',
		dataType: 'json',
		statusCode: {
		    200: function(data) {
			if(_this.got){_this.got(data)};
		    }
		}
	    });//end ajax
	},

	add: function(params){
	    var _this = this;
	    var _url = _this.url;
	    $.ajax({
	 	url: _url,
		type:'POST',
		dataType: 'json',
		data:JSON.stringify(params),
		statusCode: {
		    204: function(data) {
			if(_this.added){_this.added(data)};
		    }
		}
	    });//end ajax
	},

	edit: function(item, params){
	    var _this = this;
	    var _url = this.url+'/id/'+item.id;
	    $.ajax({
	 	url: _url,
		type:'PUT',
		dataType: 'json',
		data:JSON.stringify(params),
		statusCode: {
		    200: function(data) {
			if(_this.edited){_this.edited(data)};
		    }
		}
	    });//end ajax
	},
	
	pageChange: function(newVal){
	    this.page = newVal;
	}
    }
}));
