import axios, { AxiosInstance } from 'axios';
import { GetCitrixCloudTokens } from '../types/citrixCloud';
import {
    AddApp,
    GetBundleCatalogue,
    GetIntegration,
    GetIntegrations,
    GetProcessStatus,
    IntegrationLogout,
    UpdateBundleCatalogue,
    UpdateintegrationConfiguration,
    ValidateConfiguration,
    GetEntities,
    CreateEntity,
    FinalizeConfig,
    GetApps,
    GetNotifications,
    RunNotificationEvent,
    StartSynchronization,
    IntegrityCheck,
} from '../types/microappsAdmin';

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
                    citrixCloudClientId,
                    citrixCloudClientSecret,
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
}
