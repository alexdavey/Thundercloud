define(['actions'], function(actions) {

	"use strict";
	
	var menuItems = _.getClass('menu');

	// Temporary filler file until functionality
	// is added
	var noop = function() {  };
	
	var file = [['Open',  noop],
				['Close', noop],
				['Save',  noop]];
	
	var edit = [['Undo',  actions[90]],
				['Redo',  actions[89]],
				['Cut',   actions[88]],
				['Copy',  actions[67]],
				['Paste', actions[86]]];
	
	var dropdownList = [['file', file], ['edit', edit]];

	// Create a template to render a list with the names of the operations
	var template = _.template('<ul id="<%= name %>">' +
			'<% _.each(items, function(x) { %> <li> <%= x[0] %> </li> <% }) %> </ul>');
	
	var html = _.map(dropdowns, function(dropdown) {
		return template({ items : dropdown[1], name : dropdown[0] });
	});

	var dropdowns = _.map(html, function(innerHTML) {
		return _.addElement({
			tag : 'div',
			innerHTMl : innerHTML,
			css : {
				display : 'none',
				width : '100px',
				height : '100px'
			}
		});
	});

	_.each(dropdowns, menu.appendChild);
	
	// Listen for click events on the menubar 
	// to show the dropdown
	_.listen(menuItems, 'click', function() {
		createDropdown(this.id);
	});



});
