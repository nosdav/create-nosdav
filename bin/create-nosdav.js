#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');
const { initProfile } = require('../src/commands/init');
const { createApp } = require('../src/commands/app');

const program = new Command();

program
  .name('create-nosdav')
  .description('Create NosDav profiles and apps')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize a new NosDav profile')
  .argument('[name]', 'profile name')
  .option('-d, --dir <directory>', 'target directory', '.')
  .action(initProfile);

program
  .command('app')
  .description('Create a new app')
  .argument('<name>', 'app name')
  .option('-t, --template <template>', 'app template', 'basic')
  .option('-d, --dir <directory>', 'profile directory', '.')
  .action(createApp);

program
  .command('list')
  .description('List available templates and apps')
  .action(() => {
    console.log(chalk.blue('Available templates:'));
    console.log('  - basic (default)');
    console.log('  - crud');
    console.log('  - dashboard');
  });

program.parse(process.argv);