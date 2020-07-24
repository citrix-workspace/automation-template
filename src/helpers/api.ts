import axios from "axios";
import { GetCitrixCloudTokens } from "../types/citrixCloud";
import {
  addApp,
  getBundleCatalogue,
  GetIntegration,
  GetIntegrations,
  getProcessStatus,
  IntegrationLogout,
  updateBundleCatalogue,
  updateintegrationConfiguration,
  validateConfiguration,
  getEntities,
  createEntity,
  finalizeConfig,
  getApps,
  getNotifications,
  runNotificationEvent,
  StartSynchronization,
} from "../types/microappsAdmin";

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

  async getCitrixCloudTokens({ cwaAPI, citrixCloudCustomerId, citrixCloudClientId, citrixCloudClientSecret }: GetCitrixCloudTokens) {
    try {
      return await axios({
        timeout: 180000,
        url: `https://trust.${cwaAPI}.net/${citrixCloudCustomerId}/tokens/clients`,
        method: "POST",
        data: {
          citrixCloudClientId,
          citrixCloudClientSecret,
        },
      });
    } catch (error) {
      throw error.stack;
    }
  }
  
  async getIntegrations({ authInstance, microappsAdminUrl }: GetIntegrations) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/service`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getBundleCatalogue({ authInstance, microappsAdminUrl }: getBundleCatalogue) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/bundleCatalogue`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async updateBundleCatalogue({ authInstance, microappsAdminUrl, catalogueId }: updateBundleCatalogue) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/bundleCatalogue/import/${catalogueId}`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async updateConnectorConfiguration({
    authInstance,
    microappsAdminUrl,
    integrationId,
    integrationConfiguration,
  }: updateintegrationConfiguration) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/service/${integrationId}`,
        method: "PUT",
        data: integrationConfiguration,
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getIntegration({ authInstance, microappsAdminUrl, integrationId }: GetIntegration) {
    return await authInstance({
      url: `${microappsAdminUrl}/api/service/${integrationId}`,
      method: "GET",
    });
  }

  async integrationLogout({ authInstance, microappsAdminUrl, integrationId }: IntegrationLogout) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/auth/serviceAction/logout/${integrationId}`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async validateConfiguration({ authInstance, microappsAdminUrl, serviceKey, configuration }: validateConfiguration) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/external-services/${serviceKey}/validate-configuration`,
        method: "POST",
        data: {
          configurationParameters: configuration,
          onPremProxyConfiguration: {
            useOnPremProxy: false,
            resourceLocation: "",
          },
        },
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async addApp({ authInstance, microappsAdminUrl, data }: addApp) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/app`,
        method: "POST",
        data,
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getProcessStatus({ authInstance, microappsAdminUrl, processId }: getProcessStatus) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/process/${processId}`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getEntities({ authInstance, microappsAdminUrl, integrationId }: getEntities) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/service/${integrationId}/entities`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async createEntity({ authInstance, microappsAdminUrl, integrationId, entityData }: createEntity) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/service/${integrationId}/entities`,
        method: "PUT",
        data: entityData,
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async finalizeConfig({ authInstance, microappsAdminUrl, integrationId }: finalizeConfig) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/service/${integrationId}/finalize-config`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getApps({ authInstance, microappsAdminUrl }: getApps) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/app`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getNotifications({ authInstance, microappsAdminUrl, appId }: getNotifications) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/notifications/app/${appId}`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async runNotificationEvent({ authInstance, microappsAdminUrl, notificationId }: runNotificationEvent) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/notification/${notificationId}/run`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }
  async startSynchronization({ authInstance, microappsAdminUrl, integrationId, synchronizationType }: StartSynchronization) {
    try {
      return await authInstance({
        url: `${microappsAdminUrl}/api/service/${integrationId}/run/${synchronizationType}`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }
}
