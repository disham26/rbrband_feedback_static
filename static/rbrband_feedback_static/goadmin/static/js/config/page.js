//TODO
Vue.material.registerTheme('default',{
    primary: 'brown',
    accent: 'white',
    background:'red'
});

var getDb = function(selected, _app){
    return TAFFY(selected? selected.length ? selected : _app.$data.results
		         :_app.$data.results);
};

var round2 = function(value){
    return Number(Math.round(value+'e'+2)+'e-'+2);
};

CommonPageElement = Vue.extend({
    props: ["_items","user","i","name","label","progress","icon","value","title","tagline","_headers","_table","_active","calculated"],
    created: function () {
	this.items = this._items;
	this.table = this._table;
	this.headers = this._headers;
	this.active = false;
    },
    computed: {
	cols: function(){
	    return this.items.length;
	},
	colsPercent: function(){
	    if(this.items){
		return 100/this.items.length;
	    }
	}
    },
    methods:{
	colMd: function(i){
	    var val = 12/this.items.length;
	    return 'col-md-'+val;
	},
	containsSpace:function(str){
	    if(!str){return false;}
	    if(!_.isString(str)){ return false;}
	    return str.indexOf(' ') > -1 ? true : false;
	}
    }
});

	      
Vue.component('filter-table', CommonPageElement.extend({
    template: "#filter_table",
    data:function(){
	return {
	    selected:false,
	    hasInput:false,
	    fields:function(){return [];},
	    input:'',
	    row:{}
	};
    },
    methods: {
	onSelectFilterRow: function(row){
	    if(!row.hasInput){
		this.onSelectFilterCheckbox(row);
	    }
	},
	onSelectFilterCheckbox: function(row){
	    row.selected = !row.selected;
	    page.onSelectFilterRow(row);
	},
	onKeyup: function(row){
	    row.selected = row.input.length ? true : false;
	    page.onSelectFilterRow(row);
	}
    }
}));

Vue.component('page-table', CommonPageElement.extend({
    template: "#page_table",
    data: function(){ return {table_headers:[],selected:false,allSelected:false,row:{}}},
    methods: {
	onSelectRow: function(row){
	    row.selected = !row.selected;
	    this.allSelected = _.reduce(this.table,function(acc,x){acc+=x.selected?1:0;return acc;},0) == this.table.length ? true : false;
	    page.onSelectRow(row);
	},
	onToggleAll: function(){
	    var _this = this;
	    var allSelected = !_this.allSelected;
	    _this.allSelected = allSelected;
	    _.each(_this.table, function(x){
		x.selected = allSelected == x.selected ? x.selected : allSelected;
		page.onSelectRow(x);
		return x;
	    });
	}
    }
}));


Vue.component('page-nav', CommonPageElement.extend({
    template: "#page_nav"
}));

Vue.component('page-nav-inner', CommonPageElement.extend({
    template: "#page_nav_inner"
}));

Vue.component('page-header', CommonPageElement.extend({
    template: "#page_header"
}));

Vue.component('page-progress', CommonPageElement.extend({
    template: "#page_progress"
}));


Page = Vue.component('page',{
    data: function(){
		return {
		    db:{},
		    row:{},
		    tab_names:[],
		    results:[],
		    filtered:[],
		    filters:[],
		    cart:[],
		    show_filters:[],
		    progresses:[],
		    show_progresses:[],
			templates: []
		};
    },
    computed: {
	table_data: function(){
	    return this.filtered;
	},
	filter_data: function(){
	    return this.show_filters;
	}
    },
    watch:{
	
    },
    methods:{
	toggleRightSidenav() {
            this.$refs.rightSidenav.toggle();
	},
	onSelectRow: function(row){
	    this.refresh(_.filter(this.filtered, function(x){return x.selected;}));
	},
	refresh:function(rows){
	    var _this = this;
    	    var db = getDb(rows? (rows.length == 0 ? _this.filtered : rows) : _this.results, _this);
	    _this.progresses = _.map(_this.show_progresses, function(x){
		return x(db,_this);
	    });
	    delete db;
	    return _this.progresses;
	},
	onSelectFilterRow: function(row,opt){
	    this.refreshFilters(_.filter(this.show_filters, function(x){return x.selected;}),opt);
	},

	refreshFilters: function(selected_filters, keep_rows_unchanged){
	    var _this = this;
	    selected_filters = _.toArray(selected_filters);
	    var removed = 0;
	    var tD = _this.table_data;
	    var lines = tD.length;
	    for(var i=0;i<lines;i++,removed){
		if(!keep_rows_unchanged){
		    _this.filtered.pop();
		}
	    }
	    var availableFilters = _.filter(_this.show_filters,function(x){ return x.selected;});// selected_filters;
	    var filtersLen = availableFilters.length;
	    var succeeded = [];
	    _.each(_this.results,function(row){
		//filter row
		if(!filtersLen){
		    for(var i=0; i< _this.show_filters;i++){
			var filter = availableFilters[i];
			filter.calculated = '';
		    }
		    succeeded.push(row);
		    return;
		}
		var failed = false;
		for(var i=0; i< filtersLen;i++){
		    var filter = availableFilters[i];
			if(i==0 && filtersLen > 1){
			    filter.selected = false;
			}
		    if(typeof filter.func!="undefined"){
			var passed = filter.func(row);
			if(!passed.result){
			    failed = true;
			    break;
			}else{
			    row.calculated = passed.calculated;
			    filter.calculated = passed.calculated;
			}
		    }
		}
		if(failed && !keep_rows_unchanged){
		    _this.filtered.pop();
		}else{
		    succeeded.push(row);
		}
		return failed;	
	    });
	    for(var i =0;i<succeeded.length && !keep_rows_unchanged;i++){
		var row = succeeded[i];
		_this.filtered.push(row);
	    }
	    if(!keep_rows_unchanged){
		_this.refresh(_this.filtered);
	    }
	}
    },
    created: function(){
    	console.log('in created ');
	var _this = this;

	this.tab_names = [{icon:'search'}];
	
    	var db = function(rows){
	    return getDb(rows? (rows.length == 0 ? _this.filtered : rows) : _this.results, _this)(rows);
	};
	
	var default_show_filters = [ //needs to be first filter
	                    {
	                    	id:1,label:"Currently selected",
						    selected:false, hasInput:false,header:true,
						    fields:function(){ return _.keys(results[0]); },
						    calculated:'',
						    func:function(x, filter){
								var count = db({"selected":true}).count();
								return {result: x.selected, calculated: count};
						    }
					 	},
			    
					    {
					    	id:2,label:"Show all", hasInput:false, selected:false, calculated:'',func:function(x, filter){
							this.filtered = this.results;
							var count = db().count();
								return {result: true, calculated: count};
						    }
					 	},

	                    {
	                    	id:10,label:"contains ", hasInput:true, selected:false,  calculated:'',
	                    	func:function(x, filter){
								if(!this.input){return false;}
								if(!x.label){return false;}
								return {result: x.label.toLowerCase().indexOf(this.input.toLowerCase()) > -1 ? true:false, calculated:'contains '+ this.input};
						    }
						}
					   ];
	_.map(default_show_filters,function(x){
	    _this.show_filters.push(x);
	});
	_.map(_this.filters,function(x){
	    _this.show_filters.push(x);
	});
	
	this.refresh(this.results);
	
	console.log('filters: ', _this.filters.length, " default: ", default_show_filters.length);
	_.map(_this.results,function(x){
	    _this.filtered.push(x);
	});

    }
});
