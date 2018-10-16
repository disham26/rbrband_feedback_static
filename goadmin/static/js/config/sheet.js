BaseBfSheet = Vue.component('bf-sheet', Vue.extend({
    props:["_admin","_mapping","_id","_name","_auth","_cols"],
    data: function(){
	return  { id:'', sheetData: [], sheetJson: [], hot: {},
		  fields:[]};
    },	

    created: function(){
	var _this = this;
	this.admin = this._admin;
	this.id = this._id;
	//console.log('_id is ', this._id, ' id is ', this.id, ' _cols is ', this._cols);
	if(this._mapping){
	    this.mappingId = this._mapping;
	}	
	window.setTimeout(_this.setupSheet, 500);
    },
    
    methods: {
	
	setupSheet: function(){
	    var _this = this;
	    _this.refreshSheetData(function(){
		//console.log('create table with ', _this.getSheetData(), ' fields: ', _this.fields, ' _container: ', _this.$el);
		_this.hot = new Handsontable(_this.$el, {
		    data: _this.getSheetData(),
		    fixedColumnsLeft: 4,
		    colHeaders:  _.pluck(_this.fields,'title'),
		    rowHeaders: true,
		    columns: _this.fields,
		    
		    // use headers width while calculation the column width
		    autoColumnSize: {useHeaders: true, syncLimit: 300},
		    afterChange: function (changes, source) {
			//console.log('edit: ', source, ' => ', arguments);
			if(source == 'edit' || source.indexOf('paste')> -1){
			    _this.changed(changes);
			}
		    },
		    afterOnCellMouseDown: function(e, clicked){
			if (clicked.row == -1){
			    _this.clickedHeader(e.target.innerText, clicked);
			}
		    },
		    minSpareRows:5
		});
		_this.hot.validateCells();
	    });
	},

	detectAll: function(){
	    var _this = this;
	    _this.hot.render();
	},

	getSheetData: function(cb){
	    //console.log('getSheetData: ', this.sheetData);
	    return this.sheetData;
	},
	
	refreshSheetData: function(cb){
	    var _this = this;
	    _this.http("GET", "/admin/json/sheet/"+_this.id, null, function(resp){
		//console.log('refreshData gave: ', resp.data);

		if (resp.sql && $("#sql")){
		    $("#sql").val(resp.sql);
		}
		
		var datum = resp.data;
		if(!datum){
		    cb();
		    return;
		}
		if(!datum.length){
		    cb();
		    return;
		}

		var kv = {};
		for(var i=0;i<datum.length;i++){
		    var data = datum[i];
		    var extId = data["ext_id"];
		    if (extId == "meta"){
			continue;
		    }
		    if(!kv[extId]){
			kv[extId] = {};
		    }
		    var key = data.key;
		    var value = data.value;
		    kv[extId][key] = value;
		    var extIdInt = parseInt(extId,10);
		    if(extIdInt>0){
			//console.log(extId, ' => ', typeof extIdInt, ' ' , extIdInt, ' ' , kv[extId]);
			Vue.set(_this.sheetData, extIdInt-1, kv[extId]);
		    }
		}
		cb()
	    });
	    
	},
	
	submitAll: function(){
	    var _this = this;
	    var d = _this.hot.getData();
	    var objs = [], fields = _this.fields;
	    for(var i=0; i<d.length; i++){
		var row = d[i];
		var obj = {};
		for(var j=0;j<fields.length;j++){
		    var f = fields[j];
		    if(typeof d[i][j] == "undefined" || d[i][j] == null){
			continue;
		    }
		    obj[f.name] = d[i][j];
		}
		obj["order_int"] = i;
		objs.push(obj);
	    }
	    //console.log('submitAll: ', objs);
	    _this.http("POST", "/admin/json/sheet/"+_this.id, objs);
	},
	
	changed: function(changes){
	    //console.log('changed: ', arguments);
	    var _this = this;
	    var d = changes;
	    var objs = [], fields = _this.fields;
	    for(var i=0;i<changes.length;i++){
		var change = changes[i];
		var field = change[1];
		var obj = {};
		obj.key = field.toString();
		obj.value = change[3].toString();
		obj.ext_id = (change[0]+1).toString();
		objs.push(obj);
	    }
	    //console.log('objs length: ', objs.length);
	    var newObjs = [];
	    var toCreate = {};
	    _this.http("POST", "/admin/json/sheet/"+_this.id, {changes: objs});
	
	},

	clickedHeader: function(key){
	    var _this = this;
	    _this.http("GET", "/admin/json/sheet/"+_this.id+"/cell/"+key+"/0", null, function(resp){
		if (resp.success){
		    $("#sql").val(resp.data.value);
		}
	    })
	},
		      
	http: function(method, url, data, cb){
	    var _this = this;
	    $.ajax({
                url: url,
                //data: {sheet: JSON.stringify(), fields: JSON.stringify(_this.fields)},
		data: data?JSON.stringify(data):null,
		dataType: "json",
		contentType: "application/json",
                type: method,
                beforeSend: function(xhr){xhr.setRequestHeader('X-Credential-Username', BF.user.auth);},
                success: cb
            });
	}

    },
    computed: {
	
	submitUrl: function(){
	    return "/admin/signup/mobile/" + this.phone;
	},
	showSubmit: function(){
	    return (this.existingCustomer ||  this.addBank || this.addVehicle || this.issueCard);
	}
    }
}));

Sheet = Vue.component('sheet', BaseBfSheet.extend({
    template:"#bf_sheet",
    data: function(){
	var _this = this;
	var cols = this._cols ? this._cols : ["A","B","C","D","E","F","G","H","I"];
	//console.log('sheet data with ', cols, ' _id ', _this.id);
	return {
	    id:_this.id, sheetData: [], sheetJson: [], hot: {},
	    fields: cols.map(function(x){	
		return { data:x, title:x };
	    })
	};
    }
}));


BfSheet = Vue.component('bf-sheet', BaseBfSheet.extend({
    template:"#bf_sheet",
    props:["_admin","_mapping","_id","_name","_auth"],
    data: function(){
	var statuses = ['walkin','lead','issued','docs pending','signed up / activated','needs corrections','do not signup','loaded','wrong/missing uuid','returned','lost','comment','other issue'];
	var statusData = [];
        while (status = statuses.shift()) {
            statusData.push([
                [status]
            ]);
        }
	
	return {
	    id:'', sheetData: [], sheetJson: [], statuses: [], statusData: [], hot: {},
	    fields: [
		
		{ data:'status', type: 'handsontable', title:'Card Status', 
		  strict:false,
		  handsontable: {
		      data: statusData,
		      colWidths: '200px',
		  },colWidths: '200px'
		},
		
		{data:'notes',title:'Notes'},//notes
		
                {data:'oldnew',title:'Old or New', type: 'autocomplete', 
		 source:['OLD','NEW']},
		
		{data:'dan',title:'DAN'},
		
		{data:'nach',title:'NACH', type: 'autocomplete',
		 source:['added','missing','uuid not added']},
		
		{data:'signup_date',title:'Signup Date',type:'date',dateFormat: 'DD/MM/YYYY',correctFormat: true},//Date of signup
                {data:'walkin_date',title:'Walkin Date',type:'date',dateFormat: 'DD/MM/YYYY',correctFormat: true},//Date of walkin
                {data:'personal_phone',type:'numeric', title:'Personal Phone'},//mobile
                {data:'phone',type:'numeric',title:'Registered Phone'},//mp mobile
                {data:'proxy',title:'Proxy'},//proxy
                {data:'dest_acc_plate',title:'Vehicle Plate'},//plate
                {data:'weekly_earnings',type:'numeric',title:'Weekly Earnings'},//earnings
                {data:'weekly_wired', type:'numeric',title:'Weekly Wired'},//wired
                {data:'level', title:'Level/Grade', type: 'autocomplete',//grade
                 source: ['Gold','Silver','Bronze','A1','Unknown'], strict: false
                },
		{data:'vehicle_brand',title:'Brand',type: 'autocomplete',//brand
                 source: function (query, process) {
		     $.ajax({
			 url: '/demo/json/autocomplete.json',
			 dataType: 'json',
			 data: {
			     query: query
			 },
			 success: function (response) {
			     //console.log("response", response);
			     process(response.data);
			 }
		     });
                 },
                 strict: false
		},

                {data:'dest_acc_name', title:'Name'},
                {data:'aadhaar',type:'numeric',title:'Aadhaar'},//aadhaar
                {data:'pan',title:'PAN'},//pan
                {data:'dob',title:'DoB',type:'date',dateFormat: 'DD/MM/YYYY'},//dob
                {data:'address1',title:'Address1'},{data:'address2',title:'Address2'},
		{data:'district',title:'District'},//address
                {data:'state', title:'State', type: 'autocomplete',//state
                 source: ['Delhi','Haryana','Gujarat','Kerala','Assam','Rajasthan','Maharastra','West Bengal'], strict: false
                },
                {data:'pincode',type:'numeric',title:'Pincode'},//pincode
                {data:'dest_acc_no',title:'Bank Acc No'},//bank acc
                {data:'bank_name', title: 'Bank Name', type: 'autocomplete',//bank
                 source: ['ICICI','HDFC','State Bank of '], strict: false
                },
                {data:'ifsc',title:'IFSC'},//ifsc
                {data:'micr',title:'MICR'},//micr
		{data:'due_notes', title:'Due'},//due notes to autofill
		{data:'credit_notes',title:'Credit notes'},//credit to give
                {data:'email',title:'Email'},//email
                
		
		{data:'contacted_state',type: 'autocomplete',//state
                 source: ['Done','Taken','Not Reachable','Wrong no','RNR','SW OFF'], strict: false
                }
                                
	    ]
	};
    }
}));
