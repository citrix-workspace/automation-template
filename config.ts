export const config = {
    headless: false,
    screenshotOnEachStep: false,
    stepScreenshots: true,
    devtools: false,
    workspaceIdentityProvider: process.env.CONFIG_IDP ? `${process.env.CONFIG_IDP}` : 'ad',
    workspaceUrl: process.env.CONFIG_WORKSPACE_URL
        ? `${process.env.CONFIG_WORKSPACE_URL}`
        : '',
    workspaceUsername: process.env.CONFIG_WORKSPACE_USERNAME ? `${process.env.CONFIG_WORKSPACE_USERNAME}` : '',
    workspacePassword: process.env.CONFIG_WORKSPACE_PASSWORD ? `${process.env.CONFIG_WORKSPACE_PASSWORD}` : '',
    cwaAPI: process.env.CONFIG_CWA_API ? `${process.env.CONFIG_CWA_API}` : '',
    citrixCloudCustomerId: process.env.CONFIG_CUSTOMER_ID ? `${process.env.CONFIG_CUSTOMER_ID}` : '',
    citrixCloudClientId: process.env.CONFIG_CLIENT_ID ? `${process.env.CONFIG_CLIENT_ID}` : '',
    citrixCloudClientSecret: process.env.CONFIG_CLIENT_SECRET ? `${process.env.CONFIG_CLIENT_SECRET}` : '',
    microappsAdminUrl: `https://${process.env.CONFIG_BUILDER_URL}/admin`,
    loggerFilter: `.${process.env.CONFIG_BUILDER_URL}(.*)initiator_type=BUTTON`,
};
