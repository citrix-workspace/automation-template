import axios from "axios";
import { authenticator } from "otplib";
import {
  CreateAuthInstance,
  GetAuthenticatorCode,
  GetCCBearerToken,
} from "../types/citrixCloud.ts";
import { API } from "./api";

authenticator.options = { digits: 6 };

/** Class representing a Citrix Cloud. */
export class CitrixCloud extends API {
  constructor() {
    super();
  }

  async getAuthenticatorCode({ secretKey }: GetAuthenticatorCode) {
    return authenticator.generate(secretKey);
  }

  /**
   * Get Citrix Cloud Bearer Token
   * @param {string} cwaAPI - Api Environmet
   * @param {string} customerId - Customer Id
   * @param {string} clientId - Client Id
   * @param {string} clientSecret - Client Secret
   */

  async getCCBearerToken({ cwaAPI, customerId, clientId, clientSecret }: GetCCBearerToken): Promise<string> {
    const response = await this.getCitrixCloudTokens({ cwaAPI, customerId, clientId, clientSecret });
    return response.data.token;
  }

  /**
   * Create Authorized Instace
   * @param {string} bearerToken - Access token
   */

  async createAuthInstance({ bearerToken }: CreateAuthInstance) {
    const authInstance = axios.create({});
    authInstance.defaults.headers.common["Authorization"] = `CWSAuth bearer=${bearerToken}`;
    return authInstance;
  }
}
