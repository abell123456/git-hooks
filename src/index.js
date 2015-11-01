var gitHooks = require('./git-hooks'),
    fs = require('fs'),
    hooks = require('../hooks.json');

module.exports = {
    /**
     * @param script 要执行的脚本的文件名，比如package.json中定义了：
       {"hint": "f2ehint-hook --check"}，则：script值为：'hint'。会传到sh代码中有相应执行
     * @param hookName 对应的钩子名字，比如要在执行git commit后执行hint（tnpm run hint），则hookName为：'pre-commit'
       所有可能的hook名字见hooks.json
     * @param override 仅接受2类值：function|boolean 为true则覆盖其他用户已经定义了的同名钩子，为函数会将当前钩子文件路径
       传进函数由调用者处理
    */
    install: function(script, hookName, override) {
        gitHook.hooksDir(function(err, dir) {
            if (err) {
                console.error('  ' + err);
            } else {
                gitHook.create(dir, hookName, script, override);
            }
        });
    },
    uninstall: function(cb) {
        gitHook.hooksDir(function(err, dir) {
            if (!err) {
                hooks.forEach(function(hook) {
                    gitHook.remove(dir, hook);
                });

                typeof cb === 'function' && cb(dir);
            }
        });
    }
};
