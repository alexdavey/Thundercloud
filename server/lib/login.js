"use strict";

var DB     = require('db'),
	mail   = require('mail'),
	async  = require('async'),
	errors = require('errors'),
	crypto = require('crypto'),
	_	   = require('underscore');

var permissions = makePermissionsObj([

	// READ
	READ_OWN_FILES,
	READ_OTHER_FILES,

	READ_OWN_PROJECTS,
	READ_OTHER_PROJECTS,

	// DELETE
	DELETE_OWN_FILES,
	DELETE_OTHER_FILES,

	DELETE_OWN_PROJECTS,
	DELETE_OTHER_PROJECTS,

	// CREATE
	CREATE_OWN_FILES,
	CREATE_OTHER_FILES,

	CREATE_OWN_PROJECTS,
	CREATE_OTHER_PROJECTS,

	// MODIFY
	MODIFY_OWN_FILES,
	MODIFY_OTHER_FILES,

	MODIFY_OWN_PROJECTS,
	MODIFY_OTHER_PROJECTS,

	// OTHER
	VIEW_OTHER_PREFERENCES,
	VIEW_OWN_PREFERENCES,
	ADMIN_PANEL,
	EMAIL_USERS,
	BAN_USERS
	
]);

// Utility functions
// -----------
function makePermissionsObj(array) {
	var obj = {};
	for (var i = 0, l = array.length; ++i) {
		obj[array[i]] = Math.pow(2, i);
	}
	return obj;
}

function ipToLong(ip) {
	var parts = ip.split('.'),
		two   = 256 * 256,
		three = 256 * 256 * 256;
	
	return +parts[0] * three + +parts[1] * two + +parts[2] * 256 + +parts[3];
}

function longToIp(number) {
	var ip = [];

	ip[4] = number % 256;
	ip[3] = ~~(number /= 256) % 256
	ip[2] = ~~(number /= 256) % 256
	ip[1] = ~~(number /= 256) % 256

	return ip.join('.');
}

function randomString(length) {
	return crypto.randomBytes(2 * length).toString('utf-8');
}

function md5(string) {
	return crypto.createHash('md5').update(string).digest('base64');
}


function hashPassword(password, salt) {
	salt || (salt = randomString(10));
	return {
		salt : salt,
		hash : md5(md5(password) + md5(salt))
	};
}

// Constructor
// -----------
var User = function() {
	
};

// Prototype
// ---------
User.prototype = {
	
	hasPermission : function() {
		
	},

	register : function(details, fn) {
		var username = details.username.toLowerCase(),
			email    = details.username,
			passhash,
			hash,
			date;

		// Check to see if the user or email already exists 
		async.parallel([
			async.apply(DB.emailExists, details.email, callback),
			async.apply(DB.userExists, username, callback)
		], 
		
		function(err, results) {
			if (err) throw err;

			// If either email or username exists, return
			if (results[0] || results[1]) {
				fn(errors.alreadyRegistered);
			} else {
				// Otherwise, register the user
				passhash = hashPassword(details.password);
				hash = passhash.hash,
				date = ''+new Date();

				DB.addUser({
					email         : email,
					username      : username,
					mustValidate  : true,
					passhash      : hash,
					salt          : passhash.salt,
					groupId       : detail.group,

					lastLoginDate : date,
					registerDate  : date,

					registerIp    : detail.ip,
					lastLoginIp   : detail.ip,

					permOverrideRemove : 0,
					permOverrideAdd    : 0
				});

				// Send a confirmation email with the verification hash
				mail.confirmation(email, username, md5(email + hash));

				fn(true);
			}
		});

	},

	login : function(username, pass, req, fn) {
		DB.getUser(function(user) {
			if (!user || user.hash !== hashPassword(pass, user.salt)) {
				fn(false);
			} else if (!user.verified) {
				fn(false);
			} else {
				req.session.set();
			}
		});
	},

	ban : function(details) {
		
	},

	isBanned : function(details, fn) {
		// WILL NOT WORK;
		var tests = _([details.user  && DB.isUserBanned,
					   details.email && DB.isEmailBanned,
					   details.ip    && DB.isIPBanned
		]).compact();

		async.waterfall(tests, fn);
	}

};

module.exports = User;
