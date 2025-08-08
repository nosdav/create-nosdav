import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import os from 'os';
import crypto from 'crypto';

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

    const templateDir = await resolveTemplate(template);
    await copyTemplateFiles(templateDir, appDir, { name, title: appJson.title });

    await fs.writeJson(path.join(appDir, 'app.json'), appJson, { spaces: 2 });

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

async function resolveTemplate(templateSpec) {
  try {
    // Check if it's a Git template
    if (isGitTemplate(templateSpec)) {
      return await cloneGitTemplate(templateSpec);
    }
    
    // Local template
    const localTemplateDir = join(__dirname, '../../templates', templateSpec);
    if (!await fs.pathExists(localTemplateDir)) {
      throw new Error(`Local template ${templateSpec} not found`);
    }
    return localTemplateDir;
  } catch (error) {
    console.error(chalk.red(`Error resolving template ${templateSpec}:`), error.message);
    throw error;
  }
}

function isGitTemplate(templateSpec) {
  return templateSpec.startsWith('github:') ||
         templateSpec.startsWith('gh:') ||
         templateSpec.startsWith('https://') ||
         templateSpec.startsWith('git@') ||
         templateSpec.includes('.git');
}

function parseGitTemplate(templateSpec) {
  let url, ref;
  
  // Handle github: and gh: shortcuts
  if (templateSpec.startsWith('github:') || templateSpec.startsWith('gh:')) {
    const parts = templateSpec.split(':')[1].split('@');
    const repo = parts[0];
    ref = parts[1];
    url = `https://github.com/${repo}.git`;
  } else {
    // Handle full URLs with optional @branch/tag
    const parts = templateSpec.split('@');
    url = parts[0];
    ref = parts[1];
  }
  
  return { url, ref };
}

async function cloneGitTemplate(templateSpec) {
  const { url, ref } = parseGitTemplate(templateSpec);
  
  // Create cache directory
  const cacheDir = join(os.homedir(), '.create-nosdav', 'cache');
  await fs.ensureDir(cacheDir);
  
  // Generate cache key from URL + ref
  const cacheKey = crypto.createHash('md5').update(`${url}@${ref}`).digest('hex');
  const cachedPath = join(cacheDir, cacheKey);
  
  // Check if already cached
  if (await fs.pathExists(cachedPath)) {
    console.log(chalk.gray(`Using cached template: ${templateSpec}`));
    return cachedPath;
  }
  
  console.log(chalk.blue(`Cloning template: ${templateSpec}`));
  
  try {
    // Clone the repository
    const cloneCmd = ref ? 
      `git clone --depth 1 --branch ${ref} "${url}" "${cachedPath}"` :
      `git clone --depth 1 "${url}" "${cachedPath}"`;
    
    execSync(cloneCmd, {
      stdio: 'pipe'
    });
    
    // Remove .git directory to save space
    const gitDir = join(cachedPath, '.git');
    if (await fs.pathExists(gitDir)) {
      await fs.remove(gitDir);
    }
    
    console.log(chalk.green(`✓ Template cloned successfully`));
    return cachedPath;
  } catch (error) {
    // Clean up failed clone
    if (await fs.pathExists(cachedPath)) {
      await fs.remove(cachedPath);
    }
    throw new Error(`Failed to clone template: ${error.message}`);
  }
}

async function copyTemplateFiles(sourceDir, targetDir, variables) {
  const files = await fs.readdir(sourceDir, { withFileTypes: true });
  
  for (const file of files) {
    const sourcePath = join(sourceDir, file.name);
    const targetPath = join(targetDir, file.name);
    
    if (file.isDirectory()) {
      // Recursively copy directories
      await fs.ensureDir(targetPath);
      await copyTemplateFiles(sourcePath, targetPath, variables);
    } else {
      // Copy and process file
      let content = await fs.readFile(sourcePath, 'utf8');
      
      // Simple variable substitution
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      
      await fs.writeFile(targetPath, content);
    }
  }
}

export { createApp };