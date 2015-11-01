var gitHook = require('../src/'),
	hooks = require('../hooks.json');

module.exports = function(cb) {
	gitHook.hooksDir(function(err, dir) {
		if (!err) {
			hooks.forEach(function(hook) {
				gitHook.remove(dir, hook);
			});

			typeof cb === 'function' && cb(dir);
		}
	});
};
