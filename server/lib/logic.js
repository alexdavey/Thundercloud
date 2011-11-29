"use strict";

function extend(one, two) {
	for (var i in two) {
		if (one.hasOwnProperty) {
			one[i] = two;
		}
	}
}

var logic = {


	'if' : function(fn, arg1, arg2) {
		var args = [].slice.call(arguments);
		
		this.command = [function(callback) {
			if (args.length == 1) {
				fn.call(callback);
			} else {
				fn.apply(callback, args.slice(1));
			}
		}];

		return this;
	}


};

function is(operator, value) {
	this.command.push(function(input, callback) {
		callback(input == operator);
	});
}

function then(fn) {
	var commands = this.commands;
	for (var i = 0, l = commands.length; ++i) {
		commands[i]()
	}
}

function or(fn) {
	
}

function and(fn) {
	
}
