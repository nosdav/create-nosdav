const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

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

    let appHtml;
    switch (template) {
      case 'crud':
        appHtml = createCrudTemplate(name, appJson.title);
        break;
      case 'dashboard':
        appHtml = createDashboardTemplate(name, appJson.title);
        break;
      default:
        appHtml = createBasicTemplate(name, appJson.title);
    }

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

function createBasicTemplate(name, title) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta charset="utf-8">
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
        .content { line-height: 1.6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>A basic NosDav app</p>
    </div>
    <div class="content">
        <p>Welcome to your new NosDav app!</p>
        <p>Edit <code>public/apps/${name}/index.html</code> to customize this app.</p>
    </div>
</body>
</html>`;
}

function createCrudTemplate(name, title) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta charset="utf-8">
    <style>
        body { font-family: system-ui; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
        .form { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 4px; }
        .item { padding: 0.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
        input, button { padding: 0.5rem; margin: 0.25rem; }
        button { cursor: pointer; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>CRUD operations with local storage</p>
    </div>
    
    <div class="form">
        <input type="text" id="itemInput" placeholder="Add new item...">
        <button onclick="addItem()">Add</button>
    </div>
    
    <div id="items"></div>
    
    <script>
        let items = JSON.parse(localStorage.getItem('${name}-items') || '[]');
        
        function render() {
            const container = document.getElementById('items');
            container.innerHTML = items.map((item, i) => 
                \`<div class="item">
                    <span>\${item}</span>
                    <button onclick="removeItem(\${i})">Delete</button>
                </div>\`
            ).join('');
        }
        
        function addItem() {
            const input = document.getElementById('itemInput');
            if (input.value.trim()) {
                items.push(input.value.trim());
                localStorage.setItem('${name}-items', JSON.stringify(items));
                input.value = '';
                render();
            }
        }
        
        function removeItem(index) {
            items.splice(index, 1);
            localStorage.setItem('${name}-items', JSON.stringify(items));
            render();
        }
        
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addItem();
        });
        
        render();
    </script>
</body>
</html>`;
}

function createDashboardTemplate(name, title) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta charset="utf-8">
    <style>
        body { font-family: system-ui; margin: 0; padding: 1rem; background: #f5f5f5; }
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
        .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { margin-top: 0; color: #333; }
        .stat { font-size: 2rem; font-weight: bold; color: #0066cc; }
        .chart { height: 100px; background: linear-gradient(45deg, #e3f2fd, #bbdefb); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #1976d2; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="dashboard">
        <div class="card">
            <h3>Total Items</h3>
            <div class="stat" id="totalItems">0</div>
        </div>
        <div class="card">
            <h3>Active Sessions</h3>
            <div class="stat">1</div>
        </div>
        <div class="card">
            <h3>Storage Used</h3>
            <div class="stat" id="storageUsed">0 KB</div>
        </div>
        <div class="card">
            <h3>Chart</h3>
            <div class="chart">📊 Data Visualization</div>
        </div>
    </div>
    
    <script>
        function updateStats() {
            const storage = JSON.stringify(localStorage);
            document.getElementById('storageUsed').textContent = (storage.length / 1024).toFixed(1) + ' KB';
            document.getElementById('totalItems').textContent = Object.keys(localStorage).length;
        }
        
        updateStats();
        setInterval(updateStats, 5000);
    </script>
</body>
</html>`;
}

module.exports = { createApp };