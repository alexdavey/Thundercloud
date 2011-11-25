var riak = require('riak-js');

var DB = funciton() {
	
};

DB.prototype = {
	
	emailExists : function(email, fn) {
		riak.exists('emails', email, fn);
	},

	userExists : function(name, fn) {
		riak.exists('users', name, fn);
	}

};

module.exports = DB;
