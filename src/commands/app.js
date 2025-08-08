import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createApp(name, options) {
  const { template, dir } = options;
  const profileDir = path.resolve(dir);
  const appsDir = path.join(profileDir, 'public', 'apps');
  const appDir = path.join(appsDir, name);

  console.log(chalk.blue(`Creating app: ${name} (template: ${template})`));

  if (!await fs.pathExists(path.join(profileDir, 'index.json'))) {
    console.log(chalk.red('Not a NosDav profile directory! Run "create-nosdav init" first.'));
    return;
  }

  if (await fs.pathExists(appDir)) {
    console.log(chalk.red(`App ${name} already exists!`));
    return;
  }

  try {
    await fs.ensureDir(appDir);
    await fs.ensureDir(path.join(appDir, 'assets'));

    const appJson = {
      '@context': { '@vocab': 'urn:solid:' },
      '@id': `#${name}`,
      '@type': 'WebApp',
      name: name,
      title: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `A ${template} NosDav app`,
      version: '1.0.0',
      template: template,
      created: new Date().toISOString(),
      entryPoint: './index.html',
      assets: './assets/'
    };

    const appHtml = await loadTemplate(template, { name, title: appJson.title });

    await fs.writeJson(path.join(appDir, 'app.json'), appJson, { spaces: 2 });
    await fs.writeFile(path.join(appDir, 'index.html'), appHtml);

    await registerApp(profileDir, name, appDir);

    console.log(chalk.green(`✓ App "${name}" created successfully!`));
    console.log(chalk.blue(`App location: ${appDir}`));
    console.log(chalk.blue(`Open: ${path.join(appDir, 'index.html')}`));

  } catch (error) {
    console.error(chalk.red('Error creating app:'), error.message);
  }
}

async function registerApp(profileDir, appName, appDir) {
  const publicTypeIndexPath = path.join(profileDir, 'settings', 'publicTypeIndex.json');
  const publicTypeIndex = await fs.readJson(publicTypeIndexPath);

  const appRegistration = {
    type: 'TypeRegistration',
    forClass: 'WebApp',
    instance: `../public/apps/${appName}/app.json`,
    registeredWith: `../public/apps/${appName}/`
  };

  publicTypeIndex.push(appRegistration);
  await fs.writeJson(publicTypeIndexPath, publicTypeIndex, { spaces: 2 });
}

async function loadTemplate(templateName, variables) {
  const templatePath = join(__dirname, '../../templates', `${templateName}.html`);
  
  try {
    let templateContent = await fs.readFile(templatePath, 'utf8');
    
    // Simple variable substitution
    for (const [key, value] of Object.entries(variables)) {
      templateContent = templateContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    return templateContent;
  } catch (error) {
    console.error(chalk.red(`Error loading template ${templateName}:`), error.message);
    throw error;
  }
}

export { createApp };