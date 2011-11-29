"use strict";

var async = require('async'),
	riak  = require('riak-js').getClient();

var DB = function() {
	
};

DB.prototype = {

	addUser : function(details, fn) {
		riak.save('users', )
	},
	
	emailExists : function(email, fn) {
		riak.exists('emails', email, fn);
	},

	userExists : function(name, fn) {
		riak.exists('users', name, fn);
	},

	isUserBanned : function(name, fn) {
		riak.exists('bannedUsers', name, fn);
	},

	isEmailBanned : function(email, fn) {
		riak.exists('bannedRegexEmails', email, function(err, results) {
			if (results || err) {
				fn(err, results);
			} else {
				riak.exists('bannedLiteralEmails', email, fn);
			}
		});
	},

	isIPBanned : function(ip, fn) {

		function ipMap(obj) {
			for (var i in obj) {
				if (obj[i] < ip) return [true];
			}
			return [false];
		}

		riak.add({ bucket : 'bannedIPs', key_filters : ['greater_than_eq', ip] })
			.map(ipMap)
			.run(fn);
	}

};

module.exports = DB;
