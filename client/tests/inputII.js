var textArea = { value : '' };

var document = {
	createElement : function() { return textArea }
};

require(['inputII'], function(input) {

	// Bind
	// ----
	
	function Bind() { }
	registerTestSuite(Bind);

	Bind.prototype = {
		
		bindsASingleKeyCode : function() {

		},

		bindsTwoSimultaneousKeyCodes : function() {
			
		},

		bindsThreeSimultaneousKeyCodes : function() {
			
		},

		bindsKeyCodeSequence : function() {
			
		},

		bindsSingleEvent : function() {
			
		},

		bindsCombinationOfKeyCodesAndEvents : function() {
			
		},

		convertsAliasesToKeyCodes : function() {
			
		}

	};

	// Is
	// ----
	
	function Is() { }

	Is.prototype = {
		
		checksSingleKey : function() {
			
		},

		checksArrayOfKeys : function() {
			
		},

		checksEvents : function() {
			
		},

		checksArrayOfEvents : function() {

		},

		checksArrayOfEventsAndKeyCodes : function() {
			
		}

	};

	// Unbind
	// ------
	
	function Unbind() { };

	Unbind.prototype = {
		
		unbindsWhenGivenFunction : function() {

		},

		doesNotUnbindAnythingIfNotGivenFunction() {
			
		}

	};

});
