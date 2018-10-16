
SheetModelSignups = Vue.component('sheet-model-signups', Vue.extend({
    template:"#sheet_model_signups",
    props:["_models"],
    data: function(){
      return {models:[]};
    },

    created: function(){
      if (this._models){
      	this.models = this._models;
  	  }
    },
    methods: {
      add: function(){
        console.log('in add');
        var m = {editing:false, id:new Date().getTime().toString(), name:"untitled", index:this.models.length};
        this.models.push(m);
        this.edit(m);
        this.debug();
      },

      remove: function(model){
        console.log('asked to delete ', model , ' of id ', model.id,' among ', this.models.length);
        this.models.splice(_.find(this.models, function(x){return x.id == model.id;}).index, 1)
        this.debug();
        if(!this.models.length){
          this.add();
        }
      },

      edit: function(model){
        var m = this.models;
        var mLen = m.length;
        console.log('edit ', model, ' of ', mLen);
        for(var i=0;i< mLen;i++){
          var curr = m[i];
          if(_.isEqual(curr,model)){
            console.log('edit ', curr);
          }
          curr.editing = _.isEqual(curr,model);
          Vue.set(this.models, i, curr);
        }
      },
      
      debug:function(){
        console.log('this.models is', this.models, ' ids: ', _.pluck(this.models,"id"));
      },

      modelChange: function(changed){
        Vue.set(this.models, changed.index, changed);
        console.log('caught emitted change ', changed, ' set model at  ', changed.index,' model is now ', _.pluck(this.models,"id"));
      }

    }
}));
      
ModelSignup = Vue.component('model-signup', Vue.extend({
    template:"#model_signup",
    props:["_name","_index","_radio1","_edit","_editing","_id","_sync"],

    /**
     * must be a function returning all variables that tags needs to detect or code needs
     */
    data: function(){
      return {editing:false, edit:true,radio1:'',text1:'',id:'',name:'',index:0, sync:false};
    },

    /**
     * is always called after html instance is detected
     */
    created: function(){
      if (this._index){
        this.index = this._index;
      }
      if (this._id){
        this.id = this._id;
      }
      if (this._name){
        this.name = this._name;
      }
      if (typeof this._edit != "undefined"){
        this.edit = this._edit;
      }
      if (typeof this._editing != "undefined"){
        this.editing = this._editing;
      }
      console.log('created with id', this.id, ' _name: ', this.name,' and index', this.index, ' editing: ', this.editing);      
      
      if(this._sync){
        this.sync = true;
      }
    },

    methods: {
      state: function(){
        return {
          index:this.index, 
          id:this.id,
          name:this.name,
          radio1: this.radio1, 
          text1:this.text1,
          editing:this.editing
        };
      },

      changed: function(){
        console.log('emit model-change, id is ', this.id, ' _id is ', this._id);
        this.$emit('model-change',this.state());
      },

      remove: function(){
        this.$emit('model-delete',this.state());
      },

      done: function(){
        this.$emit('model-save',this.state());
      }
    },

    /**
     * watch for data changes
     */
    watch: {
      sync: function(){
        var _f;
        if(this.sync){
          _f = function(){
            console.log('sync called ');
            window.location.href += "/id/foo";
          };
        }
        //this.$on('model-change', _f);
        this.$on('model-save', _f);
      },
      _editing: function(x){
        this.editing = x;
      },
      // when name changes then...
      name: function(str){
        this.name = str;
        this.changed();
      },
      radio1: function(str){
        this.radio1 = str;
        this.changed();
      },
      text1: function(str){
        this.changed();
      }
    }
}));

