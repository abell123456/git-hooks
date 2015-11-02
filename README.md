# git-hooks
install and uninstall git hooks for convenient  
让你更简单的定义git hooks。  
# 使用
```javascript
var gitHooks = require('git-hooks');
gitHooks.install('hint', 'pre-commit');
```
然后在你的package.json文件中配置scripts:  
`{scripts:{'hint':'node jshint.js'}}`  
即可在你提交代码的时候执行`node jshint.js`命令。非常方便。
