import { it, step } from '../../init';
import { Workspace } from '../helpers/workspace';
import { config } from '../../config';

const { workspaceUrl, workspaceUsername, workspacePassword, workspaceIdentityProvider } = config;

const workspace = new Workspace();
const FIXTURE_NAME = 'aaa';
const actionName = 'aaa';

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
    });
});
