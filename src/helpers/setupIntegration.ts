import { config } from '../../config';
import { CitrixCloud, MicroappsAdmin } from 'microapps-automation-helper';
import matrix from '../data/matrix';

const { microappsAdminUrl, citrixCloudClientId, citrixCloudClientSecret, citrixCloudCustomerId, cwaAPI } = config;

const microapps = matrix.integrations.integration.microapps;
const integrationName = matrix.integrations.integration.settings.name;
const pathToFile = matrix.integrations.integration.settings.pathToFile;
const integrationConfiguration = matrix.integrations.integration.settings.configuration;

const citrixCloud = new CitrixCloud();
const microappsAdmin = new MicroappsAdmin();
let bearerToken: string;

export const setupIntgration = async () => {
    bearerToken = await citrixCloud.getCCBearerToken({
        cwaAPI,
        citrixCloudCustomerId,
        citrixCloudClientId,
        citrixCloudClientSecret,
    });

    const authInstance = await citrixCloud.createAuthInstance({ bearerToken });
    const res = await microappsAdmin.getStatusIntegration({
        authInstance,
        microappsAdminUrl,
        integrationName,
    });
    if (res !== null) {
        console.log(`[${integrationName}] - Deleting Integration`);
        await microappsAdmin.deleteIntegration({ authInstance, microappsAdminUrl, integrationId: res });
    }

    const response: any = await microappsAdmin.importIntegration({
        authInstance,
        microappsAdminUrl,
        pathToFile,
    });
    console.log(response.data);
    const integrationId = response.data.id;
    console.log(integrationId);

    await microappsAdmin.updateintegrationConfiguration({
        authInstance,
        microappsAdminUrl,
        integrationId,
        integrationConfiguration,
    });

    const appsRespnonse = await microappsAdmin.getApps({ authInstance, microappsAdminUrl });
    const appsData = appsRespnonse.data;
    const apps = appsData.filter((e: any) => e.app.serviceId === integrationId);

    let appsIds: any = [];

    apps.forEach((e: any) => appsIds.push(e.id));

    for (const appId of appsIds) {
        await microappsAdmin.checkAppMissconfigurations({ authInstance, microappsAdminUrl, appId });
    }

    await microappsAdmin.addSubscribers({ authInstance, integrationName, microappsAdminUrl, microapps, config });

    await microappsAdmin.getIntegration({ authInstance, microappsAdminUrl, integrationId });

    await microappsAdmin.waitForSync({
        getIntegration: () => microappsAdmin.getIntegration({ authInstance, microappsAdminUrl, integrationId }),
        synchronizationType: 'FullSynchronization',
    });
};
