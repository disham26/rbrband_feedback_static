var issues_vue = Vue.component('admin-issues', {
    template: "#admin_issues",
    props: ["_issuetype", "_email"],
    data: function() {
        return {
            issueType: '',
            searchByTablename:'table_name',
            searchedTableName:'',
            searchBySubmittedValue:'submitted_value',
            searchedSubmittedValue:'',
            searchByTitle:'title',
            searchedTitle:'',
            searchByState:'state',
            searchedState:'',
            searchByAssignedTo:'assigned_to',
            searchedAssignedTo:'',
            searchByTag:'tag',
            searchedTag:'',
            email: '',
            hasIssues: false,
            isLoading: false,
            searchBy: '',
            show_items:[],
            search:null,
            searched:null,
            isAscending:true,
            checkedColumns:[],
            length:0,
            issues: [
                // {
                //     table_name:'',
                //     submitted_value:'',
                //     title:'',
                //     state:'',
                //     assigned_to:'',
                //     tag:''
                // }
            ],
            prompt: {
                title: 'Assign this ticket to',
                ok: 'Assign',
                cancel: 'Cancel',
                id: 'name',
                name: 'name',
                placeholder: 'Select the name...',
                maxlength: 50,
                value: '',
                issue_id: ''
            },
            prompt_submit: {
                title: 'Submit Value for this ticket',
                ok: 'Assign',
                cancel: 'Cancel',
                id: 'name',
                name: 'name',
                placeholder: 'Value...',
                maxlength: 50,
                value: '',
                issue_id: ''
            }

        };
    },

    created: function() {
        this.issueType = this._issuetype;
        this.email = this._email;

        this.reset(this.issueType);
        

    },

    methods: {
        reset: function(issueText) {
            //show issues
          //  console.log("reset called, issueType is",issueText);
            this.searchedTableName='';
            this.searchedTitle='';
            this.searchedTag='';
            this.searchedState='';
            this.searchedSubmittedValue='';
            this.searchedAssignedTo='';
            var _this = this;
            _this.isLoading = true;
            _this.hasIssues = false;
            var url = "/admin/json/issues/type/" + issueText;
            $.getJSON(url, function(data) {

                if (data.success) {
                    _this.isLoading = false;
                    _this.hasIssues = true;
                    _this.issueType = issueText;
                    _this.issues = data.data;
                    _this.show_items = data.data;



                }else {
                    _this.isLoading = false;
                    _this.hasIssues = false;
                    _this.issueType = issueText;

                }
            });
        },

        openDialog(ref, issue_id, state) {

            this.prompt.issue_id = issue_id;
            this.$refs[ref].open();

        },
        closeDialog(ref) {
            this.$refs[ref].close();
        },
        onOpen() {

        },
        onOpenSubmit() {

        },
        onCloseSubmit(type, value, ref1) {
            var _this = this;
            if (type === 'ok') {
                var http = new XMLHttpRequest();
                var url = "/admin/json/issues/updateSubmitted";
                var currentIssueType = this.issueType;
                var params = 'issueId=' + this.prompt.issue_id + '&submittedValue=' + this.prompt_submit.value + '&updatedBy=' + this.email;
                http.open('POST', url, true);

                //Send the proper header information along with the request
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                http.onreadystatechange = function() {
                    //Call a function when the state changes.
                    if (http.readyState == 4 && http.status == 200) {
                      //console.log("callReset Called");
                      _this.reset(currentIssueType);
                    }
                }
                http.send(params);
                this.prompt_submit.value = '';
            } else {
                this.prompt_submit.value = '';
            }

        },

        onClose(type, value, ref1) {
          var _this = this;
            if (type === 'ok') {
                var http = new XMLHttpRequest();
                var url = "/admin/json/issues/updateAssigned";
                var currentIssueType = this.issueType;
                var params = 'issueId=' + this.prompt.issue_id + '&assignedTo=' + this.prompt.value + '&updatedBy=' + this.email;
                
                http.open('POST', url, true);

                //Send the proper header information along with the request
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                http.onreadystatechange = function() {
                    //Call a function when the state changes.
                    if (http.readyState == 4 && http.status == 200) {
                      //console.log("issueType is",currentIssueType);
                       // console.log("callReset Called");
                        _this.reset(currentIssueType);
                    }
                }
                http.send(params);
               // this.reset(this.issueType);
                this.prompt.value = '';
            } else {
                this.prompt.value = '';
            }

        },
        searchTable: function(){
        this.show_items= this.issues;
        if(this.searchedTableName){   
                    this.searchOnTable(this.searchByTablename, this.searchedTableName);}
        if(this.searchedSubmittedValue){
                    this.searchOnTable(this.searchBySubmittedValue, this.searchedSubmittedValue);
        }

        if(this.searchedTitle){
            this.searchOnTable(this.searchByTitle,this.searchedTitle);
        }

        if(this.searchedState){
            this.searchOnTable(this.searchByState,this.searchedState);
        }

        if(this.searchedAssignedTo){
            this.searchOnTable(this.searchByAssignedTo,this.searchedAssignedTo);
        }

        if(this.searchedTag){
        this.searchOnTable(this.searchByTag,this.searchedTag);            
        }

        return this.show_items;

      },
      searchOnTable: function (field, str) {
        this.show_items = _.filter(this.show_items, function(x){
          return x[field].toLowerCase().indexOf(str.toLowerCase()) > -1;
        });
      },

      sortByAsc: function(field){
        this.show_items = _.sortBy(this.issues, function(x){
          return x[field];
        });
      },

      sortByDesc: function(field){
        this.show_items = _.sortBy(this.issues, function(a,b){
          return b[field]-a[field];
        });
      },
      sortOrder: function(field){
        this.isAscending=!this.isAscending;

      },
      sortById: function(){

      },



      sortTable:function(colIndex){
        
        if(this.isAscending){
          a = this.show_items.sort(sortFunctionAsc);
          this.isAscending=!this.isAscending;
        }else{
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

    

    }
});