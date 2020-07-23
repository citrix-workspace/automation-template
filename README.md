# automation-template

## About this project
 share boilerplate code and directory sturcture acroos the projects

## Folder Structure

After creation, your project should look like this:

```
automation-template/
  artifacts/
  node_modules/
  README.md
  .prettierrc
  .gitignore
  config.ts
  init.ts
  jest.config.js
  jest.setup.js
  package.json
  README.md
  tsconfig.json
  src/
    __tests__/
    startAction.test.ts
    helpers/
    api.ts
    citrixCloud.ts
    microappsAdmin.ts
    workspace.ts
    types/
    citrixCloud.ts.ts
    microappsAdmin.ts
    workspace.ts
```
## Getting Started

### Installation

```bash
yarn 
```

### Running All Tests locally

```bash
yarn start test
```

### Running Single Test locally

```bash
yarn jest tests/example.test.ts
```

### Example of Test

```js
describe(FIXTURE_NAME, ('_Start Action_') => {
    it(FIXTURE_NAME, async ({ context, page }) => {
        await step(context)('Login to Workspace', async () => {
            await workspace.login({
                page,
                url: workspaceUrl,
                username: workspaceUsername,
                password: workspacePassword,
                idp: identityProvider,
            });
        });

        await step(context)('Go to Actions', async () => {
            await workspace.goToActions({ page });
        });

        await step(context)(`Click Action ${actionName}`, async () => {
            await workspace.startAction({ page, actionName });
        });
    });
});
```
