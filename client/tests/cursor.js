require(['cursor', 'text'], function(cursor, Text) {
	
	
	"use strict";

	var text = _.clone(Text);

	var contents = Array(21).join('-');
	text.source  = [];

	for (var i = 0; i < 50; ++i) {
		text.source[i] = contents;
	}

	// AtEndOFLine
	// -----------

	function AtEndOfLine() { }
	registerTestSuite(AtEndOfLine);

	AtEndOfLine.prototype = {
		
		endOfLineReturnsTrue : function() {
			cursor.col = 20;
			expectThat(cursor.atEndOfLine(), evalsToTrue);
		},

		notEndOfLineReturnsFalse : function() {
			cursor.col = 10;
			expectThat(cursor.atEndOfLine(), evalsToFalse);
		},

		beginningOfLineReturnsFalse : function() {
			cursor.col = 0;
			expectThat(cursor.atEndOfLine(), evalsToFalse);
		}

	};


	// AtStartOfLine
	// -------------

	function AtStartOfLine() { }
	registerTestSuite(AtStartOfLine);

	AtStartOfLine.prototype = {
		
		
		beginningOfLineReturnsTrue : function() {
			cursor.col = 0;
			expectThat(cursor.atStartOfLine(), evalsToTrue);
		},

		notEndOfLineReturnsFalse : function() {
			cursor.col = 5;
			expectThat(cursor.atStartOfLine(), evalsToFalse);
		},

		endOfLineReturnsFalse : function() {
			cursor.col = 10;
			expectThat(cursor.atStartOfLine(), evalsToFalse);
		}

	};


	// OnLastLine
	// ----------

	function OnLastLine() { }
	registerTestSuite(OnLastLine);

	OnLastLine.prototype = {
		
		
		atLastLineReturnsTrue : function() {
			cursor.row = 49;
			expectThat(cursor.onLastLine(), evalsToTrue);
		},

		notAtLastLineReturnsFalse : function() {
			cursor.row = 25;
			expectThat(cursor.onLastLine(), evalsToFalse);
		},

		atFirstLineReturnsFalse : function() {
			cursor.row = 0;
			expectThat(cursor.onLastLine(), evalsToFalse);
		}

	};


	// OnFirstLine
	// -----------

	function OnFirstLine() { }
	registerTestSuite(OnFirstLine);

	OnFirstLine.prototype = {
		
		atFirstLineReturnsTrue : function() {
			cursor.row = 0;
			expectThat(cursor.onFirstLine(), evalsToTrue);
		},

		notAtLastLineReturnsFalse : function() {
			cursor.row = 25;
			expectThat(cursor.onFirstLine(), evalsToFalse);
		},

		atLastLineReturnsFalse : function() {
			cursor.row = 50;
			expectThat(cursor.onFirstLine(), evalsToFalse);
		}

	};


	// // MoveTo
	// // ------

	// function MoveTo() { }
	// registerTestSuite(MoveTo);

	// MoveTo.prototype = {
	// 	
	// 	canMoveColumn : function() {

	// 	},

	// 	canMoveRow : function() {

	// 	},

	// 	cannotMovePastEndOfLine : function() {
	// 		
	// 	},

	// 	cannotMoveBeforeBeginningOfLine : function() {
	// 		
	// 	},

	// 	cannotMoveBeforeFirstRow : function() {
	// 		
	// 	},

	// 	cannotMovePastLastRow : function() {
	// 		
	// 	}

	// };


	// Shift
	// -----

	function Shift() { }
	registerTestSuite(Shift);

	Shift.prototype = {
		
		defaultsToOneMagnitude : function() {
			cursor.shift('up');
			expectEq(cursor.row, 49);
			expectEq(cursor.col, 10);
		},

		canShiftLeft : function() {
			cursor.shift('left', 5);
			expectEq(cursor.row, 49);
			expectEq(cursor.col, 5);
		},

		canShiftRight : function() {
			cursor.shift('right', 2);
			expectEq(cursor.row, 49);
			expectEq(cursor.col, 7);
		},


		canShiftUp : function() {
			cursor.shift('up', 3);
			expectEq(cursor.row, 46);
			expectEq(cursor.col, 7);
		},

		canShiftDown : function () {
			cursor.shift('down', 2);
			expectEq(cursor.row, 48);
			expectEq(cursor.col, 7);
		},

		cannotShiftRightPastEndOfLine : function() {
			cursor.shift('right', 100);
			expectEq(cursor.row, 48);
			expectEq(cursor.col, 20);
		},

		cannotShiftLeftPastBeginningOfLine : function() {
			cursor.shift('left', 100);
			expectEq(cursor.row, 48);
			expectEq(cursor.col, 0);
		},

		cannotShiftUpPastBeginningOfText : function() {
			cursor.shift('up', 100);
			expectEq(cursor.row, 0);
			expectEq(cursor.col, 0);
		},

		cannotShiftDownPastEndOfText : function() {
			cursor.shift('down', 100);
			expectEq(cursor.row, 49);
			expectEq(cursor.col, 0);
		}

	};


});
