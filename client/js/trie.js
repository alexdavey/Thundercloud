define('trie', function() {

	// Recursively follows the array of paths until it cannot
	function decend(array, paths) {
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
				return { remaining : paths.slice(i), end : false, node : current };
			}

		}

		return { remaining : [], end : true, node : current };
	}

	function hasChild(node, path) {
		for (var i in node) {
			if (_.contains(path, i)) {
				return node[i]; 
			}
		}

		return false;
	}

	function iterate(paths) {
		var current = this.data;
		for (var i in current) {
			var next = hasChild(current, paths[i]);
			if (next !== false) {
				return iterate(paths, next);
			} 
		}

		return false;
	}


	// Returns the node with a given set of 
	// paths or false if it does not exist
	function find(array, paths) {
		var furthest = decend(array, paths);

		return furthest.end && furthest.node;
	}

	function Trie(data) {
		this.data = {};
	}

	Trie.prototype = {
		
		// Inserts a node given a path
		insert : function(paths, value, data) {
			var current = data || this.data,
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

		pushList : function(paths, value, data) {
			// Get the parent element to the target
			var furthest = decend(data || this.data, paths),
				node     = furthest.node,
				rest     = furthest.remaining;

			// If the node already exists, push the value onto it
			// otherwise insert an array with the value
			if (furthest.end) {
				if (_.isArray(node.value)) {
					node.value.push(value);
				} else {
					node.value = [value];
				}
			} else {
				this.insert(rest, [value], node);
			}

			return this;
		},

		// Deletes a node in the trie with a given path
		delete : function(paths, data) {
			// Get the parent element to the target
			var parent = find(data || this.data, _.initial(paths)),
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

		// Returns an array of the values which 
		// have the given paths
		keyFilter : function(paths) {
			return iterate(this.data);
		},

		// Yields each node that satisfies the predicate
		// to the iterator
		filter : function(predicate, fn) {
			
		},

		// Deletes all nodes which satisfy the predicate
		deleteWhen : function(predicate) {
			
		},

		// Returns the value of a node given its path
		has : function(paths, data) {
			var node = find(data || this.data, paths);
			return node ? node.value : false;
		}

	};

	return Trie;

});
