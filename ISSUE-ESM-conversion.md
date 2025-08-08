# Issue: Convert create-nosdav to ES modules

Currently using CommonJS with older dependency versions for compatibility. Should modernize to ES modules.

## Current state
- Using Chalk v4.1.2 (CommonJS)
- Using Inquirer v8.2.4 (CommonJS)  
- CommonJS require() syntax throughout

## Desired state
- Convert to ES modules with import/export
- Upgrade to Chalk v5+ (ESM-only)
- Upgrade to Inquirer v9+ (ESM-only)
- Add `"type": "module"` to package.json
- Update all require() to import statements

## Benefits
- Modern JavaScript standards
- Latest dependency versions with security updates
- Better tree-shaking and bundling
- Future-proof codebase

## Files to update
- package.json (add type: module, upgrade deps)
- bin/create-nosdav.js 
- src/commands/init.js
- src/commands/app.js

## Testing checklist
- [ ] Verify npx create-nosdav works across Node 16+
- [ ] Test all commands (init, app, list)
- [ ] Ensure cross-platform compatibility
- [ ] Test with various Node.js versions

## Implementation notes
Remember to update shebang and file extensions if needed for proper ESM support.