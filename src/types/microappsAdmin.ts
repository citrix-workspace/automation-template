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
  builderUrl: string;
};

export type GetIntegrationId = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
};

export type GetIntegration = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
};

export type IntegrationLogout = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
};

export type OauthLogout = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
  repeatCount: number;
};

export type StartSynchronization = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
  synchronizationType: string;
};

export type WaitForSync = {
  getIntegration: () => any;
  synchronizationType: string;
};

export type RunSynchronization = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
  integrationName: string;
  synchronizationType: string;
  page: Page;
  url: string;
  username: string;
  password: string;
  mfa: any | boolean;
  secretKey: string;
  repeatCount: number;
};

export type getBundleCatalogue = {
  authInstance: any;
  builderUrl: string;
};

export type updateBundleCatalogue = {
  authInstance: any;
  builderUrl: string;
  catalogueId: string;
};

export type updateintegrationConfiguration = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
  integrationConfiguration: any;
};

export type createHTTPIntegration = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
  integrationConfiguration: any;
};

export type validateConfiguration = {
  authInstance: any;
  builderUrl: string;
  serviceKey: string;
  configuration: string;
};

export type waitForProcessStatus = {
  authInstance: any;
  getProcessStatus: () => any;
  status: string;
  builderUrl: string;
  processId: string;
};

export type addApp = {
  authInstance: any;
  builderUrl: string;
  data: string;
};

export type createJavaIntegration = {
  authInstance: any;
  builderUrl: string;
  data: string;
  integrationConfiguration: any;
  withEntities: boolean;
  serviceType: any;
  serviceKey: string;
  name: string;
};

export type getProcessStatus = {
  authInstance: any;
  builderUrl: string;
  processId: string;
};

export type getEntities = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
};

export type createEntity = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
  entityData: any;
};

export type finalizeConfig = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
};

export type getIntegrationType = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
};

export type getStatusIntegration = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
};

export type importIntegration = {
  authInstance: any;
  builderUrl: string;
  pathToFile: string;
};

export type renameIntegration = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
  newIntegrationName: string;
  integrationConfiguration: string;
};

export type exportApp = {
  authInstance: any;
  builderUrl: string;
  appId: string;
  pathToFile: string;
};

export type getApps = {
  authInstance: any;
  builderUrl: string;
};


export type getMicroAppId = {
  authInstance: any;
  builderUrl: string;
  integrationId: string;
  appName: string;
};

export type getNotifications = {
  authInstance: any;
  builderUrl: string;
  appId: string;
};

export type getNotificationId = {
  authInstance: any;
  builderUrl: string;
  appId: string;
  notificationName: string;
};

export type runNotificationEvent = {
  authInstance: any;
  builderUrl: string;
  notificationId: string;
};

export type runEvent = {
  authInstance: any;
  builderUrl: string;
  integrationName: string;
  appName: string;
  notificationName: string;
};
