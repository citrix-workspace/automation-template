const secrets = JSON.parse(`${process.env.CONFIG_SECRETS}`);

export const config = {
    envSecrets: JSON.parse(`${process.env.CONFIG_SECRETS}`),
    headless: true,
    screenshotOnEachStep: false,
    stepScreenshots: true,
    devtools: false,
    workspaceIdentityProvider: secrets.CONFIG_IDP ? `${secrets.CONFIG_IDP}` : 'ad',
    workspaceUrl: secrets.CONFIG_WORKSPACE_URL ? `${secrets.CONFIG_WORKSPACE_URL}` : '',
    workspaceUsername: secrets.CONFIG_WORKSPACE_USERNAME ? `${secrets.CONFIG_WORKSPACE_USERNAME}` : '',
    workspacePassword: secrets.CONFIG_WORKSPACE_PASSWORD ? `${secrets.CONFIG_WORKSPACE_PASSWORD}` : '',
    cwaAPI: secrets.CONFIG_CWA_API ? `${secrets.CONFIG_CWA_API}` : '',
    citrixCloudCustomerId: secrets.CONFIG_CUSTOMER_ID ? `${secrets.CONFIG_CUSTOMER_ID}` : '',
    citrixCloudClientId: secrets.CONFIG_CLIENT_ID ? `${secrets.CONFIG_CLIENT_ID}` : '',
    citrixCloudClientSecret: secrets.CONFIG_CLIENT_SECRET ? `${secrets.CONFIG_CLIENT_SECRET}` : '',
    microappsAdminUrl: secrets.CONFIG_MICROAPPS_ADMIN_URL ? `${secrets.CONFIG_MICROAPPS_ADMIN_URL}` : '',
    loggerFilter: `.${secrets.CONFIG_BUILDER_URL}(.*)initiator_type=BUTTON`,
    defaultTimeout: 90000,
    shouldConfigureIntegrations: false,
    loggErrors: true,
};
