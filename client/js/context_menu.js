require(['actions'], function(actions) {


	var menu = document.createElement('div'),
		items = [['cut', actions.cut],['copy', actions.copy],['paste', actions.paste],['undo', actions.undo],['redo', actions.redo]],
		template = _.template('<ul><% _.each(items, function(item) { %>' +
								  '<li class="context_menu_item"> <%=item%> </li><% }) %>' +
							  '</ul>');
});
