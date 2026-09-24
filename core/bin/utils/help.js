/**
 * 输出帮助信息
 * @param {Array<object>} commands 命令配置列表
 */
export function printHelp(commands) {
  const rows = [
    ...commands.map(command => [command.type, `${command.describe}（${command.message}：${command.choices.join(' / ')}）`]),
    ['version', '查看版本'],
  ]
  const width = Math.max(...rows.map(([name]) => name.length)) + 2

  const lines = [
    '',
    '  快速创建项目脚手架',
    '',
    '  用法：',
    '    mu <命令> [项目名] [选项]',
    '',
    '  命令：',
    ...rows.map(([name, text]) => `    ${name.padEnd(width)}${text}`),
    '',
    '  选项：',
    '    -b, --build <名称>  直接指定构建工具/框架，跳过选择',
    '    -y, --yes           全部使用默认值，不进行交互',
    '    -h, --help          查看帮助',
    '    -v, --version       查看版本',
    '',
    '  示例：',
    '    mu web my-app                交互创建 WEB 项目',
    '    mu web my-app --build vite   指定构建工具，不再询问',
    '    mu html demo -y              全部使用默认值',
    '',
  ]

  console.log(lines.join('\n'))
}
