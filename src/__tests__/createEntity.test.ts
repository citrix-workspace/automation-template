import { it, step, run } from '../../init';
import { Workspace } from '../helpers/workspace';
import { config } from '../../config';

const { workspaceUrl, workspaceUsername, workspacePassword, workspaceIdentityProvider } = config;

const workspace = new Workspace();
const FIXTURE_NAME = '_Create Entity from Workspace Action_';
const actionName = 'Create Entity';

let recordId: string;

describe(FIXTURE_NAME, () => {
    it(FIXTURE_NAME, async ({ context, page }) => {
        await step(context)('Login to Workspace', async () => {
            await workspace.login({
                page,
                workspaceUrl,
                workspaceUsername,
                workspacePassword,
                workspaceIdentityProvider,
            });
        });

        await step(context)('Go to Actions', async () => {
            await workspace.goToActions({ page });
        });

        await step(context)(`Click Action ${actionName}`, async () => {
            await workspace.startAction({ page, actionName });
        });

        await step(context)('Wait for Blade to load', async () => {
            await page.waitForSelector('[data-testid="text-input-title"]');
        });

        await step(context)('Fill form and submit', async () => {
            // Fill all mandatory or necessary inputs and submit form
        });

        await step(context)('Fill form and submit', async () => {
            // Fill all mandatory or necessary inputs and submit form
        });
        await step(context)('OAuth login to SoR', async () => {
            // Go trough oauth flow of SoR for action authorization
        });

        await step(context)('Get Record Id of creeated Entity', async () => {
            // Filter record Id of created entity from response
            const response = await page.waitForResponse(
                (response: { url: () => string; status: () => number }) =>
                    response.url().match(new RegExp(config.loggerFilter)) && response.status() === 200
            );
            const responseJSON: any = await response.json();
            recordId = responseJSON.recordId;
        });

        await step(context)('Assert that Entity has been created', async () => {
            // assertion that Entity has been created in SoR using API
        });
    });
    afterAll(async () => {
        await run('Delete the Entity', async () => {
            // Deleting Entity from SoR using API
        });
    });
});
