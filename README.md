# create-nosdav

Create NosDav profiles and apps with ease.

## Quick Start

```bash
# Create a new profile
npx create-nosdav init my-profile

# Create your first app
cd my-profile
npx create-nosdav app todo-manager --template crud

# Create a dashboard app
npx create-nosdav app analytics --template dashboard
```

## Commands

### `init [name]`
Initialize a new NosDav profile with basic structure.

```bash
npx create-nosdav init my-profile
cd my-profile
```

Options:
- `-d, --dir <directory>` - Target directory (default: current)

### `app <name>`
Create a new app in your NosDav profile.

```bash
npx create-nosdav app my-app --template crud
```

Options:
- `-t, --template <template>` - App template (basic, crud, dashboard)
- `-d, --dir <directory>` - Profile directory (default: current)

### `list`
List available templates.

```bash
npx create-nosdav list
```

## Templates

### Basic
Simple static app with minimal HTML structure.

### CRUD
Create, Read, Update, Delete operations with localStorage persistence.

### Dashboard
Analytics-style dashboard with cards and statistics.

## Profile Structure

```
my-profile/
├── index.json              # Profile metadata
├── index.html              # Profile homepage
├── public/
│   ├── apps/               # Your apps
│   │   ├── todo-manager/
│   │   └── analytics/
│   ├── images/
│   └── todo/               # Default todo data
└── settings/
    └── publicTypeIndex.json # App registry
```

## App Structure

```
public/apps/my-app/
├── app.json                # App metadata
├── index.html              # App entry point
└── assets/                 # App resources
```

## Integration

Apps are automatically registered in `settings/publicTypeIndex.json`:

```json
{
  "type": "TypeRegistration",
  "forClass": "WebApp",
  "instance": "../public/apps/my-app/app.json",
  "registeredWith": "../public/apps/my-app/"
}
```

## Development

```bash
git clone <this-repo>
cd create-nosdav
npm install
npm link

# Test locally
create-nosdav init test-profile
cd test-profile
create-nosdav app demo --template crud
```

## License

MIT