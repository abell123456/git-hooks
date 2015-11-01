var fs = require('fs');
var path = require('path');;
var exec = require('child_process').exec;
var normalize = require('normalize-path');

module.exports = {
    isF2eHook: function(filename) {
        var data = fs.readFileSync(filename, 'utf-8');
        return data.indexOf('# f2ehook') !== -1;
    },

    // 获取到hooks存放目录
    hooksDir: function(callback) {
        exec('git rev-parse --git-dir', function(error, stdout, stderr) {
            if (error) {
                callback(stderr, null);
            } else {
                callback(null, stdout.trim() + '/hooks');
            }
        });
    },

    write: function(filename, data) {
        fs.writeFileSync(filename, data);
        fs.chmodSync(filename, 0755); // 修改文件的权限
    },

    /**
     * @param filename 钩子文件的路径
     * @param name 钩子名字，所有的hoohks名字在hooks.json中列出
     * @param cmd 对应钩子的执行名字，在pakcage.json的scripts属性中定义。
     * 比如你执行了hook.create(dir,'pre-commit','foo');然后你在scripts中定义了'foo':'npm test'，
     * 在执行git commit命令后会触发pre-commit，自然就会执行npm test，其实执行的就是test文件夹下的indx.js文件。
     * 执行install默认是将xxx-yyy替换为xxxyyy。
     */
    create: function(dir, name, cmd, override) {
        var arr = [
            '#!/bin/sh',
            '# f2ehook'
        ];

        // Needed on OS X / Linux when nvm is used and committing from Sublime Text
        if (process.platform !== 'win32') {
            arr.push('PATH="' + process.env.PATH + '"');
        }

        // 假定这个文件的路径是：node_modules/git-hook/src
        var packageDir = path.join(__dirname, '..', '..', '..');

        // dir的值是：.git/hooks
        var projectDir = path.join(dir, '..', '..');

        // 为了支持package.json与.git在不同目录中的项目，获取到package.json相对于项目路径的相对路径
        var relativePath = path.join('.', path.relative(projectDir, packageDir));

        // Windows系统格式化路径 (i.e. convert \ to /)
        var normalizedPath = normalize(relativePath);

        // 钩子执行脚本
        arr = arr.concat([
            'cd ' + normalizedPath,
            // 检测package.json中scripts是否定义
            '[ -f package.json ] && cat package.json | grep -q \'"' + cmd + '"\\s*:\'',
            // package.json 或 scripts 不存在
            '[ $? -ne 0 ] && exit 0',
            'npm run ' + cmd + ' --silent',
            'if [ $? -ne 0 ]; then',
            '  echo',
            '  echo "git-hook - ' + name + ' hook failed (add --no-verify to bypass)"',
            '  echo',
            '  exit 1',
            'fi'
        ]);

        // 钩子路径不存在则创建该目录
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        this._create(dir, name, arr, override);

    },

    _create: function(dir, name, arr, override) {
        var filename = dir + '/' + name,
            data = arr.join('\n'),
            type = typeof override;

        if (!fs.existsSync(filename)) {
            this.write(filename, data);
        } else {
            if (this.isF2eHook(filename)) {
                this.write(filename, data);
            } else {
                // 已经存在的hook
                if (type === 'function') {
                    override(filename);
                } else if (type === 'boolean' && type) {
                    // 重写原有钩子文件
                    this.write(filename, data);
                } else {
                    console.log('已存在其他用户的重名的钩子文件： .git/hooks/' + name);
                }
            }
        }
    },

    remove: function(dir, name) {
        var filename = dir + '/' + name;

        if (fs.existsSync(filename) && this.isF2eHook(filename)) {
            fs.unlinkSync(dir + '/' + name);
        }
    }
};
