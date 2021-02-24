import { it, step } from '../../init';
import { CitrixCloud, MicroappsAdmin } from 'microapps-automation-helper';
import { config } from '../../config';
import { createReport } from '../helpers/createReport';
import { AxiosInstance } from 'axios';

const { citrixCloudClientId, citrixCloudClientSecret, citrixCloudCustomerId, cwaAPI, microappsAdminUrl } = config;
const citrixCloud = new CitrixCloud();
const microappsAdmin = new MicroappsAdmin();

const FIXTURE_NAME = '_Generic Synchronization Integrations test_';

const getIntegrationIds = (data: any[], synchronizationType: string): number[] => {
    const integrations = data.filter(
        (e: { syncType1: string; syncType2: string; syncType3: string }) =>
            e.syncType1 === synchronizationType ||
            e.syncType2 === synchronizationType ||
            e.syncType3 === synchronizationType
    );
    const integrationsIds = integrations.map((e: { id: number }) => e.id);
    return integrationsIds;
};

const getDataForResult = async (
    authInstance: AxiosInstance,
    microappsAdminUrl: string,
    synchronizationType: string
) => {
    const integrations = await microappsAdmin.getIntegrations({
        authInstance,
        microappsAdminUrl,
    });
    const expanded = [...integrations.data];

    const readyForSync = expanded.filter(
        (e) =>
            e.configMissing === false &&
            e.configurationPending === false &&
            e.secretsMissing === false &&
            e.oauthLoginNeeded === false &&
            e.updatePending === false
    );

    const filterd = readyForSync.filter((e) =>
        synchronizationType === 'IncrementalSynchronization'
            ? e.jobRuns.length === 2
            : e.jobRuns.length === 1 || e.jobRuns.length === 2
    );

    const jobRuns = filterd.map((e) => ({ integrationName: e.title, jobRunslenght: e.jobRuns.length }));

    const result = filterd.map((e) => ({
        testName: synchronizationType,
        integrationName: e.title,
        passed:
            synchronizationType === 'IncrementalSynchronization'
                ? e.jobRuns[1].lastRunSuccess
                : e.jobRuns[0].lastRunSuccess,
    }));
    return result;
};

describe(FIXTURE_NAME, () => {
    let bearerToken: string;
    let authInstance: AxiosInstance;
    let integrationsOverview: Array<Object>;
    let results: any[] = [];
    it(FIXTURE_NAME, async ({ context, page }) => {
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

        await step(context)('Filter available integrations for sync', async () => {
            const integrations = await microappsAdmin.getIntegrations({
                authInstance,
                microappsAdminUrl,
            });
            const expanded = [...integrations.data];

            const readyForSync = expanded.filter(
                (e) =>
                    e.configMissing === false &&
                    e.configurationPending === false &&
                    e.secretsMissing === false &&
                    e.oauthLoginNeeded === false &&
                    e.updatePending === false
            );

            integrationsOverview = readyForSync.map((integration) => ({
                name: integration.title,
                id: integration.id,
                syncType1:
                    integration.jobRuns['0'] !== undefined ? integration.jobRuns['0'].synchronizationTypeId : 'false',
                syncType2:
                    integration.jobRuns['1'] !== undefined ? integration.jobRuns['1'].synchronizationTypeId : 'false',
                syncType3:
                    integration.jobRuns['2'] !== undefined ? integration.jobRuns['2'].synchronizationTypeId : 'false',
            }));
        });

        await step(context)('Run incremental Synchronization', async () => {
            const synchronizationType = 'IncrementalSynchronization';
            const integrationIds: number[] = getIntegrationIds(integrationsOverview, synchronizationType);
            
            integrationIds.forEach(async (integrationId) => {
                await microappsAdmin.startSynchronization({
                    authInstance,
                    microappsAdminUrl,
                    integrationId: `${integrationId}`,
                    synchronizationType: synchronizationType,
                });
            });

            await microappsAdmin.waitForAllSync({ synchronizationType, authInstance, microappsAdminUrl });
            const result = await getDataForResult(authInstance, microappsAdminUrl, synchronizationType);
            createReport({ report: result, pathToFile: 'artifacts/powerBiReport.json' });
            results.push(result);
        });

        await step(context)('Run Full Synchronization', async () => {
            const synchronizationType = 'FullSynchronization';
            const integrationIds: number[] = getIntegrationIds(integrationsOverview, synchronizationType);

            integrationIds.forEach(async (integrationId) => {
                await microappsAdmin.startSynchronization({
                    authInstance,
                    microappsAdminUrl,
                    integrationId: `${integrationId}`,
                    synchronizationType: synchronizationType,
                });
            });

            await microappsAdmin.waitForAllSync({ synchronizationType, authInstance, microappsAdminUrl });
            const result = await getDataForResult(authInstance, microappsAdminUrl, synchronizationType);
            createReport({ report: result, pathToFile: 'artifacts/powerBiReport.json' });
            results.push(result);
        });

        await step(context)('Validate results', async () => {
            const testResults = results[0].map((e: { passed: boolean }) => e.passed);
            if (testResults.includes(false)) {
                throw new Error('Some Synchronization are failed');
            }
        });
    });
});
