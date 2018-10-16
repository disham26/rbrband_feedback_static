//bfstatic/goadmin/static/js/config/featurename.js
FeatureName = Vue.component('feature-test-table', CommonRest.extend({
 template: '#feature_test_table',
 props: ["_dummy","_sortAscValue","_items"],
 data: function(){
  return {
            //template variables must be defined here
            dummy: 'this is text',
            search: null,
            searchBy: 'name',
            sortDescValue: null,
            searched: null,
            sortAscValue:null,
            isAscending:true,
            show_items:[],
            items: [
            {
              id: 1,
              name: "Shawna Dubbin",
              email: "sdubbin0@geocities.com",
              gender: "Male",
              title: "Assistant Media Planner"
            },
            {
              id: 2,
              name: "Odette Demageard",
              email: "odemageard1@spotify.com",
              gender: "Female",
              title: "Account Coordinator"
            },
            {
              id: 3,
              name: "Vera Taleworth",
              email: "vtaleworth2@google.ca",
              gender: "Male",
              title: "Community Outreach Specialist"
            },
            {
              id: 4,
              name: "Lonnie Izkovitz",
              email: "lizkovitz3@youtu.be",
              gender: "Female",
              title: "Operator"
            },
            {
              id: 5,
              name: "Thatcher Stave",
              email: "tstave4@reference.com",
              gender: "Male",
              title: "Software Test Engineer III"
            },
            {
              id: 6,
              name: "Karim Chipping",
              email: "kchipping5@scribd.com",
              gender: "Female",
              title: "Safety Technician II"
            },
            {
              id: 7,
              name: "Helge Holyard",
              email: "hholyard6@howstuffworks.com",
              gender: "Female",
              title: "Internal Auditor"
            },
            {
              id: 8,
              name: "Rod Titterton",
              email: "rtitterton7@nydailynews.com",
              gender: "Male",
              title: "Technical Writer"
            },
            {
              id: 9,
              name: "Gawen Applewhite",
              email: "gapplewhite8@reverbnation.com",
              gender: "Female",
              title: "GIS Technical Architect"
            },
            {
              id: 10,
              name: "Nero Mulgrew",
              email: "nmulgrew9@plala.or.jp",
              gender: "Female",
              title: "Staff Scientist"
            },
            {
              id: 11,
              name: "Cybill Rimington",
              email: "crimingtona@usnews.com",
              gender: "Female",
              title: "Assistant Professor"
            },
            {
              id: 12,
              name: "Maureene Eggleson",
              email: "megglesonb@elpais.com",
              gender: "Male",
              title: "Recruiting Manager"
            },
            {
              id: 13,
              name: "Cortney Caulket",
              email: "ccaulketc@cbsnews.com",
              gender: "Male",
              title: "Safety Technician IV"
            },
            {
              id: 14,
              name: "Selig Swynfen",
              email: "sswynfend@cpanel.net",
              gender: "Female",
              title: "Environmental Specialist"
            },
            {
              id: 15,
              name: "Ingar Raggles",
              email: "iragglese@cbc.ca",
              gender: "Female",
              title: "VP Sales"
            },
            {
              id: 16,
              name: "Karmen Mines",
              email: "kminesf@topsy.com",
              gender: "Male",
              title: "Administrative Officer"
            },
            {
              id: 17,
              name: "Salome Judron",
              email: "sjudrong@jigsy.com",
              gender: "Male",
              title: "Staff Scientist"
            },
            {
              id: 18,
              name: "Clarinda Marieton",
              email: "cmarietonh@theatlantic.com",
              gender: "Male",
              title: "Paralegal"
            },
            {
              id: 19,
              name: "Paxon Lotterington",
              email: "plotteringtoni@netvibes.com",
              gender: "Female",
              title: "Marketing Assistant"
            },
            {
              id: 20,
              name: "Maura Thoms",
              email: "mthomsj@webeden.co.uk",
              gender: "Male",
              title: "Actuary"
            }
            ]
          };
        },

        watch: {
          searchBy: function(){
            console.log('sort by changed to ', this.searchBy);
        //this.sortByAsc(this.searchBy);
        this.sortByDesc(this.searchBy);
      }
    },

    methods: {

      reset: function(){
        console.log("Inside Reset");
        this.show_items = this.items;
        console.log("Reset, items are:",this.show_items);
        this.isAscending=true;
      },

      searchTable: function(){
        console.log('into searchTable')
        console.log("Searched is:",this.searched);
        if(!this.searched){
          console.log("going to reset")
          this.reset();
          return;
        }
        console.log("search ", this.searchBy, " for ", this.searched);
        this.searchOnTable(this.searchBy, this.searched);
        console.log("Searchontable finishedddddd,array is",this.show_items)


      },

      searchOnTable: function (field, str) {
        console.log("Inside searchOnTable");
        this.show_items = _.filter(this.items, function(x){
          return x[field].toLowerCase().indexOf(str.toLowerCase()) > -1;
        });
      },

      sortByAsc: function(field){
        console.log("inside sortbyasc")
        this.show_items = _.sortBy(this.items, function(x){
          return x[field];
        });
      },

      sortByDesc: function(field){
        console.log("inside sortbydesc")
        this.show_items = _.sortBy(this.items, function(a,b){
          return b[field]-a[field];
        });
      },
      sortOrder: function(field){
        console.log("Prasang function called, items are",this.show_items);
        console.log("isAscending is",this.isAscending);
        this.isAscending=!this.isAscending;

      },
      sortById: function(){

      },


      sortTable:function(colIndex){
        if(this.isAscending){
          console.log("Ascending sort")
          a = this.show_items.sort(sortFunctionAsc);
          this.isAscending=!this.isAscending;
        }else{
          console.log("Desending sort")
          a = this.show_items.sort(sortFunctionsDesc);
          this.isAscending=!this.isAscending;
        }
        function sortFunctionAsc(a, b) {
          if (a[colIndex] === b[colIndex]) {
            return 0;
          }
          else {
            return (a[colIndex] < b[colIndex]) ? -1 : 1;
          }
        }
        function sortFunctionsDesc(a, b) {
          if (a[colIndex] === b[colIndex]) {
            return 0;
          }
          else {
            return (a[colIndex] < b[colIndex]) ? 1 : -1;
          }
        }
        this.show_items=a;
        return a;
      }

    },
    
    created () {
      var _this = this;
    //this.searched = this.users
    if(_this._dummy){
      _this.dummy = _this._dummy;
    }
    console.log(_this._sortAscValue);
    console.log("Created called");
    this.show_items=_this._items;
    console.log("Created, items are:",this.show_items);
    this.reset();

  },





}));