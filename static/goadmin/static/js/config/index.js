default_templates = [{"name":'page_add_phone',
		      forms:[{'name':'textbox'}],
		      infos:[{name:"phone",icon:"credit_card",label:"card",desc:"asdasd"}],
		      links:[{name:"se",icon:"settings",label:"Settings","link":"#a"},
			     {name:"search",icon:"search",label:"Search","link":"#a"},
			     {name:"logs",icon:"info",label:"View logs","link":"#a"}],
		      items:[{name:"phone",link:"/admin/phone",icon:"phone",label:"Phone",desc: "aa"},
			     {name:"card",icon:"credit_card",label:"Card",desc: "aa"},
			     {name:"user",icon:"face",label:"User",desc: "aa"}]}];

forms = [{label:'Enter phone','name':'phone'},
	 {label:'Secondary phone','name':'phone'},
	 {label:'Bank','name':'textbox','defaultt':'ICICI Bank'}];
