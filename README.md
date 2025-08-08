# create-nosdav

Create NosDav profiles and apps with unlimited templates from the community ecosystem.

## Quick Start

```bash
# Create a new profile
npx create-nosdav init my-profile

# Create apps with built-in templates
cd my-profile
npx create-nosdav app todo --template preact-todo
npx create-nosdav app dashboard --template dashboard

# Use community templates from GitHub
npx create-nosdav app auth-app --template github:nosdav/preact-auth-starter
npx create-nosdav app blog --template gh:user/blog-template@v2.0.0
```

## Features

🚀 **Unlimited Templates** - Access thousands of community templates from any Git repository
⚛️ **Modern Development** - Preact, HTM, and ES modules with no build step required  
📁 **Multi-File Support** - Templates can include multiple components, utilities, and assets
💾 **Smart Caching** - Templates cached locally for fast repeated use
🎯 **Simple Workflow** - No transpilers, bundlers, or complex tooling
🔗 **NosDav Integration** - Apps automatically register in your profile's type index

## Template Sources

### Built-in Templates
```bash
npx create-nosdav list
```

- **basic** - Simple static HTML app
- **crud** - CRUD operations with localStorage  
- **dashboard** - Analytics dashboard with live stats
- **preact-todo** - Modern todo app with Preact & HTM

### Community Templates (Git Repositories)

**GitHub Shortcuts:**
```bash
# GitHub shorthand
npx create-nosdav app my-app --template github:user/template-repo
npx create-nosdav app my-app --template gh:user/repo

# With specific version/branch
npx create-nosdav app my-app --template github:user/repo@v1.2.0
npx create-nosdav app my-app --template github:user/repo@main
```

**Full Git URLs:**
```bash
# Any Git repository
npx create-nosdav app my-app --template https://github.com/user/template.git
npx create-nosdav app my-app --template https://gitlab.com/user/template.git
npx create-nosdav app my-app --template git@github.com:user/repo.git
```

## Commands

### `init [name]`
Initialize a new NosDav profile with decentralized identity structure.

```bash
npx create-nosdav init my-profile
cd my-profile
```

**Options:**
- `-d, --dir <directory>` - Target directory (default: current)

**Creates:**
- Profile metadata (`index.json`)
- Public type index (`settings/publicTypeIndex.json`)
- Directory structure for apps and data
- Crypto-secure identity keys

### `app <name>`
Create a new app from any template source.

```bash
# Built-in templates
npx create-nosdav app todo --template preact-todo
npx create-nosdav app dashboard --template dashboard

# Community templates  
npx create-nosdav app auth --template github:nosdav/auth-starter
npx create-nosdav app blog --template https://github.com/user/blog.git@v2
```

**Options:**
- `-t, --template <template>` - Template source (local name, github:user/repo, git URL)
- `-d, --dir <directory>` - Profile directory (default: current)

### `list`
List available built-in templates.

```bash
npx create-nosdav list
```

## Multi-File Templates

Templates can include multiple files for complex applications:

```
templates/preact-todo/
├── index.html          # Entry point with imports
├── components.js       # Preact components  
├── utils.js           # Utilities and helpers
└── styles.css         # Optional styles
```

**Example multi-file app:**
```bash
npx create-nosdav app todos --template preact-todo
```

**Creates:**
```
public/apps/todos/
├── app.json           # App metadata
├── index.html         # HTML entry point
├── components.js      # TodoApp component
├── utils.js          # Storage utilities
└── assets/           # Static resources
```

## Profile Structure

```
my-profile/
├── index.json              # Profile identity & metadata
├── index.html              # Profile homepage  
├── public/
│   ├── apps/               # Your applications
│   │   ├── todo/           # Multi-file app
│   │   │   ├── index.html
│   │   │   ├── components.js
│   │   │   └── utils.js
│   │   └── dashboard/      # Single-file app
│   │       └── index.html
│   ├── images/             # Profile assets
│   └── todo/               # Default data storage
└── settings/
    └── publicTypeIndex.json # App & data registry
```

## App Registration

Apps are automatically registered in your profile's type index for discoverability:

```json
{
  "type": "TypeRegistration",
  "forClass": "WebApp", 
  "instance": "../public/apps/todo/app.json",
  "registeredWith": "../public/apps/todo/"
}
```

## Template Caching

Git templates are cached locally for performance:

```
~/.create-nosdav/cache/
├── a1b2c3d4e5f6.../     # github:user/repo@main
└── f6e5d4c3b2a1.../     # github:user/repo@v1.0.0
```

**Cache behavior:**
- First use: Clone from Git repository
- Subsequent uses: "Using cached template" 
- Different branches/tags create separate cache entries
- Automatic cleanup removes `.git` directories

## Creating Templates

### Simple Template (Single File)
```
my-template/
└── index.html          # Template with {{variables}}
```

### Advanced Template (Multi-File)
```
my-template/
├── index.html          # Entry point
├── components.js       # Reusable components
├── utils.js           # Shared utilities  
├── styles.css         # Styling
└── assets/            # Static resources
    └── logo.png
```

**Variable substitution:**
```html
<title>{{title}}</title>
<h1>Welcome to {{name}}</h1>
```

### Template Repository
Share templates by creating a Git repository:

```bash
# Create template repo
git init my-awesome-template
# Add template files
git add .
git commit -m "Initial template"
git push origin main

# Others can use it
npx create-nosdav app cool-app --template github:yourname/my-awesome-template
```

## Community Ecosystem

**Discover Templates:**
- Browse GitHub topics: `nosdav-template`, `create-nosdav-template`
- Check community showcases and examples
- Share your own templates with the community

**Template Ideas:**
- Authentication systems with various providers
- Dashboard templates for different use cases  
- E-commerce storefronts
- Blog and content management
- Real-time chat applications
- Data visualization tools

## Development

**Local Development:**
```bash
git clone https://github.com/nosdav/create-nosdav.git
cd create-nosdav
npm install
npm link

# Test locally
create-nosdav init test-profile
cd test-profile
create-nosdav app demo --template preact-todo
```

**Template Testing:**
```bash
# Test local template
create-nosdav app test --template ./path/to/template

# Test Git template  
create-nosdav app test --template github:user/repo@branch
```

## Advanced Usage

**Template with specific branch:**
```bash
npx create-nosdav app app1 --template github:user/repo@feature-branch
npx create-nosdav app app2 --template github:user/repo@v2.1.0
```

**Private repositories:**
```bash
# Using SSH (requires Git credentials)
npx create-nosdav app private --template git@github.com:user/private-template.git

# Using HTTPS with token (set in Git config)  
npx create-nosdav app private --template https://github.com/user/private-repo.git
```

**Multiple profiles:**
```bash
npx create-nosdav init work-profile --dir ~/work
npx create-nosdav init personal-profile --dir ~/personal

# Create apps in specific profiles
npx create-nosdav app project --template github:company/template --dir ~/work/work-profile
```

## Requirements

- **Node.js** 16+ 
- **Git** (for community templates)
- Modern web browser (for running apps)

## License

MIT

---

**Ready to build the decentralized web?** 🚀

Start with `npx create-nosdav init my-profile` and explore the unlimited template ecosystem!