import  { Page } from "playwright";

export type Login = {
  page: Page;
  url: string;
  username: string;
  password: string;
  mfa: any | boolean;
  secretKey: string;
};

export type GetIntegrations = {
  authInstance: any;
  microappsAdminUrl: string;
};

export type GetIntegrationId = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
};

export type GetIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
};

export type IntegrationLogout = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
};

export type OauthLogout = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  repeatCount: number;
};

export type StartSynchronization = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  synchronizationType: string;
};

export type WaitForSync = {
  getIntegration: () => any;
  synchronizationType: string;
};

export type RunSynchronization = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  synchronizationType: string;
};

export type getBundleCatalogue = {
  authInstance: any;
  microappsAdminUrl: string;
};

export type updateBundleCatalogue = {
  authInstance: any;
  microappsAdminUrl: string;
  catalogueId: string;
};

export type updateintegrationConfiguration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  integrationConfiguration: any;
};

export type createHTTPIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  integrationConfiguration: any;
};

export type validateConfiguration = {
  authInstance: any;
  microappsAdminUrl: string;
  serviceKey: string;
  configuration: string;
};

export type waitForProcessStatus = {
  authInstance: any;
  getProcessStatus: () => any;
  status: string;
  microappsAdminUrl: string;
  processId: string;
};

export type addApp = {
  authInstance: any;
  microappsAdminUrl: string;
  data: string;
};

export type createJavaIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  data: string;
  integrationConfiguration: any;
  withEntities: boolean;
  serviceType: any;
  serviceKey: string;
  name: string;
};

export type getProcessStatus = {
  authInstance: any;
  microappsAdminUrl: string;
  processId: string;
};

export type getEntities = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
};

export type createEntity = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  entityData: any;
};

export type finalizeConfig = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
};

export type getIntegrationType = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
};

export type getStatusIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
};

export type importIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  pathToFile: string;
};

export type renameIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  newIntegrationName: string;
  integrationConfiguration: string;
};

export type exportApp = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
  pathToFile: string;
};

export type getApps = {
  authInstance: any;
  microappsAdminUrl: string;
};


export type getMicroAppId = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  appName: string;
};

export type getNotifications = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
};

export type getNotificationId = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
  notificationName: string;
};

export type runNotificationEvent = {
  authInstance: any;
  microappsAdminUrl: string;
  notificationId: string;
};

export type runEvent = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  appName: string;
  notificationName: string;
};
