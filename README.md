# automation-template

## About this project
> share boilerplate code and directory sturcture acroos the projects

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
