const process = require('node:process')

exports.inquirerPrompt = function () {
  if (process.argv.length === 2) {
    console.log(`缺少执行的命令：npm <command>
  
  Usage:
  
  mu web  创建一个web项目
  mu h5  创建一个h5项目
  mu html      创建普通项目（没有打包工具）
      `)
  }
}
