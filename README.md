# git-hook
install and uninstall git hooks for convenient
让你更简单的定义git hooks。
# 钩子组件使用
```javascript
var gitHooks = require('git-hook'),
    fs = require('fs');

gitHook.install('hint', 'pre-commit', function(hookPath) {
    fs.writeFileSync(hookPath + '.back', fs.readFileSync(hookPath));
});
```
然后在你的项目的package.json文件中配置scripts:

```javascript
{
    "scripts": {
        "hint": "f2ehint-hook --check"
    }
}
```

即可在你提交代码的时候执行：  
`f2ehint-hook --check`  
命令。  
## 关于f2ehint-hook命令
在写组建的时候，如果你在你的package.json文件里写了：  
```javascript
{
    "bin": {
        "f2ehint-hook": "bin/f2ehint-hook.js"
    }
}
```
那么在依赖该组件的项目中，当你在执行tnpm install/npm install的时候，会自动在当前项目的node_modules/.bin目录下自动生成f2ehint-hook文件。  
文件的内容就是以来的组件的bin/f2ehint-hook.js文件的内容。  
那么当你执行tnpm run hint任务的时候，其实就是执行node_modules/.bin/f2ehint-hook文件。

# 关于bin字段
bin项用来指定各个内部命令对应的可执行文件的位置。  
```javascript
"bin": {
    "someTool": "./bin/someTool.js"
}
```  
上面代码指定，someTool 命令对应的可执行文件为 bin 子目录下的 someTool.js。Npm会寻找这个文件，在node_modules/.bin/目录下建立符号链接。  
在上面的例子中，someTool.js会建立符号链接npm_modules/.bin/someTool。  
由于node_modules/.bin/目录会在运行时加入系统的PATH变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。  
  
因此，像下面这样的写法可以采用简写。  
```javascript
"scripts": {  
    "start": "./node_modules/someTool/someTool.js build"
}

// 简写为

"scripts": {  
    "start": "someTool build"
}
```
所有node_modules/.bin/目录下的命令，都可以用npm run [命令]的格式运行。在命令行下，键入npm run，然后按tab键，就会显示所有可以使用的命令。
