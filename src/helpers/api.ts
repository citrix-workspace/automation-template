import axios, { AxiosInstance } from 'axios';
import { GetCitrixCloudTokens } from '../types/citrixCloud';
import fs from 'fs';
import path from 'path';
import {
    AddApp,
    CreateEntity,
    DeleteIntegration,
    ExportIntegration,
    FinalizeConfig,
    GetApps,
    GetBundleCatalogue,
    GetDomain,
    GetEntities,
    GetIntegration,
    GetIntegrations,
    GetNotifications,
    GetProcessStatus,
    GetQuery,
    GetSubscribers,
    IntegrationLogout,
    IntegrityCheck,
    RunNotificationEvent,
    StartSynchronization,
    UpdateBundleCatalogue,
    UpdateintegrationConfiguration,
    UpdateSubscribers,
    ValidateConfiguration,
} from '../types/api';

/** Class representing a Citrix Cloud. */
export class API {
    constructor() {}
    /**
     * Get Citrix Cloud Tokens
     * @param {string} cwaAPI - Api Environmet
     * @param {string} citrixCloudCustomerId - Customer Id
     * @param {string} citrixCloudClientId - Client Id
     * @param {string} citrixCloudClientSecret - Client Secret
     */

    async getCitrixCloudTokens({
        cwaAPI,
        citrixCloudCustomerId,
        citrixCloudClientId,
        citrixCloudClientSecret,
    }: GetCitrixCloudTokens) {
        try {
            return await axios({
                timeout: 180000,
                url: `https://trust.${cwaAPI}.net/${citrixCloudCustomerId}/tokens/clients`,
                method: 'POST',
                data: {
                    clientId: citrixCloudClientId,
                    clientSecret: citrixCloudClientSecret,
                },
            });
        } catch (error) {
            throw error.stack;
        }
    }
    /**
     * Get all Integrations in Miroapps Admin
     * @param {object} authInstance - Axios instance
     * @param {string} microappsAdminUrl - Microapps Admin Url
     */

    async getIntegrations({ authInstance, microappsAdminUrl }: GetIntegrations) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    /**
     * Get Bundle Catalogue in Miroapps Admin
     * @param {object} authInstance - Axios instance
     * @param {string} microappsAdminUrl - Microapps Admin Url
     */

    async getBundleCatalogue({ authInstance, microappsAdminUrl }: GetBundleCatalogue) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/bundleCatalogue`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    /**
     * Update Bundle Catalogue in Miroapps Admin
     * @param {object} authInstance - Axios instance
     * @param {string} microappsAdminUrl - Microapps Admin Url
     * @param {string} catalogueId - Catalogue Id
     */
    async updateBundleCatalogue({ authInstance, microappsAdminUrl, catalogueId }: UpdateBundleCatalogue) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/bundleCatalogue/import/${catalogueId}`,
                method: 'POST',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    /**
     * Update Integration Configuration in Miroapps Admin
     * @param {object} authInstance - Axios instance
     * @param {string} microappsAdminUrl - Microapps Admin Url
     * @param {string} integrationId - Integration Id
     * @param {string} integrationConfiguration - integrationConfiguration
     */
    async updateintegrationConfiguration({
        authInstance,
        microappsAdminUrl,
        integrationId,
        integrationConfiguration,
    }: UpdateintegrationConfiguration) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service/${integrationId}`,
                method: 'PUT',
                data: integrationConfiguration,
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getIntegration({ authInstance, microappsAdminUrl, integrationId }: GetIntegration) {
        return await authInstance({
            url: `${microappsAdminUrl}/api/service/${integrationId}`,
            method: 'GET',
        });
    }

    async integrationLogout({ authInstance, microappsAdminUrl, integrationId }: IntegrationLogout) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/auth/serviceAction/logout/${integrationId}`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async validateConfiguration({ authInstance, microappsAdminUrl, serviceKey, configuration }: ValidateConfiguration) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/external-services/${serviceKey}/validate-configuration`,
                method: 'POST',
                data: {
                    configurationParameters: configuration,
                    onPremProxyConfiguration: {
                        useOnPremProxy: false,
                        resourceLocation: '',
                    },
                },
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async addApp({ authInstance, microappsAdminUrl, data }: AddApp) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/app`,
                method: 'POST',
                data,
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getProcessStatus({ authInstance, microappsAdminUrl, processId }: GetProcessStatus) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/process/${processId}`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getEntities({ authInstance, microappsAdminUrl, integrationId }: GetEntities) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service/${integrationId}/entities`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async createEntity({ authInstance, microappsAdminUrl, integrationId, entityData }: CreateEntity) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service/${integrationId}/entities`,
                method: 'PUT',
                data: entityData,
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async finalizeConfig({ authInstance, microappsAdminUrl, integrationId }: FinalizeConfig) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service/${integrationId}/finalize-config`,
                method: 'POST',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getApps({ authInstance, microappsAdminUrl }: GetApps) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/app`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getNotifications({ authInstance, microappsAdminUrl, appId }: GetNotifications) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/notifications/app/${appId}`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async runNotificationEvent({ authInstance, microappsAdminUrl, notificationId }: RunNotificationEvent) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/notification/${notificationId}/run`,
                method: 'POST',
            });
        } catch (error) {
            throw error.stack;
        }
    }
    async startSynchronization({
        authInstance,
        microappsAdminUrl,
        integrationId,
        synchronizationType,
    }: StartSynchronization) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service/${integrationId}/run/${synchronizationType}`,
                method: 'POST',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async integrityCheck({ authInstance, microappsAdminUrl }: IntegrityCheck) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/app/integrity-check`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }
    async deleteIntegration({ authInstance, microappsAdminUrl, integrationId }: DeleteIntegration) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/service/${integrationId}`,
                method: 'DELETE',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getDomain({ authInstance, cwaAPI, citrixCloudCustomerId, workspaceIdentityProvider }: GetDomain) {
        try {
            switch (workspaceIdentityProvider) {
                case 'ad':
                    return await authInstance({
                        url: `https://cws.${cwaAPI}.net/${citrixCloudCustomerId}/domainconfigurations`,
                        method: 'GET',
                        params: {
                            Provider: workspaceIdentityProvider.toUpperCase(),
                        },
                    });
                case 'netscaler':
                    return await authInstance({
                        url: `https://cws.${cwaAPI}.net/${citrixCloudCustomerId}/domainconfigurations`,
                        method: 'GET',
                        params: {
                            Provider: 'AD',
                        },
                    });
                case 'aad':
                    return await authInstance({
                        url: `https://cws.${cwaAPI}.net/${citrixCloudCustomerId}/AuthDomains`,
                        method: 'GET',
                    });
                case 'okta':
                    break;
                default:
                    console.log(`getDomain is currently not implemented for this idp: ${workspaceIdentityProvider}`);
                    break;
            }
        } catch (error) {
            throw error.stack;
        }
    }

    async getQuery({
        authInstance,
        cwaAPI,
        domainName,
        forestName,
        appId,
        query,
        citrixCloudCustomerId,
        idpType,
    }: GetQuery) {
        try {
            return await authInstance({
                url: `https://cws.${cwaAPI}.net/${citrixCloudCustomerId}/users/query`,
                method: 'POST',
                data: {
                    adminUser: '',
                    domain: domainName,
                    forest: forestName,
                    idpType: idpType,
                    key: '',
                    offerings: [
                        {
                            compatibleIdentities: [
                                {
                                    compatibleIdentity: 'OID:/*',
                                    reasons: [],
                                },
                            ],
                            offeringId: appId,
                        },
                    ],
                    query: query,
                    supportsAzureAdGroups: idpType === 'AZUREAD',
                },
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async updateSubscribers({
        authInstance,
        microappsAdminUrl,
        assign,
        userDetail,
        appId,
        domainName,
        forestName,
        workspaceIdentityProvider,
    }: UpdateSubscribers) {
        const { accountName, displayName, universalClaims, identityInformation, isGroup } = userDetail[0];

        const getOID = universalClaims.filter((value: string) => {
            return value.startsWith('OID');
        });

        const oid = getOID[0];

        let ipForUpdate;
        switch (workspaceIdentityProvider) {
            case 'ad':
            case 'netscaler':
                ipForUpdate = 'AD';
                break;
            case 'aad':
                ipForUpdate = 'AzureAD';
                break;
            case 'okta':
                ipForUpdate = 'Okta';
                break;
            default:
                ipForUpdate = null;
                console.log(`Adding subscribers is currently not implemented for this idp`);
                break;
        }

        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/security/app-user/selected-groups/${appId}`,
                method: 'PUT',
                data: [
                    {
                        oid: oid,
                        accountName: accountName,
                        displayName: displayName,
                        directoryContext: {
                            domain: domainName,
                            forest: forestName,
                            identityProvider: ipForUpdate,
                        },
                        email: identityInformation.email,
                        isGroup: isGroup,
                        domain: domainName,
                        userPrincipalName: identityInformation.email,
                        universalClaims: universalClaims,
                        assign: assign === 'Add' ? true : false,
                    },
                ],
            });
        } catch (error) {
            throw error.stack;
        }
    }

    async getSubscribers({ authInstance, microappsAdminUrl, appId }: GetSubscribers) {
        try {
            return await authInstance({
                url: `${microappsAdminUrl}/api/security/app-user/selected-groups/${appId}`,
                method: 'GET',
            });
        } catch (error) {
            throw error.stack;
        }
    }

    /**
     * Import Integration from an exported Integration file
     *
     * @param {object} authInstance - Axios instance
     * @param {string} microappsAdminUrl - Microapps Admin Url
     * @param {string} integrationId - Id of itntegration
     * @param {string} filePath - Path where to file will be saved
     * @param {string} params -  Mandatadory params are vendor, appId (which apps will be  exported) and optional param description.
     * Example: vendor=Citrix&appId=myAppId1&appId=myAppId2&description=
     */

    async exportIntegration({ authInstance, microappsAdminUrl, integrationId, filePath, params }: ExportIntegration) {
        let response;
        try {
            response = await authInstance({
                method: 'GET',
                url: `${microappsAdminUrl}/api/service/${integrationId}/export`,
                params,
                responseType: 'stream',
            });
        } catch (error) {
            throw error.stack;
        }

        await response.data.pipe(fs.createWriteStream(path.resolve(__dirname, filePath)));
    }
}
