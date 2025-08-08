const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const crypto = require('crypto');

async function initProfile(name, options) {
  const { dir } = options;
  const profileName = name || 'my-profile';
  const targetDir = path.resolve(dir, profileName);

  console.log(chalk.blue(`Creating NosDav profile: ${profileName}`));

  if (await fs.pathExists(targetDir)) {
    console.log(chalk.red(`Directory ${targetDir} already exists!`));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'displayName',
      message: 'Display name:',
      default: profileName
    },
    {
      type: 'input',
      name: 'about',
      message: 'About (brief description):',
      default: 'NosDav user profile'
    },
    {
      type: 'input',
      name: 'nip05',
      message: 'NIP-05 identifier (optional):'
    }
  ]);

  try {
    await fs.ensureDir(targetDir);
    await fs.ensureDir(path.join(targetDir, 'public', 'images'));
    await fs.ensureDir(path.join(targetDir, 'public', 'todo'));
    await fs.ensureDir(path.join(targetDir, 'public', 'apps'));
    await fs.ensureDir(path.join(targetDir, 'settings'));

    const ed25519Key = crypto.randomBytes(32).toString('hex');
    const profileId = crypto.createHash('sha256').update(ed25519Key).digest('hex');

    const indexJson = {
      name: answers.displayName,
      picture: `https://nosdav.net/${profileId}/public/images/thumb.png`,
      about: answers.about,
      nip05: answers.nip05 || '',
      subkeys: '',
      publicTypeIndex: './settings/publicTypeIndex.json',
      storage: [`https://nosdav.net/${profileId}/`],
      ed25519: ed25519Key
    };

    const publicTypeIndex = [
      {
        type: 'TypeRegistration',
        forClass: 'Tracker',
        instance: '../public/todo/todo.json',
        registeredWith: 'https://nostr.app/todo.html'
      }
    ];

    const todoJson = [
      {
        '@context': { '@vocab': 'urn:solid:' },
        '@id': '#this',
        '@type': 'Tracker',
        title: 'My Todo List',
        created: new Date().toISOString(),
        taskCount: 0,
        completedCount: 0,
        lastUpdated: new Date().toISOString()
      }
    ];

    await fs.writeJson(path.join(targetDir, 'index.json'), indexJson, { spaces: 2 });
    await fs.writeJson(path.join(targetDir, 'settings', 'publicTypeIndex.json'), publicTypeIndex, { spaces: 2 });
    await fs.writeJson(path.join(targetDir, 'public', 'todo', 'todo.json'), todoJson, { spaces: 2 });

    const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <title>${answers.displayName} - NosDav Profile</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>${answers.displayName}</h1>
    <p>${answers.about}</p>
    <h2>Apps</h2>
    <ul id="apps"></ul>
    <script>
        fetch('./settings/publicTypeIndex.json')
            .then(r => r.json())
            .then(apps => {
                const appsList = document.getElementById('apps');
                apps.filter(a => a.forClass === 'WebApp').forEach(app => {
                    const li = document.createElement('li');
                    li.innerHTML = \`<a href="\${app.registeredWith}">\${app.instance}</a>\`;
                    appsList.appendChild(li);
                });
            });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(targetDir, 'index.html'), indexHtml);

    console.log(chalk.green(`✓ NosDav profile created at: ${targetDir}`));
    console.log(chalk.yellow(`Profile ID: ${profileId}`));
    console.log(chalk.blue(`\nNext steps:`));
    console.log(`  cd ${profileName}`);
    console.log(`  create-nosdav app my-first-app`);

  } catch (error) {
    console.error(chalk.red('Error creating profile:'), error.message);
  }
}

module.exports = { initProfile };