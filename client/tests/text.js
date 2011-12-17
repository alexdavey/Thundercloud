require(['text'], function(text) {
	

// Utility
// -------

"use strict";

function Text() {
	return _.extend(text, {
		source : ['123', 'abc', 'def']
	});
}


// LineLength
// ----------

function LineLength() { }
registerTestSuite(LineLength);

LineLength.prototype = {

	returnsCorrectLineLength : function() {
		expectEq(3, Text().lineLength(0));
	},

	returnsMinusOneOnInvalidLine : function() {
		expectEq(-1, Text().lineLength(-100));
	}

};


// AddLine
// -------

function AddLine() { }
registerTestSuite(AddLine);

AddLine.prototype = {
	
	addsANewLine : function() {
		var text = Text();
		text.addLine(3, 'ghi');
		expectThat(text.source, elementsAre(['123', 'abc', 'def', 'ghi']));
	},

	addsAnEmptyLineIfEmptyString : function() {
		var text = Text();
		text.addLine(0, '');
		expectThat(text.source, elementsAre(['', '123', 'abc', 'def']));
	},

	addsEmptyLineIfOnlyOneParameter : function() {
		var text = Text();
		text.addLine(0);
		expectThat(text.source, elementsAre(['', '123', 'abc', 'def']));
	}

};


// RemoveLine
// ----------

function RemoveLine() { }
registerTestSuite(RemoveLine);

RemoveLine.prototype.removesSingleLine = function() {
	var text = Text();
	text.removeLine(0);
	expectThat(text.source, elementsAre(['abc', 'def']));
};


// RemoveLines
// -----------

function RemoveLines() { }
registerTestSuite(RemoveLines);

RemoveLines.prototype = {
	
	removesMultipleLines : function() {
		var text = Text();
		text.removeLines(0, 1);
		expectThat(text.source, elementsAre(['def']));
	},

	removesSingleLineIfStartAndStopSame : function() {
		var text = Text();
		text.removeLines(0, 0);
		expectThat(text.source, elementsAre(['abc', 'def']));
	},

	onlyLeavesStringIfAllLinesSelected : function() {
		var text = Text();
		text.removeLines(0,  2);
		expectThat(text.source, elementsAre(['']));
	}

};


// RemoveSection
// -------------

function RemoveSection() { }
registerTestSuite(RemoveSection);

RemoveSection.prototype = {
	
	removesMiddleOfLine : function() {
		var text = Text();
		text.removeSection(0, 1, 2);
		expectThat(text.source, elementsAre(['13', 'abc', 'def']));
	},

	normalisesWronglyOrderedStartEndPoints : function() {
		var text = Text();
		text.removeSection(0, 2, 1);
		expectThat(text.source, elementsAre(['13', 'abc', 'def']));
	},

	doesNotRemoveAnythingIfNothingSelected : function() {
		var text = Text();
		text.removeSection(0, 0, 0);
		expectThat(text.source, elementsAre(['123', 'abc', 'def']));
	},

	deletesLineIfEverythingSelected : function() {
		var text = Text();
		text.removeSection(0, 0, 3);
		expectThat(text.source, elementsAre(['abc', 'def']));
	}

};


// RemoveSelection
// ---------------

function RemoveSelection() { }
registerTestSuite(RemoveSelection);

RemoveSelection.prototype = {
	
	removesSingleLine : function() {
		var text = Text();
		text.removeSelection(0, 0, 0, 1);
		expectThat(text.source, elementsAre(['23', 'abc', 'def']));
	},

	removesTwoLines : function() {
		var text = Text();
		text.removeSelection(0, 0, 1, 1);
		expectThat(text.source, elementsAre(['bc', 'def']));
	},

	removesThreeLines : function() {
		var text = Text();
		text.removeSelection(0, 1, 2, 1);
		expectThat(text.source, elementsAre(['1ef']));
	},

	normalisesWronglyOrderedStartEndPoints : function() {
		var text = Text();
		text.removeSelection(1, 1, 0, 0);
		expectThat(text.source, elementsAre(['bc', 'def']));
	},

	removesAllIfAllSelected : function() {
		var text = Text();
		text.removeSelection(0, 0, 2, 3);
		expectThat(text.source, elementsAre(['']));
	},

	doesNotRemoveAnythingIfNothingSelected : function() {
		var text = Text();
		text.removeSelection(1, 1, 1, 1);
		expectThat(text.source, elementsAre(['123', 'abc', 'def']));
	}

};


// Append
// ------

function Append() { }
registerTestSuite(Append);

Append.prototype = {
	
	appendsToEndOfLine : function() {
		var text = Text();
		text.append('4', 0);
		expectThat(text.source, elementsAre(['1234', 'abc', 'def']));
	},

	appendsNothingIfEmptyString : function() {
		var text = Text();
		text.append('', 0);
		expectThat(text.source, elementsAre(['123', 'abc', 'def']));
	}

};

// LineSection
// -----------

function LineSection() { }
registerTestSuite(LineSection);

LineSection.prototype = {
	
	returnsLineSection : function() {
		expectEq(Text().lineSection(0, 0, 1), '1');
	},

	returnsEmptyStringIfNothingSelected : function() {
		expectEq(Text().lineSection(0, 0, 0), '');
	},

	selectsUpToEndOfLineIfSecondParamOmitted : function() {
		expectEq(Text().lineSection(0, 1), '23');
	},

	normalizesWronglyOrderedStartEndPoints : function() {
		expectEq(Text().lineSection(0, 1, 0), '1');
	}

};


// Selection
// ---------

function SelectLines() { }
registerTestSuite(SelectLines);

SelectLines.prototype = {
	
	returnsTwoLines : function() {
		expectEq(Text().selectLines(0, 1), '123\nabc\n');
	},

	returnsOneLineIfStartAndStopEqual : function() {
		expectEq(Text().selectLines(0, 0), '123\n');
	}

};


// Selection
// ---------

function Selection() { }
registerTestSuite(Selection);

Selection.prototype = {
	
	returnsSingleLine : function() {
		expectEq(Text().selection(0, 0, 0, 1), '1');
	},

	returnsTwoLines : function() {
		expectEq(Text().selection(1, 1, 2, 1), 'bc\nd');
	},

	returnsThreeLines : function() {
		expectEq(Text().selection(0, 1, 2, 2), '23\nabc\nde');
	},

	returnsAllTextIfAllSelected : function() {
		expectEq(Text().selection(0, 0, 2, 3), '123\nabc\ndef');
	},

	returnsEmptyStringIfNothingSelected : function() {
		expectEq(Text().selection(0, 0, 0, 0), '');
	}

};


// InsertLines
// -----------

function InsertLines() { }
registerTestSuite(InsertLines);

InsertLines.prototype = {
	
	insertsSingleLine : function() {
		var text = Text();
		text.insertLines(['321'], 0);
		expectThat(text.source, elementsAre(['321', '123', 'abc', 'def']));
	},

	insertsTwoLines : function() {
		var text = Text();
		text.insertLines(['456', '789'], 1);
		expectThat(text.source, elementsAre(['123', '456', '789', 'abc', 'def']));
	},

	insertsThreeLines : function() {
		var text = Text();
		text.insertLines(['ghi', 'jkl', 'mno'], 3);
		expectThat(text.source, elementsAre(['123', 'abc', 'def', 'ghi', 'jkl', 'mno']));
	},

	insertsNothingIfEmptyArray : function() {
		var text = Text();
		text.insertLines([], 0);
		expectThat(text.source, elementsAre(['123', 'abc', 'def']));
	}

};


// Insert
// ------

function Insert() { }
registerTestSuite(Insert);

Insert.prototype.insertsASingleLine = function() {
	var text = Text();
	text.insert('ghi', 2, 0);
	expectThat(text.source, elementsAre(['123', 'abc', 'ghidef']));
};


// Remove
// ------

function Remove() { }
registerTestSuite(Remove);

Remove.prototype = {
	
	deletesBeforeIfPositive : function() {
		var text = Text();
		text.remove(1, 0, 1);
		expectThat(text.source, elementsAre(['23', 'abc', 'def']));
	},

	deletesAfterIfNegative : function() {
		var text = Text();
		text.remove(-2, 0, 1);
		expectThat(text.source, elementsAre(['1', 'abc', 'def']));
	},

	deletesNothingIfZero : function() {
		var text = Text();
		text.remove(0, 0, 0);
		expectThat(text.source, elementsAre(['123', 'abc', 'def']));
	}

};


// Merge
// -----

function Merge() { }
registerTestSuite(Merge);

Merge.prototype = {
	
	mergesNoLinesIfStartAndStopEqual : function() {
		var text = Text();
		text.merge(0, 0);
		expectThat(text.source, elementsAre(['123', 'abc', 'def']));
	},

	mergesTwoLines : function() {
		var text = Text();
		text.merge(0, 1);
		expectThat(text.source, elementsAre(['123abc', 'def']));
	},

	mergesThreeLines : function() {
		var text = Text();
		text.merge(0, 2);
		expectThat(text.source, elementsAre(['123abcdef']));
	}

};



});
