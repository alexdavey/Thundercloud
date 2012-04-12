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

		insertsSingleMultiCharacterPathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['cat', 'dog', 'bear'], 'animal');
			expectThat(Test.data, recursivelyEquals({
				cat : { dog : { bear : { value : 'animal' }  } },
			}));
		},

		insertsMultipleMultiCharacterPathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['cat', 'dog'], 'animal');
			Test.insert(['cod', 'bass'], 'fish');
			expectThat(Test.data, recursivelyEquals({
				cat : { dog : { value : 'animal' } },
				cod : { bass : { value : 'fish' } }
			}));
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

		insertsSingleMultiCharacterPathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['cat', 'dog', 'bear'], 'animal');
			expectThat(Test.data, recursivelyEquals({
				c : { a : { t : { value : 'cat' } } },
				cat : { dog : { bear : { value : 'animal' } } },
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

		insertsMultipleMultiCharacterPathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['cat', 'dog'], 'animal');
			Test.insert(['cod', 'bass'], 'fish');
			expectThat(Test.data, recursivelyEquals({
				c : { a : { t : { value : 'cat' } } },
				cat : { dog : { value : 'animal' } },
				cod : { bass : { value : 'fish' } }
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

		singleMultiCharacterKeysAreReturned : function() {
			var Test = new Trie;
			Test.insert(['cat'], 'cat');
			Test.insert(['ant'], 'ant');
			Test.insert(['turtle'], 'turtle');
			expectThat(Test.keyFilter(['cat', 'ant', 'turtle']), recursivelyEquals(['cat', 'ant', 'turtle']));
		},

		multipleLayerKeysAreReturned : function() {
			var Test = new Trie;
			Test.insert(['c', 'a', 't'], 'cat');
			Test.insert(['c', 'a', 'b'], 'cab');
			Test.insert(['t'], 't');
			expectThat(Test.keyFilter(['c', 'a', 't']), recursivelyEquals(['cat', 't']));
		},

		multipleLayerMultiCharacterKeysAreReturned : function() {
			var Test = new Trie;
			Test.insert(['cat', 'ant', 'turtle'], 'animal');
			Test.insert(['mouse', 'red', 'blue'], '?');
			Test.insert(['cat'], 'life');
			expectThat(Test.keyFilter(['cat', 'ant', 'turtle']), recursivelyEquals(['animal', 'life']));
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

		pushesSingleMultiCharacterPathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.pushList(['cat', 'dog', 'bear'], 'animal');
			expectThat(Test.data, recursivelyEquals({
				cat : { dog : { bear : { value : ['animal'] }  } },
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

		pushesMultipleMultiCharacterPathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.pushList(['cod', 'bass'], 'fish');
			expectThat(Test.data, recursivelyEquals({
				cat : { dog : { value : 'animal' } },
				cod : { bass : { value : ['fish'] } }
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

		pushesSingleMultiCharacterPathsIntoNonEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'd'], 'change directory');
			Test.pushList(['cat', 'dog', 'bear'], 'animal');
			expectThat(Test.data, recursivelyEquals({
				c : { d : { value : 'change directory'} },
				cat : { dog : { bear : { value : ['animal'] }  } },
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

		pushesMultipleMultiCharacterPathsIntoEmptyTrie : function() {
			var Test = new Trie;
			Test.insert(['c', 'd'], 'change directory');
			Test.pushList(['cod', 'bass'], 'fish');
			expectThat(Test.data, recursivelyEquals({
				c : { d : { value : 'change directory'} },
				cod : { bass : { value : ['fish'] } }
			}));
		},

		overwritesExistingValue : function() {
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
			Test.insert(['c', 'ant', 't'], 'c');
			Test.delete(['c', 'ant', 't']);

			expectThat(Test.data, recursivelyEquals({ c : { ant : { } } }));
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
		
		returnsKeyValueIfExists : function() {
			var Test = new Trie;
			Test.insert(['c'], 'c');
			expectEq(Test.has(['c']), 'c');
		},

		returnsMultiCharacterValueIfExists : function() {
			var Test = new Trie;
			Test.insert(['cat'], 'cat');
			expectEq(Test.has(['cat']), 'cat');
		},

		returnsNestedMultiCharacterValueIfExists : function() {
			var Test = new Trie;
			Test.insert(['a', 'cat'], 'cat');
			expectEq(Test.has(['a', 'cat']), 'cat');
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
