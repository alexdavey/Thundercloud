var DB     = require('db'),
	mail   = require('mail'),
	errors = require('errors'),
	crypto = require('crypto');

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


function hashPassword(password, saltString) {
	var salt = saltString || randomString(10);
	return {
		salt : salt,
		passhash : md5(md5(password) + md5(salt))
	};
}

// Constructor
// -----------
var Login = function() {
	
};

// Prototype
// ---------
Login.prototype = {
	
	hasPermission : function() {
		
	},

	register : function(details, fn) {
		var username = details.username.toLowerCase(),
			email    = details.username,
			passhash,
			date;

		// Check to see if the user already exists
		if (DB.emailExists(details.email) || DB.userExists(username)) {
			fn(errors.alreadyRegistered);
		} else {

			passhash = hashPassword(details.password);
			date = ''+new Date();

			DB.addUser({
				email         : email,
				username      : username,
				mustValidate  : true,
				passhash      : passhash.passhash,
				salt          : passhash.salt,
				groupId       : detail.group,

				lastLoginDate : date,
				registerDate  : date,

				registerIp    : detail.ip,
				lastLoginIp   : detail.ip,

				permOverrideRemove : 0,
				permOverrideAdd    : 0
			});

			mail.confirmation(email, username, );
		}

	},

	login : function(username, pass, fn) {
		DB.getUser(function(user) {
			if (   !user 
				|| user.passhash !== hashPassword(pass, user.salt)
				|| ) {
				fn(false);
			}
		});
	},

	isBanned : function(details) {
		
	}

};

module.exports = Login;
