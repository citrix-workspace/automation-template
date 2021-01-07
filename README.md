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
        setupIntegration.ts
    types/
        init.ts
```
## Related projects we use

-   [TypeScript](https://www.typescriptlang.org/docs)
-   [Jest](https://jestjs.io/docs/en/getting-started)
-   [Prettier](https://prettier.io/docs/en/index.html)
-   [Playwright](https://playwright.dev/)
-   [dotenv](https://github.com/motdotla/dotenv#readme)

## Getting Started

#### Installation

```bash
yarn
```
##### How to handle local secrets

To be able to load your env variables, you can create your own config:
```
touch .env
```

Example of .env
```
CONFIG_WORKSPACE_USERNAME=jon@doe.com
CONFIG_WORKSPACE_PASSWORD-myP@ssword1
```
:warning: Don`t commit .env file into repository - you can add .env to .gitignore and now you can run yor test 
#### Running All Tests locally

```bash
yarn jest src/__tests__ --setupFiles dotenv/config
```

#### Running Single Test locally with env config

```bash
yarn jest src/__tests__/example.test.ts --setupFiles dotenv/config
```

### Running only specific tests with Github Actions

There is a field named `Test map` which is generaly empty and that means all tests will be run.

 - To run just one test type in the field `FIXTURE_NAME` of the test <b>---></b>  `_Example_`
 - To run two or more tests, but not all, type there all `FIXTURE_NAME`s seperating them with `|` <b>---></b> `_Example_|_Example2_|_Example3_`

 If you want to define default list of tests to always appear in the field `Test map`, edit the .yml file you are using at `on > workflow_dispatch > inputs > testList > default`:

 ```yml
on:
    workflow_dispatch:
        inputs:
            testList:
                description: 'List of tests to run'
                required: false
                default: #here -> '_Example_|_Example2_|_Example3_'
 ```

So it should look like this: 

 ```yml
on:
    workflow_dispatch:
        inputs:
            testList:
                description: 'List of tests to run'
                required: false
                default: '_Example_|_Example2_|_Example3_'
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

### Example of screenshot comparation

For screenshot testing we are using tool Jest Image Snapshot 
This tool is comapring actual state of a page or page component with saved image
During the first run the benchmark image is created. This image has to be check if the UI is in demanded state

```ts

describe(FIXTURE_NAME, () => {


    it(FIXTURE_NAME, async ({ context, page }) => {
        const testIdentificator = getTestId();
        console.log(testIdentificator);

        await step(context)('Login to Workspace', async () => {
            await workspaceUi.login({
                page,
                workspaceUrl,
                workspaceUsername: username,
                workspacePassword: password,
                workspaceIdentityProvider: idp,
            });
        });

        await step(context)('Go to Action page', async () => {
            await workspaceUi.goToActions({ page });
        });

        await step(context)('Click on "Create Account" MicroApp', async () => {
            await workspaceUi.startAction({ page, actionName: 'Create Account' });
        });

        await step(context)('Wait for Blade to load', async () => {
            await page.waitForSelector('[data-testid="text-input-account"]');
        });

        /// this is the main part of the test, screenshot is taken a compared to the saved one

        await step(context)('Compare screenshots', async () => {
            //take a screenshot
            const screenshot = await page.screenshot()
            expect.extend({ toMatchImageSnapshot });
            expect(screenshot).toMatchImageSnapshot();
        });
    });
});
```


[typescript]: https://www.typescriptlang.org/
[prettier]: https://prettier.io/
[jest]: https://jestjs.io/
[playwright]: https://[playwright.dev]
