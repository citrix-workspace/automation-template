# automation-template

## About this project

Share boilerplate code and directory structure across the projects

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
    data/
        matrix.js
    __tests__/
        approveEntityFromBlade.test.ts
        approveEntityFromFeedCard.test.ts
        createEntity.test.ts
        example.test.ts
    helpers/
        api.ts
        citrixCloud.ts
        microappsAdmin.ts
        setupintegrations.ts
        workspace.ts
    types/
        api.ts
        citrixCloud.ts
        init.ts
        microappsAdmin.ts
        workspace.ts
```
## Related projects we use

-   [TypeScript]
-   [Jest]
-   [Prettier]
-   [Playwright]

## Getting Started

#### Installation

```bash
yarn
```

#### Running All Tests locally

```bash
yarn test
```

#### Running Single Test locally

```bash
yarn jest tests/example.test.ts
```

### Example of Test

#### Create Test

```ts
// Class for APIs accessing the System of Record (eg. salesforceAPI)
const sorAPI = new sorAPI();
const workspace = new Workspace();

const { workspaceUrl, identityProvider, customerId, cwaAPI, clientId, clientSecret } = config;

describe(FIXTURE_NAME, ('_Create record_') => {
    let ticketId: string;
    let sorBearerToken: string;
    let testidentificator: string;

    it(FIXTURE_NAME, async ({ context, page }) => {
        await step(context)('Get MS CRM token', async () => {
            sorBearerToken = await sorAPI.getBearerToken({});
        });

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
            await workspace.startAction({ page, actionName, integrationName });
        });

        await step(context)('Fill in all necessary information', async () => {
            testIdentificator = 'Create record test';

            await page.waitForSelector(selector);
            await page.click(selector);

            await page.waitForSelector(selector2);
            await page.type(selector2, testIdentificator);
        });

        await step(context)('Submit record', async () => {
            await page.waitForSelector('footer button:not([disabled])');
            await page.click('footer button:not([disabled])');
        });

        await step(context)('Get Record ID', async () => {
            const response = await page.waitForResponse(
                (response: { url: () => string; status: () => number }) =>
                    response.url().match(new RegExp(config.loggerFilter)) && response.status() === 200
            );
            const responseJSON: any = await response.json();
            ticketId = responseJSON.processedRecords[0].recordId.issue_key;
        });

        await step(context)('Wait for PopUp to display success message', async () => {
            await workspace.waitForPopUp({
                page,
                text: 'Your request will be processed in',
            });
        });

        await step(context)('Check if the record was submited with API', async () => {
            const verification = await sorAPI.checkRecordSubmited({ sorBearerToken, ticketId });
            expect(verification.status).toEqual(200);
        });
    });
    afterAll(async () => {
        await run('Delete the Record', async () => {
            const respDelete = await sorAPI.deleteRecord({ sorBearerToken, ticketId });
            await expect(respDelete.status).toEqual(204);
        });
    });
});
```

#### Update Test

```ts
// Class for APIs accessing the System of Record (eg. salesforceAPI)
const sorAPI = new sorAPI();
const workspace = new Workspace();

const { workspaceUrl, identityProvider, customerId, cwaAPI, clientId, clientSecret, builderUrl } = config;

describe(FIXTURE_NAME, ('_Update record_') => {
    let ticketId: string;
    let sorBearerToken: string;
    let testIdentificator: string;

    it(FIXTURE_NAME, async ({ context, page }) => {
        await step(context)('Get SoR token', async () => {
            sorBearerToken = await sorAPI.getBearerToken({});
        });

        await step(context)('Create Record in SoR with API', async () => {
            testIdentificator = 'Update record test';

            const createRecord = await sorAPI.createRecord({ sorBearerToken, testIdentificator });

            ticketId = createRecord.data.record_id;
        });

        await step(context)('Get Citrix Cloud token', async () => {
            bearerToken = await citrixCloud.getCCBearerToken({
                cwaAPI,
                citrixCloudCustomerId: customerId,
                citrixCloudClientId: clientId,
                citrixCloudClientSecret: clientSecret,
            });
        });

        await step(context)('Create Authorization instance for Citrix Cloud', async () => {
            authInstance = await citrixCloud.createAuthInstance({ bearerToken });
        });

        await step(context)('API OAuth logout', async () => {
            await microappsAdmin.oauthLogout({ authInstance, microappsAdminUrl: builderUrl, integrationName });
        });

        await step(context)(`Run  ${synchronizationType}`, async () => {
            await microappsAdmin.runSynchronization({
                authInstance,
                microappsAdminUrl: builderUrl,
                integrationName,
                synchronizationType,
            });
        });
        await step(context)('Login to Workspace', async () => {
            await workspace.login({
                page,
                url: workspaceUrl,
                username: workspaceUsername,
                password: workspacePassword,
                idp: identityProvider,
            });
        });

        await step(context)('Wait for loading feedcards', async () => {
            await page.waitForSelector('#notification-home-feed-cards', {});
        });

        await step(context)('Wait for Feed Card', async () => {
            feedCardId = await workspace.waitForFeedCardId({ page, recordId: leadId });
        });

        await step(context)('Open blade', async () => {
            await page.waitForSelector(`#feed-card-body-${feedCardId}`);
            await page.click(`#feed-card-body-${feedCardId}`);
        });

        await step(context)('Edit Record', async () => {
            await page.waitForSelector(selector);
            await page.click(selector);

            await page.waitForSelector(selector2);
            await page.type(selector2, testIdentificator);
        });

        await step(context)('Submit record', async () => {
            await page.waitForSelector('footer button:not([disabled])');
            await page.click('footer button:not([disabled])');
        });

        await step(context)('Wait for PopUp to display success message', async () => {
            await workspace.waitForPopUp({
                page,
                text: 'Your request will be processed in',
            });
        });

        await step(context)('Check if the record was submited with API', async () => {
            const verification = await sorAPI.checkRecordSubmited({ sorBearerToken, ticketId });
            expect(verification.data.description).toEqual(testIdentificator);
        });
    });
    afterAll(async () => {
        await run('Delete the Record', async () => {
            const respDelete = await sorAPI.deleteRecord({ sorBearerToken, ticketId });
            await expect(respDelete.status).toEqual(204);
        });
    });
});
```

### Example for creating authorization instance for Citrix Cloud

```ts
let bearerToken: string;
let authInstance: string;

const { customerId, cwaAPI, clientId, clientSecret } = config;

bearerToken = await citrixCloud.getCCBearerToken({
    cwaAPI,
    citrixCloudCustomerId: customerId,
    citrixCloudClientId: clientId,
    citrixCloudClientSecret: clientSecret,
});

authInstance = await citrixCloud.createAuthInstance({ bearerToken });
```

### Examples for working with Workspace contents

#### Click on Action in Actions in Workspace

```ts
const workspace = new Workspace();

await workspace.startAction({ page, actionName, integrationName });
```

### Examples for working with Blade contents

#### Select Option and check if correct value is selected

```ts
await page.selectOption(selector, value);

const selectValue: any = await page.$(selector);

expect(await selectValue.evaluate((element: any) => element.value)).toEqual(value);
```

#### Using Look-Up component

```ts
await page.type(selector, text);

const environmentUrl = config.microappsAdminUrl.replace('/admin', '');

await page.waitForResponse(
    (response: { url: () => string; status: () => number }) =>
        response.url().includes(`${environmentUrl}/app/api/app`) && response.status() === 200
);

await page.press(selector, 'Enter');
```

#### Waiting until button is not disabled

```ts
await page.waitForSelector('footer button:not([disabled])');
```

#### Rewrite already filled text label

```ts
await page.evaluate(
    () => ((<HTMLInputElement>document.querySelectorAll('[data-testid="integration-name"]')[0]).value = '')
);
await page.type('[data-testid="integration-name"]', integrationName);
```

### Examples for working with FeedCard contents

#### Get FeedCardID for future localization of the FeedCard

```ts
const workspace = new Workspace();

const feedcardId = await workspace.waitForFeedCardId({ page, recrodId });
```

#### Click on Button on FeedCard

```ts
const workspace = new Workspace();

const button = await workspace.getFeedCardButton({ page, feedCardId, buttonName });

await button[0].click();
```

[typescript]: https://www.typescriptlang.org/
[prettier]: https://prettier.io/
[jest]: https://jestjs.io/
[playwright]: https://[playwright.dev]
