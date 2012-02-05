require(['trie'], function(Trie) {

	// Contructor
	// ----------
	
	function Contructor() { };
	registerTestSuite(Contructor);

	Contructor.prototype = {
		
		returnsObjectContainingTrie : function() {
			var Test = new Trie;
			expectThat(test, recursivelyEquals({ data : [] }));
		}
		
	};

	// Insert
	// ------
	
	function Insert() { };
	registerTestSuite(Insert);

	Insert.prototype = {
		
		insertsASinglePathIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c'], 'c');

			expectEq(Test.data, { c : { value : cat } });
		},

		insertsMultiplePathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');

			expectEq(Test.data, { c : { a : { t : { value : 'cat' } } } });
		},

		insertsASinglePathIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'n'], 'can');
			Test.insert(['c'], 'c');

			expectEq(Test.data, { 
				c : { 
					value : 'c',
					a : { 
						t : { value : 'cat' },
						n : { value : 'can' },
					}
				}
			});
		},

		insertsMultiplePathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'n'], 'can');
			Test.insert(['c', 'a', 'p'], 'cap');

			expectEq(Test.data, { 
				c : { 
					a : { 
						t : { value : 'cat' },
						n : { value : 'can' },
						p : { calue : 'cap' }
					}
				}
			});
		},

		overWritesExistingValue : function() {
			var Test = new Trie;
			Test.insert(['a', 'b'], 'ab');
			Test.insert(['a', 'b'], 'ab');

			expectEq(Test.data, { a : { b : 'ab' } });
		},

		returnsThis : function() {
			var Test = new Trie;
			expectEq(Test.insert(['a', 'b', 'c']), Test);
		}
		
	};

	// Delete
	// ------
	
	function Delete() { };
	registerTestSuite(Delete);

	Delete.prototype = {
		
		deletesASinglePath : function() {
			var Test = new Trie;
			Test.insert(['c'], 'c');
			Test.delete(['c']);

			expectEq(Test.data, { });
		},

		deletesANestedPath : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'c');
			Test.delete(['c']);

			expectEq(Test.data, { });
		},

		doesNotDeleteAnythingIfEmpty : function() {
			var Test = new Trie;
			Test.delete(['c']);

			expectEq(Test.data, { });
		},

		doesNotDeleteAnythingIfDoesNotExist : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.delete(['c', 'a']);
			expectEq(Test.data, { c : { a : { t : { value : 'cat' } } } });
		},

		returnsThis : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			expectEq(Test.delete(['c', 'a', 't']), Test);
		}
		
	};

	// Each
	// ----
	
	function Each() { };
	registerTestSuite(Each);

	Each.prototype = {
		
		returnsThis : function() {
			
		}
		
	};

	// Map
	// ---
	
	function Map() { };
	registerTestSuite(Map);

	Map.prototype = {
		
		returnsThis : function() {
			
		}
		
	};

	// Filter
	// ------
	
	function Filter() { };
	registerTestSuite(Filter);

	Filter.prototype = {
		
		returnsThis : function() {
			
		}
		
	};

	// Find
	// ----
	
	function Find() { };
	registerTestSuite(Find);

	Find.prototype = {
		
		returnsThis : function() {
			
		}
		
	};

	// Has
	// ---
	
	function Has() { };
	registerTestSuite(Has);

	Has.prototype = {
		
		returnsValueIfExists : function() {
			var Test = new Trie;
			Test.insert(['c'], 'c');
			expectEq(Test.has(['c']), 'c');
		},

		returnsValueInNestedTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			expectEq(Test.has(['c', 'a', 't']), 'cat');
		},

		returnsFalseIfNotFound : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			expectEq(Test.has(['c', 'a', 'p']), false);
		},

		returnsFalseIfEmptyTrie : function() {
			var Test = new Trie;
			expectEq(Test.has(['c', 'a', 't']), false);
		}
		
	};

});
