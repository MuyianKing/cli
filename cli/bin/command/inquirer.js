const process = require('node:process')

exports.inquirerPrompt = function () {
  if (process.argv.length === 2) {
    console.log(`缺少执行的命令：npm <command>
  
  Usage:
  
  mu c|create  创建一个项目
  mu html      创建普通项目（没有打包工具）
      `)
  }
}
