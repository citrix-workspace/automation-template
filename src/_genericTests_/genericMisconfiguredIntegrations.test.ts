import { it, step } from '../../init';
import { MicroappsAdmin, CitrixCloud } from 'microapps-automation-helper';
import { config } from '../../config';
import { createReport } from '../helpers/createReport';
import { AxiosInstance } from 'axios';

const FIXTURE_NAME = '_Generic Misconfigured Integrations test_';

const { microappsAdminUrl, citrixCloudClientId, citrixCloudClientSecret, citrixCloudCustomerId, cwaAPI } = config;

const microappsAdminApi = new MicroappsAdmin();
const citrixCloud = new CitrixCloud();

describe(FIXTURE_NAME, () => {
    let bearerToken: string;
    let authInstance: AxiosInstance;
    it(FIXTURE_NAME, async ({ context }) => {
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

        await step(context)('Check Missconfigurations', async () => {
            const integrations = await microappsAdminApi.getIntegrations({
                authInstance,
                microappsAdminUrl,
            });
            const microapps = await microappsAdminApi.getApps({ authInstance, microappsAdminUrl });
            const misconfiguredMicroApps = await microappsAdminApi.integrityCheck({
                authInstance,
                microappsAdminUrl,
            });

            const filteredMisconfiguredIntegrations = integrations.data.filter(
                (integration: {
                    configMissing: boolean;
                    secretsMissing: boolean;
                    oauthLoginNeeded: boolean;
                    jobRuns: Array<Object>;
                    id: string;
                    title: string;
                }) => {
                    if (integration.configMissing === true) return integration;

                    if (integration.secretsMissing === true) return integration;

                    if (integration.oauthLoginNeeded === true) return integration;

                    const integrationMicroapps = microapps.data.filter(
                        (app: { app: { serviceId: string } }) => app.app.serviceId === integration.id
                    );

                    for (let i = 0; i < integrationMicroapps.length; i++) {
                        const misconfigurations = misconfiguredMicroApps.data.filter(
                            (app: { appId: string }) => app.appId === integrationMicroapps[i].app.id
                        );
                        if (misconfigurations.length > 0) {
                            return integration;
                        }
                    }
                }
            );

            const misconfiguredIntegrations = integrations.data.map((integration: { title: string }) => ({
                testName: `Misconfigured`,
                integrationName: integration.title,
                passed:
                    filteredMisconfiguredIntegrations.filter(
                        (misconfigIntegration: { title: string }) => misconfigIntegration.title === integration.title
                    ).length > 0
                        ? false
                        : true,
            }));

            createReport({ report: misconfiguredIntegrations, pathToFile: 'artifacts/powerBiReport.json' });

            if (
                misconfiguredIntegrations.filter((integration: { passed: boolean }) => integration.passed === false)
                    .length > 0
            ) {
                throw new Error('Some integrations are misconfigured');
            }
        });
    });
});
