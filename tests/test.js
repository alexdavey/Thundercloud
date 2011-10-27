"use strict";

module('Text wrapper');

// Two utility functions
function Text() {
	return new IDE.Text('123456789\nabcdefghi\njklmnopqr');
}

function Sandbox(fn) {
	var text = Text();
	fn(text, text.source);
}

test('Text.stringify', function() {
	equal(Text().stringify(), '123456789\nabcdefghi\njklmnopqr', 'Text.stringify return the correct string');
});

test('Text.lineLength', function() {
	equal(Text().lineLength(-1), -1, 'Text.lineLength returns -1 when an invalid line number is specified');
});

test('Text.addLine', function() {
	Sandbox(function(Text, source) {
		Text.addLine(0, 'jklmnopqr');
		equal(source[0], 'jklmnopqr', 'Text.addLine inserts lines into the source');
	});

	Sandbox(function(Text, source) {
		Text.addLine(0);
		equal(source[0], '', 'Text.addLine inserts an empty line if second parameter is not specified');
	});

});
		
test('Text.removeLine', function() {
	Sandbox(function(Text, source) {
		Text.removeLine(0);
		equal(source[0], 'abcdefghi', 'Text.removeLine removes a single line');
	});
});

test('Text.removeLines', function() {
	Sandbox(function(Text, source) {
		Text.removeLines(0, 1);
		equal(source[0], 'jklmnopqr', 'Text.removeLines removes multiple lines');
	});

	Sandbox(function(Text, source) {
		Text.removeLines(0, 0);
		equal(source[0], 'abcdefghi', 'Text.removeLines removes a single line if start and stop are the same');
	});
});

test('Text.removeSection', function() {
	Sandbox(function(Text, source) {
		Text.removeSection(0, 2, 4);
		equal(source[0], '1256789', 'Text.removeSection removes the middle of a line');
	});

	Sandbox(function(Text, source) {
		Text.removeSection(0, 3, 0);
		equal(source[0], '456789', 'Text.removeSection normalizes wrongly ordered start-end points');
	});

	Sandbox(function(Text, source) {
		Text.removeSection(0, 3, 3);
		equal(source[0], '123456789', 'Text.removeSection does not remove anything if nothing is selected');
	});

	Sandbox(function(Text, source) {
		Text.removeSection(0, 0, 9);
		equal(source[0], 'abcdefghi', 'Text.removeSection deletes the line if everything is selected');
	});
});

test('Text.removeSelection', function() {
	Sandbox(function(Text, source) {
		Text.removeSelection(0, 0, 0, 5);
		equal(source[0], '6789', 'Text.removeSelection removes a single line of text');
	});

	Sandbox(function(Text, source) {
		Text.removeSelection(0, 0, 1, 5);
		equal(source[0], 'fghi', 'Text.removeSelection removes two lines of text');
	});

	Sandbox(function(Text, source) {
		Text.removeSelection(0, 5, 2, 5);
		equal(source[0], '12345opqr', 'Text.removeSelection removes three lines of text');
	});

	Sandbox(function(Text, source) {
		Text.removeSelection(0, 0, 2, 9);
		equal(source.length, 0, 'Text.removeSelection removes everything if selected');
	});

	Sandbox(function(Text, source) {
		Text.removeSelection(1, 1, 1, 1);
		equal(source[0] + source[1] + source[2], '123456789abcdefghijklmnopqr', 'Text.removeSelection does not remove anything if nothing is selected');
	});
});

test('Text.append', function() {
	Sandbox(function(Text, source) {
		Text.append('10', 0);
		equal(source[0], '12345678910', 'Text.append adds text to the end of a line');
	});
});

test('Text.lineSection', function() {
	equal(Text().lineSection(0, 0, 8), '12345678', 'Text.lineSection returns a section of a line');
	equal(Text().lineSection(0, 8, 0), '12345678', 'Text.lineSection normalizes wrongly ordered start-end points');
	equal(Text().lineSection(0, 2, 2), '', 'Text.lineSection returns an empty string if nothing is selected');
	equal(Text().lineSection(0, 2, 0), '12', 'Text.lineSection selects up to the end of the line if col2 is not specified');
});

test('Text.selectLines', function() {
	equal(Text().selectLines(0, 1), '123456789\nabcdefghi\n', 'Text.selectLines return two lines');
	equal(Text().selectLines(0, 0), '123456789\n', 'Text.selectLines returns a single line if start and stop are the same');
});

test('Text.selection', function() {
	equal(Text().selection(0, 0, 0, 5), '12345', 'Text.selection returns a single line');

	equal(Text().selection(0, 5, 1, 5), '6789\nabcde', 'Text.selection returns two lines separated by a newline');

	equal(Text().selection(0, 5, 2, 5), '6789\nabcdefghi\njklmn', 'Text.selection returns three lines separated by newlines');

	equal(Text().selection(0, 0, 2, 9), '123456789\nabcdefghi\njklmnopqr', 'Text.selection returns all text if selected');

	equal(Text().selection(1, 1, 1, 1), '', 'Text.selection returns an empty string if no text is selected');
});

test('Text.insertLines', function() {
	Sandbox(function(Text, source) {
		Text.insertLines([1, 2], 0);
		equal(source[0] / source[1], 0.5, 'Text.insertLines inserts elements into the text in the correct order');
	});

	Sandbox(function(Text, source) {
		Text.insertLines([,], 0);
		equal(source[0], '123456789', 'Text.insertLines does not insert any elements if a sparse array is used');
	});

	Sandbox(function(Text, source) {
		Text.insertLines([], 0);
		equal(source[0], '123456789', 'Text.insertLines inserts no elements if an empty array is used');
	});
});

test('Text.insert', function() {
	Sandbox(function(Text, source) {
		Text.insert('10', 0, 9);
		equal(source[0], '12345678910', 'Text.insert inserts text into a line');
	});
});

test('Text.remove', function() {
	Sandbox(function(Text, source) {
		Text.remove(1, 0, 9);
		equal(source[0], '12345678', 'Text.remove deletes characters before the cursor if positive');
	});

	Sandbox(function(Text, source) {
		Text.remove(-1, 0, 0);
		equal(source[0], '23456789', 'Text.remove deletes characters after the cursor if negative');
	});

	Sandbox(function(Text, source) {
		Text.remove(0, 0, 0);
		equal(source[0], '123456789', 'Text.remove deletes nothing if no characters are specified');
	});
});

test('Text.merge', function() {
	Sandbox(function(Text, source) {
		Text.merge(0, 0);
		equal(source[0], '123456789', 'Text.merge merges no lines if start and stop are the same');
	});

	Sandbox(function(Text, source) {
		Text.merge(0, 1);
		equal(source[0], '123456789abcdefghi', 'Text.merge merges two lines');
	});

	Sandbox(function(Text, source) {
		Text.merge(0, 2);
		equal(source[0], '123456789abcdefghijklmnopqr', 'Text.merge merges three lines');
	});
});
