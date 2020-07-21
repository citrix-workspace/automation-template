export type GetAuthenticatorCode = {
    secretKey: string;
  };
  
  export type GetCitrixCloudTokens = {
    cwaAPI: string;
    customerId: string;
    clientId: string;
    clientSecret: string;
  };
  
  export type GetCCBearerToken = {
    cwaAPI: string;
    customerId: string;
    clientId: string;
    clientSecret: string;
  };
  
  export type CreateAuthInstance = {
      bearerToken: string;
  }