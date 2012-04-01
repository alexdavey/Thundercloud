require(['trie'], function(Trie) {

	// Contructor
	// ----------
	
	function Contructor() { };
	registerTestSuite(Contructor);

	Contructor.prototype = {
		
		returnsObjectContainingTrie : function() {
			var Test = new Trie;
			expectEq(_.isObject(Test.data), true);
			expectEq(_.isObject(Test), true);
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

			expectThat(Test.data, recursivelyEquals({ c : { value : 'c' } }));
		},

		insertsMultiplePathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');

			expectThat(Test.data,
				recursivelyEquals({ c : { a : { t : { value : 'cat' } } } }));
		},

		insertsASinglePathIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'n'], 'can');
			Test.insert(['c'], 'c');

			expectThat(Test.data, recursivelyEquals({ 
				c : { 
					value : 'c',
					a : { 
						t : { value : 'cat' },
						n : { value : 'can' },
					}
				}
			}));
		},

		insertsMultiplePathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'n'], 'can');
			Test.insert(['c', 'a', 'p'], 'cap');

			expectThat(Test.data, recursivelyEquals({ 
				c : { 
					a : { 
						t : { value : 'cat' },
						n : { value : 'can' },
						p : { value : 'cap' }
					}
				}
			}));
		},

		overWritesExistingValue : function() {
			var Test = new Trie;
			Test.insert(['a', 'b'], 'ab');
			Test.insert(['a', 'b'], 'ab');

			expectThat(Test.data, recursivelyEquals({ a : { b : { value : 'ab' } } }));
		},

		returnsThis : function() {
			var Test = new Trie;
			expectEq(Test.insert(['a', 'b', 'c'], 'abc'), Test);
		}
		
	};

	// KeyFilter
	// ---------
	
	function KeyFilter() { };
	registerTestSuite(KeyFilter);

	KeyFilter.prototype = {

		singleKeysAreReturned : function() {
			var Test = new Trie;
			Test.insert(['c'], 'c');
			Test.insert(['a'], 'a');
			Test.insert(['t'], 't');
			expectThat(Test.keyFilter(['c', 'a', 't']), recursivelyEquals(['c', 'a', 't']));
		},

		multipleLayerKeysAreReturned : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'b'], 'cab');
			Test.insert(['t'], 't');
			expectThat(Test.keyFilter(['c', 'a', 't']), recursivelyEquals(['cat', 't']));
		},

		repeatingKeysAreNotCounted : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 'a', 't'], 'caat');
			expectThat(Test.keyFilter(['c', 'a', 't']), recursivelyEquals([]));
		},

		returnsEmptyArrayIfNoTrie : function() {
			var Test = new Trie;
			expectThat(Test.keyFilter(['c']), recursivelyEquals([]));
		},
		
		returnsEmptyArrayIfNoMatches : function() {
			var Test = new Trie;
			expectThat(Test.keyFilter(['c', 'a', 't']), recursivelyEquals([]));
		},

		returnsEmptyArrayIfNoKeys : function () {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			expectThat(Test.keyFilter(), recursivelyEquals([]));
		}
		
	};

	// PushList
	// ------
	
	function PushList() { };
	registerTestSuite(PushList);

	PushList.prototype = {
		
		insertsASinglePathIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.pushList(['c'], 'c');

			expectThat(Test.data, recursivelyEquals({ c : { value : ['c'] } }));
		},

		insertsMultiplePathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.pushList(['c', 'a', 't'], 'cat');

			expectThat(Test.data,
				recursivelyEquals({ c : { a : { t : { value : ['cat'] } } } }));
		},

		insertsASinglePathIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'n'], 'can');
			Test.pushList(['c'], 'c');

			expectThat(Test.data, recursivelyEquals({ 
				c : { 
					value : ['c'],
					a : { 
						t : { value : 'cat' },
						n : { value : 'can' },
					}
				}
			}));
		},

		pushesASinglePathIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'n'], 'can');
			Test.insert(['c'], ['a']);
			Test.pushList(['c'], 'b');

			expectThat(Test.data, recursivelyEquals({ 
				c : { 
					value : ['a', 'b'],
					a : { 
						t : { value : 'cat' },
						n : { value : 'can' },
					}
				}
			}));
		},

		insertsMultiplePathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.pushList(['c', 'a', 't'], 'cat');
			Test.pushList(['c', 'a', 'n'], 'can');
			Test.pushList(['c', 'a', 'p'], 'cap');

			expectThat(Test.data, recursivelyEquals({ 
				c : { 
					a : { 
						t : { value : ['cat'] },
						n : { value : ['can'] },
						p : { value : ['cap'] }
					}
				}
			}));
		},

		pushesMultiplePathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.pushList(['c', 'a', 't'], 'cat');
			Test.pushList(['c', 'a', 't'], 'can');
			Test.pushList(['c', 'a', 't'], 'cap');

			expectThat(Test.data, recursivelyEquals({ 
				c : { 
					a : { 
						t : { value : ['cat', 'can', 'cap'] },
					}
				}
			}));
		},

		overWritesExistingValue : function() {
			var Test = new Trie;
			Test.insert(['a', 'b'], 'ab');
			Test.pushList(['a', 'b'], 'ab');

			expectThat(Test.data, recursivelyEquals({ a : { b : { value : ['ab'] } } }));
		},

		pushesOntoExistingList : function() {
			var Test = new Trie;
			Test.insert(['a', 'b'], ['ab']);
			Test.pushList(['a', 'b'], 'bc');

			expectThat(Test.data, recursivelyEquals({ a : { b : { value : ['ab', 'bc'] } } }));
		},

		returnsThis : function() {
			var Test = new Trie;
			expectEq(Test.pushList(['a', 'b', 'c'], 'abc'), Test);
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

			expectThat(Test.data, recursivelyEquals({ }));
		},

		deletesANestedPath : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'c');
			Test.delete(['c', 'a', 't']);

			expectThat(Test.data, recursivelyEquals({ c : { a : { } } }));
		},

		doesNotDeleteAnythingIfEmpty : function() {
			var Test = new Trie;
			Test.delete(['c']);

			expectThat(Test.data, recursivelyEquals({ }));
		},

		doesNotDeleteAnythingEvenIfPathIsAPrefix : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.delete(['c', 'a']);

			expectThat(Test.data,
				recursivelyEquals({ c : { a : { t : { value : 'cat' } } } }));
		},

		doesNotDeleteAnythingIfDoesNotExist : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.delete(['c', 'b']);
			expectThat(Test.data, 
				recursivelyEquals({ c : { a : { t : { value : 'cat' } } } }));
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
