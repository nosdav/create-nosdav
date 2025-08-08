#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initProfile } from '../src/commands/init.js';
import { createApp } from '../src/commands/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

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