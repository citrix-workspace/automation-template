import { it, step, run } from '../../init';
import { Workspace } from '../helpers/workspace';
import { CitrixCloud } from '../helpers/citrixCloud';
import { MicroappsAdmin } from '../helpers/microappsAdmin';
import { config } from '../../config';

const {
    microappsAdminUrl,
    citrixCloudClientId,
    citrixCloudClientSecret,
    citrixCloudCustomerId,
    cwaAPI,
    workspaceIdentityProvider,
    workspacePassword,
    workspaceUrl,
    workspaceUsername,
} = config;

const citrixCloud = new CitrixCloud();
const microappsAdmin = new MicroappsAdmin();
const workspace = new Workspace();

const FIXTURE_NAME = '_Approve Entity from feed card_';
const integrationName = 'integrationName';
const appName = 'appName';
const notificationName = 'notificationName';
const synchronizationType = 'IncrementalSynchronization';

let bearerToken: string;
let authInstance: any;
let integrationId: string;
let appId: string;
let notificationId: string;
let feedCardId: string;
let recordId: string;

describe.skip(FIXTURE_NAME, () => {
    it(FIXTURE_NAME, async ({ context, page }) => {
        await step(context)('Create Entity Record in SoR', async () => {
            // Create record in SoR using API and return Record Id
        });

        await step(context)('Get Citrix Cloud token', async () => {
            bearerToken = await citrixCloud.getCCBearerToken({
                cwaAPI,
                citrixCloudCustomerId,
                citrixCloudClientId,
                citrixCloudClientSecret,
            });
        });

        await step(context)('Create Authorization instance for Citrix Cloud', async () => {
            authInstance = await citrixCloud.createAuthInstance({ bearerToken });
        });

        await step(context)('Get notification id', async () => {
            // Creatr single function
            integrationId = await microappsAdmin.getIntegrationId({ authInstance, microappsAdminUrl, integrationName });

            appId = await microappsAdmin.getMicroAppId({ authInstance, microappsAdminUrl, integrationId, appName });

            notificationId = await microappsAdmin.getNotificationId({
                authInstance,
                microappsAdminUrl,
                appId,
                notificationName,
            });
        });
        await step(context)('API OAuth logout', async () => {
            await microappsAdmin.oauthLogout({ authInstance, microappsAdminUrl, integrationName, repeatCount: 2 });
        });

        await step(context)(`Run  ${synchronizationType}`, async () => {
            await microappsAdmin.runSynchronization({
                authInstance,
                microappsAdminUrl,
                integrationName: '',
                synchronizationType,
            });
        });

        await step(context)('Login to Workspace', async () => {
            await workspace.login({
                page,
                workspaceUrl,
                workspaceUsername,
                workspacePassword,
                workspaceIdentityProvider,
            });
        });

        await step(context)('Wait for Feed Card', async () => {
            feedCardId = await workspace.waitForFeedCardId({
                page,
                recordId,
                notificationId,
            });
        });

        await step(context)('Approve Entity from Feed Card', async () => {
            await page.waitForSelector(`#feed-card-body-${feedCardId}`);
            const button = await workspace.getFeedCardButton({
                page,
                feedCardId,
                buttonName: 'Approve',
            });
            await button[0].click();
        });

        await step(context)('OAuth login to SoR', async () => {
            // Go trough oauth flow of SoR for action authorization
        });

        await step(context)('Success Popup has been displayed', async () => {
            await workspace.waitForPopUp({
                page,
                text: 'Your request will be processed in',
            });
        });

        await step(context)('Assert that Entity has been approved', async () => {
            // assertion that Entity has been approved using API
            await expect('Entity').toEqual('approved');
        });
    });
    afterAll(async () => {
        await run('Delete the Entity', async () => {
            // Deleting Entity from SoR using API
        });
    });
});
