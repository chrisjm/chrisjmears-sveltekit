# Agent Instructions

## Node Version Management

Before running any Node.js commands, ensure you are using the correct Node version specified in `.nvmrc`:

```bash
nvm use
```

This will automatically use the version specified in the `.nvmrc` file (currently Node 22).

## Build Verification

After making code changes, run type checking and linting:

```bash
pnpm run check
```

Only run a full build if you have made changes to the build process, configuration, or need to verify production output:

```bash
pnpm run build
```
