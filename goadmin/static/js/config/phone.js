default_templates = [{"name":"page_add_phone",
		      templates:[{"name":'pick_role',
				  forms:[{name:"textbox","label":"textbox1 here",default:"textbox default here"},
					 {name:"textbox","label":"textbox2 here",default:"textbox default here"}],
				  infos:[{name:"foo",icon:"credit_card",label:"card"}],
				  xlinks:[{name:"settings",icon:"settings",label:"Settings","link":"#a"},
					  {name:"search",icon:"search",label:"Search","link":"#a"},
					  {name:"logs",icon:"info",label:"View logs","link":"#a"}],
				  items:[{name:"foo",icon:"credit_card",label:"card"},
					 {name:"foo",icon:"credit_card",label:"card"}]},
				 
				 {"name":'pick_partner',
				  items:[{name:"foo",icon:"credit_cardx",label:"card"},
					 {name:"food",icon:"credit_card",label:"card"}]},
				 {"name":'pick_outlet',
				  items:[{name:"foo",icon:"credit_cardx",label:"card"},
					 {name:"food",icon:"credit_card",label:"card"}]},
				 {"name":'pick_vehicle_brand',
				  items:[{name:"foo",icon:"credit_cardx",label:"card"},
					 {name:"food",icon:"credit_card",label:"card"}],
				  forms: [{'name':'phone'}]},
				 {"name":'pick_outlet',items:[]}]
		     }];

forms = [{label:'Enter phone','name':'phone'},
	 {label:'Secondary phone','name':'phone'},
	 {label:'Bank','name':'textbox','defaultt':'ICICI Bank'}];
