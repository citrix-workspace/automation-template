import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { CitrixCloud } from './citrixCloud';
import {
    CreateHTTPIntegration,
    CreateJavaIntegration,
    ExportApp,
    GetIntegrationId,
    GetIntegrationType,
    GetMicroAppId,
    GetNotificationId,
    GetStatusIntegration,
    ImportIntegration,
    Login,
    OauthLogout,
    RenameIntegration,
    RunEvent,
    RunSynchronization,
    WaitForProcessStatus,
    WaitForSync,
    CheckAppMissconfigurations,
} from '../types/microappsAdmin';
import { API } from './api';

const citrixCloud = new CitrixCloud();

/** Class representing a Microapps Admin. */
export class MicroappsAdmin extends API {
    constructor() {
        super();
    }

    /**
     * Login to cloud
     * @param {string} - Microapps cloud login url
     * @param {string} - Username
     * @param {string} - Password
     */

    async login({ page, url, username, password, mfa = null, secretKey }: Login) {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#username');
        await page.type('#username', username);
        await page.waitForSelector('#password');
        await page.type('#password', password);
        await page.waitForSelector('#submit');
        await page.click('#submit');

        if (mfa) {
            const authCode = await citrixCloud.getAuthenticatorCode({ secretKey });

            await page.waitForSelector('input[inputmode]');
            for (let i = 0; i < 6; i++) {
                await page.type(`input[inputmode][name="${i}"]`, authCode[i]);
            }

            await page.waitForSelector('button[type="button"]:not([disabled])');
            await page.click('button[type="button"]:not([disabled])');

            try {
                for (;;) {
                    if ((await page.$(`input[inputmode][name="0"][value="${authCode[0]}"]`)) !== null) {
                        await page.waitForTimeout(300);
                    } else break;
                }
            } catch (error) {}
        }
    }

    /**
     * Get Integration Id
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     */

    async getIntegrationId({ authInstance, microappsAdminUrl, integrationName }: GetIntegrationId) {
        const integrations = await this.getIntegrations({ authInstance, microappsAdminUrl });
        const integration = integrations.data.find((e: { title: string }) => e.title === integrationName);
        return integration.id;
    }

    /**
     * Delete credentiaslds from credentials wallet for specific inregration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     * @param {number} repeatCount - Set count for retries
     */

    async oauthLogout({ authInstance, microappsAdminUrl, integrationName, repeatCount = 1 }: OauthLogout) {
        const integrationId = await this.getIntegrationId({ authInstance, microappsAdminUrl, integrationName });
        for (let i = 0; i < repeatCount; i++) {
            await this.integrationLogout({ authInstance, microappsAdminUrl, integrationId });
        }
    }

    /**
     * Wait for syncronization and check the result of sync
     * @param {Function} getIntegration - Fetch status of integration
     * @param {string} synchronizationType - Set type of syncronization full/incremental
     */

    async waitForSync({ getIntegration, synchronizationType }: WaitForSync) {
        let lastRunSuccess;
        let cancelled;
        let running;

        for (;;) {
            const integration = await getIntegration();
            const jobRuns = integration.data.jobRuns;
            const getJobRunDetail = jobRuns.find((job: { synchronizationTypeId: string }) => {
                return job.synchronizationTypeId === synchronizationType;
            });

            running = getJobRunDetail.running;

            cancelled = getJobRunDetail.cancelled;

            lastRunSuccess = getJobRunDetail.lastRunSuccess;

            if ((await running) === false) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        if ((await lastRunSuccess) === false) {
            throw new Error(`Sync failed!`);
        } else if (cancelled === true) {
            throw new Error(`Sync was cancelled!`);
        }
    }

    /**
     * Run syncronization for specific Integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     * @param {string} synchronizationType - Set type of syncronization full/incremental
     */

    async runSynchronization({
        authInstance,
        microappsAdminUrl,
        integrationName,
        synchronizationType,
    }: RunSynchronization) {
        const integrationId = await this.getIntegrationId({
            authInstance,
            microappsAdminUrl,
            integrationName,
        });

        const integration = await this.getIntegration({ authInstance, microappsAdminUrl, integrationId });

        const jobRuns = integration.data.jobRuns;

        const getJobRunDetail = jobRuns.find((job: { synchronizationTypeId: string }) => {
            return job.synchronizationTypeId === synchronizationType;
        });

        if (getJobRunDetail.length === 0) {
            await this.startSynchronization({
                authInstance,
                microappsAdminUrl,
                integrationId,
                synchronizationType,
            });

            await this.waitForSync({
                getIntegration: () => this.getIntegration({ authInstance, microappsAdminUrl, integrationId }),
                synchronizationType,
            });
        } else if (getJobRunDetail.running === true) {
            await this.waitForSync({
                getIntegration: () => this.getIntegration({ authInstance, microappsAdminUrl, integrationId }),
                synchronizationType,
            });
        } else {
            await this.startSynchronization({
                authInstance,
                microappsAdminUrl,
                integrationId,
                synchronizationType,
            });

            await this.waitForSync({
                getIntegration: () => this.getIntegration({ authInstance, microappsAdminUrl, integrationId }),
                synchronizationType,
            });
        }
    }

    /**
     * Create HTTP Integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     * @param {string} integrationConfiguration - Additional integration configuration
     */

    async createHTTPIntegration({
        authInstance,
        microappsAdminUrl,
        integrationName,
        integrationConfiguration,
    }: CreateHTTPIntegration) {
        const bundleCatalogue = await this.getBundleCatalogue({ authInstance, microappsAdminUrl });
        const bundleCatalogueData = bundleCatalogue.data;
        const catalogueDetail = bundleCatalogueData.find((e: any) => e.title === integrationName && e.type === 'HTTP');
        const catalogueId = catalogueDetail.uniqueId;
        const createdConnector = await this.updateBundleCatalogue({ authInstance, microappsAdminUrl, catalogueId });
        const integrationId = createdConnector.data.id;

        await this.updateConnectorConfiguration({
            authInstance,
            microappsAdminUrl,
            integrationId,
            integrationConfiguration,
        });

        return integrationId;
    }

    /**
     * Wait for  process status
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} status - specific status of process
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} processId - Id of process
     */

    async waitForProcessStatus({ authInstance, status, microappsAdminUrl, processId }: WaitForProcessStatus) {
        let processStatus;
        for (let i = 0; i < 35; i++) {
            processStatus = await this.getProcessStatus({ authInstance, microappsAdminUrl, processId });
            if (processStatus.data.message !== undefined) {
                console.log(processStatus.data.message);
            }

            if ((await processStatus.data.status) === status) {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        if ((await processStatus.data.status) !== status) {
            throw new Error(`Process status is: ${processStatus.data.status}`);
        }
        return processStatus;
    }

    /**
     * Create Java Integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     * @param {string} integrationConfiguration - Additional integration configuration
     */

    async createJavaIntegration({
        authInstance,
        microappsAdminUrl,
        integrationConfiguration,
        withEntities = true,
        serviceType = null,
        serviceKey,
        name = '',
    }: CreateJavaIntegration) {
        let processId: string;

        const configurationParameters = integrationConfiguration.serviceData.configuration.configurationParameters;

        const responseValidation = await this.validateConfiguration({
            authInstance,
            microappsAdminUrl,
            serviceKey,
            configuration: configurationParameters,
        });

        const responseValidationBody = JSON.stringify(responseValidation.data);
        if (!responseValidationBody.includes('ok')) {
            throw new Error('Configuration is not valid!');
        }

        const app = await this.addApp({ authInstance, microappsAdminUrl, data: integrationConfiguration });

        processId = app.data.processId;

        const processStatus = await this.waitForProcessStatus({
            authInstance,
            getProcessStatus: () => this.getProcessStatus({ authInstance, microappsAdminUrl, processId }),
            status: 'DONE',
            microappsAdminUrl,
            processId,
        });

        const integrationId = processStatus.data.detail.service.id;

        let entities;
        let entityFilters;

        // Some connectors have different flow for getting entities
        if (serviceType === 'Service Now' || serviceType === 'Salesforce') {
            const services = await this.getIntegration({ authInstance, microappsAdminUrl, integrationId });

            entities = services.data.configuration.entities;

            entityFilters = services.data.configuration.entityFilters;
        } else {
            const response = await this.getEntities({
                authInstance,
                microappsAdminUrl,
                integrationId,
            });

            processId = response.data.processId;

            await this.waitForProcessStatus({
                authInstance,
                getProcessStatus: () => this.getProcessStatus({ authInstance, microappsAdminUrl, processId }),
                status: 'DONE',
                microappsAdminUrl,
                processId,
            });

            const processDetail = await this.getProcessStatus({ authInstance, microappsAdminUrl, processId });
            entities = processDetail.data.detail.data.entities;
            entityFilters = processDetail.data.detail.data.entityFilters;
        }

        const entityNames: any[] = [];

        entities.forEach((el: { name: any }) => entityNames.push(el.name));

        const entityData = {
            entityNames: entityNames,
            entityAttributeNamesMap: {},
            entityFilters: entityFilters,
        };

        if (withEntities) {
            const entity = await this.createEntity({ authInstance, microappsAdminUrl, integrationId, entityData });

            processId = entity.data.processId;

            await this.waitForProcessStatus({
                authInstance,
                getProcessStatus: () => this.getProcessStatus({ authInstance, microappsAdminUrl, processId }),
                status: 'DONE',
                microappsAdminUrl,
                processId,
            });
            await this.finalizeConfig({ authInstance, microappsAdminUrl, integrationId });
        }
    }

    /**
     * Get type of Integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     */

    async getIntegrationType({ authInstance, microappsAdminUrl, integrationName }: GetIntegrationType) {
        const integrations = await this.getIntegrations({ authInstance, microappsAdminUrl });

        const integrationsData = integrations.data;

        const findIntegrationType = integrationsData.find((integration: { title: string }) => {
            return integration.title === integrationName;
        });

        const integrationType = findIntegrationType.serviceType;
        return integrationType;
    }

    /**
     * Get status of Integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     */

    async getStatusIntegration({ authInstance, microappsAdminUrl, integrationName }: GetStatusIntegration) {
        try {
            const serviceId = await this.getIntegrationId({ authInstance, microappsAdminUrl, integrationName });
            return serviceId;
        } catch (e) {
            return null;
        }
    }

    /**
     * Import integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} pathToFile - path to file.mapp which should be imported
     */

    async importIntegration({ authInstance, microappsAdminUrl, pathToFile }: ImportIntegration) {
        const form: any = new FormData();
        let response;

        form.append('file', fs.createReadStream(path.resolve(__dirname, pathToFile)));

        try {
            response = await authInstance({
                url: `${microappsAdminUrl}/api/service/import`,
                method: 'POST',
                headers: {
                    'content-type': `multipart/form-data; boundary=${form._boundary}`,
                },
                data: form,
            });
        } catch (error) {
            throw error.stack;
        }

        await assert.deepStrictEqual(
            response.status,
            200,
            `Response status ${response.status} doesn't match expected 200`
        );
    }

    /**
     * Rename integration
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of integration
     * @param {string} newIntegrationName - New Name of integration
     * @param {string} integrationConfiguration - Configuration for integration
     */

    async renameIntegration({
        authInstance,
        microappsAdminUrl,
        integrationName,
        newIntegrationName,
        integrationConfiguration,
    }: RenameIntegration) {
        const integrationType = await this.getIntegrationType({ authInstance, microappsAdminUrl, integrationName });
        const data = {
            serviceType: integrationType,
            title: newIntegrationName,
        };
        const integrationId = await this.getStatusIntegration({ authInstance, microappsAdminUrl, integrationName });

        await this.updateConnectorConfiguration({
            authInstance,
            microappsAdminUrl,
            integrationId,
            integrationConfiguration,
        });

        const integrations = await this.getIntegrations({ authInstance, microappsAdminUrl });
        const integrationsData = integrations.data;
        const IntegrationDetail = integrationsData.filter((e: { title: any; id: any }) => {
            return e.title === integrationName && e.id === newIntegrationName;
        });

        console.log(
            `Integration ${integrationName} with id: ${IntegrationDetail[0].id} was renamed to:  ${integrationsData[0].title}`
        );
    }

    /**
     * Export Application
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} appId - Id of target App
     * @param {string} pathToFile - path where file should be saved
     */

    async exportApp({ authInstance, microappsAdminUrl, appId, pathToFile }: ExportApp) {
        let response;
        try {
            response = await authInstance({
                method: 'GET',
                url: `${microappsAdminUrl}/api/app/${appId}/export`,
                responseType: 'stream',
            });
        } catch (error) {
            throw error.stack;
        }
        await response.data.pipe(fs.createWriteStream(path.resolve(__dirname, pathToFile)));
    }

    /**
     * Get Id of Microapp
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationId - Name of integration
     * @param {string} appName - Name Application
     */

    async getMicroAppId({ authInstance, microappsAdminUrl, integrationId, appName }: GetMicroAppId) {
        let apps;
        try {
            apps = await this.getApps({ authInstance, microappsAdminUrl });
            const appsData = apps.data;
            const getAppDetail = appsData.filter(
                (app: { app: { title: string; serviceId: string } }) =>
                    app.app.title === appName && app.app.serviceId === integrationId
            );

            return getAppDetail[0].id;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Get Id of Notification
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} appId - Name of App
     * @param {string} notificationName - Name of Notification
     */

    async getNotificationId({ authInstance, microappsAdminUrl, appId, notificationName }: GetNotificationId) {
        const notifications = await this.getNotifications({
            authInstance,
            microappsAdminUrl,
            appId,
        });

        const notificationsData = notifications.data;

        const getNotificationId = notificationsData.find((e: { label: string }) => {
            return e.label === notificationName;
        });

        const notificationId = getNotificationId.id;

        return notificationId;
    }

    /**
     * Run a Event
     * @param {Object} authInstance - Authorized instance for API calls
     * @param {string} microappsAdminUrl - Microapps admin url
     * @param {string} integrationName - Name of Integration
     * @param {string} appName - Name of App
     *  @param {string} notificationName - Name of Notification
     */

    async runEvent({ authInstance, microappsAdminUrl, integrationName, appName, notificationName }: RunEvent) {
        let notifications;
        const integrationId = await this.getIntegrationId({ authInstance, microappsAdminUrl, integrationName });

        const appId = await this.getMicroAppId({ authInstance, microappsAdminUrl, integrationId, appName });

        const notificationId = await this.getNotificationId({
            authInstance,
            appId,
            microappsAdminUrl,
            notificationName,
        });

        await this.runNotificationEvent({ authInstance, microappsAdminUrl, notificationId });

        for (let i = 0; i < 10; i++) {
            notifications = await this.getNotifications({ authInstance, microappsAdminUrl, appId });

            const running = notifications.data[0].running;

            if ((await running) === false) {
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        const lastRunStatus = notifications.data[0].lastRunStatus;
        if ((await lastRunStatus) !== 'SUCCESS') {
            throw new Error('Event run failed!');
        }
    }

    async checkAppMissconfigurations({ authInstance, microappsAdminUrl, appId }: CheckAppMissconfigurations) {
        const response = await this.integrityCheck({ authInstance, microappsAdminUrl });
        const responseBody = response.data
        const missconfigurations: any = responseBody.filter((e: { appId: string }) => e.appId === appId);

        if (!Array.isArray(missconfigurations) || !missconfigurations.length) {
            console.log(`appId: ${appId} has no missconfigurations`);
        }

        console.log('missconfigurations: ', missconfigurations);
    }
}
