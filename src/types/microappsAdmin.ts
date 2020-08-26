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

export type GetBundleCatalogue = {
  authInstance: any;
  microappsAdminUrl: string;
};

export type UpdateBundleCatalogue = {
  authInstance: any;
  microappsAdminUrl: string;
  catalogueId: string;
};

export type UpdateintegrationConfiguration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  integrationConfiguration: any;
};

export type CreateHTTPIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  integrationConfiguration: any;
};

export type ValidateConfiguration = {
  authInstance: any;
  microappsAdminUrl: string;
  serviceKey: string;
  configuration: string;
};

export type WaitForProcessStatus = {
  authInstance: any;
  getProcessStatus: () => any;
  status: string;
  microappsAdminUrl: string;
  processId: string;
};

export type AddApp = {
  authInstance: any;
  microappsAdminUrl: string;
  data: string;
};

export type CreateJavaIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  data: string;
  integrationConfiguration: any;
  withEntities: boolean;
  serviceType: any;
  serviceKey: string;
  name: string;
};

export type GetProcessStatus = {
  authInstance: any;
  microappsAdminUrl: string;
  processId: string;
};

export type GetEntities = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
};

export type CreateEntity = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  entityData: any;
};

export type FinalizeConfig = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
};

export type GetIntegrationType = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
};

export type GetStatusIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
};

export type ImportIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  pathToFile: string;
};

export type RenameIntegration = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  newIntegrationName: string;
  integrationConfiguration: string;
};

export type ExportApp = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
  pathToFile: string;
};

export type GetApps = {
  authInstance: any;
  microappsAdminUrl: string;
};

export type GetMicroAppId = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationId: string;
  appName: string;
};

export type GetNotifications = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
};

export type GetNotificationId = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
  notificationName: string;
};

export type RunNotificationEvent = {
  authInstance: any;
  microappsAdminUrl: string;
  notificationId: string;
};

export type RunEvent = {
  authInstance: any;
  microappsAdminUrl: string;
  integrationName: string;
  appName: string;
  notificationName: string;
};

export type CheckAppMissconfigurations = {
  authInstance: any;
  microappsAdminUrl: string;
  appId: string;
};

export type IntegrityCheck = {
  authInstance: any;
  microappsAdminUrl: string;
};

export type ImportIntegrationUI = {
  page: Page;
  microappsAdminUrl: string;
  filePath: string;
}

export type ImportMicroAppUI = {
  page: Page;
  microappsAdminUrl: string;
  filePath: string;
  integrationName: string;
}

