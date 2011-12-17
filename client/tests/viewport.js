require(['viewport', 'text'], function(viewport, text) {

	"use strict";
	
	text.source = Array(100);
	viewport.endRow = viewport.height = 50;

	// IsInside
	// --------

	function IsInside() { }
	registerTestSuite(IsInside);

	IsInside.prototype = {
		
		inMiddleReturnsTrue : function() {
			expectThat(viewport.isInside(25), evalsToTrue);
		},

		topBoundaryReturnsTrue : function() {
			expectThat(viewport.isInside(0), evalsToTrue);
		},

		bottomBoundaryReturnsTrue : function() {
			expectThat(viewport.isInside(50), evalsToTrue);
		},

		ifOutsideReturnsFalse : function() {
			expectThat(viewport.isInside(51), evalsToFalse);
		},

		negativeRowReturnsFalse : function() {
			expectThat(viewport.isInside(-100), evalsToFalse);
		}

	};


	// Shift
	// -----

	function Shift() { }
	registerTestSuite(Shift);

	Shift.prototype = {
		
		shiftsDownIfPositive : function() {
			viewport.shift(3);
			expectEq(viewport.startRow, 3);
			expectEq(viewport.endRow, 53);
		},

		shiftsUpIfNegative : function() {
			viewport.shift(-1);
			expectEq(viewport.startRow, 2);
			expectEq(viewport.endRow, 52);
		},

		doesNotShiftIfZero : function() {
			viewport.shift(0);
			expectEq(viewport.startRow, 2);
			expectEq(viewport.endRow, 52);
		},

		doesNotShiftPastTop : function() {
			viewport.shift(-1000);
			expectEq(viewport.startRow, 0);
			expectEq(viewport.endRow, 50);
		},

		doesNotShiftPastBottom : function() {
			viewport.shift(1000);
			expectEq(viewport.startRow, 50);
			expectEq(viewport.endRow, 100);
		}
		

	};



	// ShiftTo
	// -------

	function ShiftTo() { }
	registerTestSuite(ShiftTo);

	ShiftTo.prototype = {
		
		shiftsStart : function() {
			viewport.shiftTo('start', 5);
			expectEq(viewport.startRow, 5);
			expectEq(viewport.endRow, 55);
		},

		shiftsEnd : function() {
			viewport.shiftTo('end', 100);
			expectEq(viewport.startRow, 50);
			expectEq(viewport.endRow, 100);
		}

	};


});
