export const config = {
    headless: false,
    screenshotOnEachStep: true,
    stepScreenshots: true,
    devtools: false,
    identityProvider: `${process.env.CONFIG_IDP}`,
    workspaceUrl: `${process.env.CONFIG_WORKSPACE_URL}`,
    workspaceUsername: `${process.env.CONFIG_WORKSPACE_USERNAME}`,
    workspacePassword: `${process.env.CONFIG_WORKSPACE_PASSWORD}`
};