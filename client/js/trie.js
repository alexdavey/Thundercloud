define('trie', function() {

	var nill = {};

	function find(array, paths) {
		var current = array,
			path;

		// Loop over all of the paths (eg the letters in
		// a word)
		for (var i = 0, l = paths.length; i < l; ++i) {

			// Cache the "letter"
			path = paths[i];

			// If the current node has a child with the 
			// correct name set the child as the current node
			if (path in current) {
				current = current[path];
			} else {
				// If there is no correct child, the path
				// does not exist
				return false;
			}

		}

		return current;
	}

	function Trie(data) {
		this.data = {};
	}

	Trie.prototype = {
		
		// Inserts a node given a path
		insert : function(paths, value) {
			var current = this.data,
				path;

			// Loop over all of the paths (eg the letters in
			// a word)
			for (var i = 0, l = paths.length; i < l; ++i) {

				// Cache the "letter"
				path = paths[i];

				// If the current node has a child with the 
				// correct name set the child as the current node
				if (path in current) {
					current = current[path];
				} else {
					current = current[path] = {};
				}

			}

			current.value = value;

			return this;
		},

		// Deletes a node in the trie with a given path
		delete : function(paths) {
			// Get the parent element to the target
			var parent = find(this.data, _.initial(paths)),
				last   = _.last(paths);

			// If parent === false, then the target does
			// not exist, otherwise delete it
			if (parent && last in parent && 'value' in parent[last]) delete parent[last];

			return this;
		},

		// Iterates over all of the nodes in depth first
		// order yielding each one to an iterator
		each : function(fn) {

		},

		// Maps over all of the nodes in depth first order,
		// the node's new value is the value returned
		map : function() {
			
		},

		// Returns an array of the value(s) which 
		// satisfy the predicate
		find : function(predicate) {
			
		},

		// Yields each function that satisfies the predicate
		// to the iterator
		filter : function(predicate, fn) {
			
		},

		// Deletes all nodes which satisfy the predicate
		deleteWhen : function(predicate) {
			
		},

		// Returns the value of a node given its path
		has : function(paths) {
			var node = find(this.data, paths);
			return node ? node.value : false;
		}

	};

	return Trie;

});
