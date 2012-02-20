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

	function iterate(node, names) {
		// Get all of the children with keys in 'names'
		var children = hasChild(node, names),
			validChildren;

		if (!children) return false;

		// Iterate over all of the valid children nodes and check
		// if they have any valid children
		validChildren = _.filter(children, function(child) {
			return iterate(node[child], _.without(names, child));
		});

		validChildren = _.without(validChildren, false);

		return _.isEmpty(validChildren) && validChildren;
	}

	// Returns an array containing the children of a node which have
	// names in the specified list or false if no children match
	function hasChild(node, names) {
		var children      = Trie.prototype.children(node);
			validChildren =  _.keys(_.filter(node, function(value, key) {
			return _.include(names, key) && key != 'values';
		}));

		return _.isEmpty(validChildren) && validChildren;
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

		pushList : function(paths, newValue, data) {
			// Get the parent element to the target
			var furthest = decend(data || this.data, paths),
				node     = furthest.node,
				rest     = furthest.remaining;

			// If the node already exists, push the value onto it
			// otherwise insert an array with the value
			if (furthest.end) {
				_.isArray(node.value) ? node.value.push(newValue) : (node.value = [newValue]);
			} else {
				this.insert(rest, [newValue], node);
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

		// Return an array of 
		children : function (node) {
			return _.toArray(_.filter(node || this.data, function(value, key) {
				return key != 'values';
			}));
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
			return iterate(this.data, paths);
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
