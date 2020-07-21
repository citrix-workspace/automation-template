import axios from "axios";
import { GetCitrixCloudTokens } from "../types/citrixCloud.ts";
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
   * @param {string} customerId - Customer Id
   * @param {string} clientId - Client Id
   * @param {string} clientSecret - Client Secret
   */

  async getCitrixCloudTokens({ cwaAPI, customerId, clientId, clientSecret }: GetCitrixCloudTokens) {
    try {
      return await axios({
        timeout: 180000,
        url: `https://trust.${cwaAPI}.net/${customerId}/tokens/clients`,
        method: "POST",
        data: {
          clientId,
          clientSecret,
        },
      });
    } catch (error) {
      throw error.stack;
    }
  }

  
  /**
   * Get Citrix Cloud Tokens
   * @param {string} cwaAPI - Api Environmet
   * @param {string} customerId - Customer Id
   * @param {string} clientId - Client Id
   * @param {string} clientSecret - Client Secret
   */
  
  async getIntegrations({ authInstance, builderUrl }: GetIntegrations) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/service`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getBundleCatalogue({ authInstance, builderUrl }: getBundleCatalogue) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/bundleCatalogue`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async updateBundleCatalogue({ authInstance, builderUrl, catalogueId }: updateBundleCatalogue) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/bundleCatalogue/import/${catalogueId}`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async updateConnectorConfiguration({
    authInstance,
    builderUrl,
    integrationId,
    integrationConfiguration,
  }: updateintegrationConfiguration) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/service/${integrationId}`,
        method: "PUT",
        data: integrationConfiguration,
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getIntegration({ authInstance, builderUrl, integrationId }: GetIntegration) {
    return await authInstance({
      url: `${builderUrl}/api/service/${integrationId}`,
      method: "GET",
    });
  }

  async integrationLogout({ authInstance, builderUrl, integrationId }: IntegrationLogout) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/auth/serviceAction/logout/${integrationId}`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async validateConfiguration({ authInstance, builderUrl, serviceKey, configuration }: validateConfiguration) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/external-services/${serviceKey}/validate-configuration`,
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

  async addApp({ authInstance, builderUrl, data }: addApp) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/app`,
        method: "POST",
        data,
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getProcessStatus({ authInstance, builderUrl, processId }: getProcessStatus) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/process/${processId}`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getEntities({ authInstance, builderUrl, integrationId }: getEntities) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/service/${integrationId}/entities`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async createEntity({ authInstance, builderUrl, integrationId, entityData }: createEntity) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/service/${integrationId}/entities`,
        method: "PUT",
        data: entityData,
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async finalizeConfig({ authInstance, builderUrl, integrationId }: finalizeConfig) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/service/${integrationId}/finalize-config`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getApps({ authInstance, builderUrl }: getApps) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/app`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async getNotifications({ authInstance, builderUrl, appId }: getNotifications) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/notifications/app/${appId}`,
        method: "GET",
      });
    } catch (error) {
      throw error.stack;
    }
  }

  async runNotificationEvent({ authInstance, builderUrl, notificationId }: runNotificationEvent) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/notification/${notificationId}/run`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }
  async startSynchronization({ authInstance, builderUrl, integrationId, synchronizationType }: StartSynchronization) {
    try {
      return await authInstance({
        url: `${builderUrl}/api/service/${integrationId}/run/${synchronizationType}`,
        method: "POST",
      });
    } catch (error) {
      throw error.stack;
    }
  }
}
