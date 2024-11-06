#!/usr/bin/env node

const yargs = require("yargs");
const { inquirerProjectPrompt } = require("./command/inquirer.project");
const { inquirerHtmlPrompt } = require("./command/inquirer.html");
const { inquirerPrompt } = require("./command/inquirer");

// 无操作提示
inquirerPrompt();

yargs.command(["create", "c"], "新建一个项目", function (argv) {
  inquirerProjectPrompt(argv);
}).argv;

yargs.command(["html"], "新建一个普通项目", function (argv) {
  inquirerHtmlPrompt(argv);
}).argv;
