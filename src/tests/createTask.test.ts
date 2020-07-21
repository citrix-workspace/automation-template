import { it, step } from '../../init';
import { Workspace } from '../helpers/workspace';

const workspace = new Workspace();

const FIXTURE_NAME = '';
const workspaceUrl = '';
const workspaceUsername = '';
const workspacePassword = '';
const identityProvider = '';
const actionName = '';

describe(FIXTURE_NAME, () => {
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
