define('trie', function() {

	var nill = {};

	function find(array, paths) {
		var current = array,
			path;

		// Loop over all of the paths (eg the letters in
		// a word)
		for (var i = 0, l = paths.length; ++i) {

			// Cache the "letter"
			path = paths[i];

			// If the current node has a child with the 
			// correct name set the child as the current node
			if (path in current) {
				current = current[path];
			} else {
				// If there is no correct child, the path
				// does not exist
				return null;
			}

		}

		return current;
	}

	function Trie(data) {
		this.data = {};
	}

	Trie.prototype = {
		
		insert : function(paths, value) {
			var current = this.data,
				path;

			// Loop over all of the paths (eg the letters in
			// a word)
			for (var i = 0, l = paths.length; ++i) {

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

			current = { value : value };

			return this;
		},

		delete : function(paths) {
			// Get the parent element to the target
			var parent = find(_.init(paths)),
				last   = _.last(paths);

			// If parent === false, then the target does
			// not exist, otherwise delete it
			if (parent && last in parent) delete[last];

			return this;
		},

		has : function(paths) {
			return find(this.data, paths).value;
		}

	};

	return Trie;

});
