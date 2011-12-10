define(['actions'], function(actions) {

	return;

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
	var template = _.template('<ul>' +
								'<% _.(items).pluck(0).each(function(item) { %>' + 
										'<li> <%=item %> </li> <%' +
									'}) %>' + 
						      '</ul>');
	
	// Create html strings from the template
	var html = _.map(dropdowns, function(dropdown) {
		return template({ items : dropdown[1] });
	});

	// Wrap the html in a div, and hide the div
	var dropdowns = _.map(html, function(innerHTML, key) {
		return _.addElement({
			id : dropdownList[key][0], // Name of the dropdown menu
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
