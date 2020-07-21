import { Login, SkipTour, GoToActions, StartAction } from "../types/workspace";

/** Class representing a Workspace. */
export class Workspace {
  constructor() {}
  /**
   * Login to Workspace
   * @param {Object} page - Methods to interact with a single tab or extension background page in Browser
   * @param {string} url - Workspace login url
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {string} idp - Identity provider
   */
  async login({ page, url, username, password, idp }: Login) {
    console.log("Login to Workspace", new Date());
    await page.goto(url, { waitUntil: "domcontentloaded" });
    switch (idp) {
      case "ad":
        await page.waitForSelector("#username");
        await page.type("#username", username);
        await page.waitForSelector("#password");
        await page.type("#password", password);
        await page.waitForSelector("#loginBtn");
        await page.click("#loginBtn");
        break;
      case "netscaler":
        await page.waitForSelector("#login");
        await page.type("#login", username);
        await page.waitForSelector("#passwd");
        await page.type("#passwd", password);
        await page.click("#nsg-x1-logon-button");
        break;
      case "aad":
        await page.waitForSelector('input[name="loginfmt"]');
        await page.type('input[name="loginfmt"]', username);
        await page.waitForSelector('input[value="Next"]');
        await page.click('input[value="Next"]');
        await page.waitForSelector('input[name="passwd"]');
        await page.type('input[name="passwd"]', password);
        await page.waitForSelector('input[value="Sign in"]');
        await page.click('input[value="Sign in"]');
        await page.waitForSelector('input[value="Yes"]');
        await page.click('input[value="Yes"]');
        break;
      case "okta":
        await page.waitForSelector("#okta-signin-username");
        await page.type("#okta-signin-username", username);
        await page.waitForSelector("#okta-signin-password");
        await page.type("#okta-signin-password", password);
        await page.waitForSelector("#okta-signin-submit");
        await page.click("#okta-signin-submit");
        break;
      default:
        console.log("Identity provider was not specified.");
    }
    await page.waitForSelector("#content");
    await this.skipTour({ page });
  }

  /**
   * Skip Tour
   * @param {Object} page - Methods to interact with a single tab or extension background page in Browser
   */

  async skipTour({ page }: SkipTour) {
    try {
      await page.waitForSelector(".cta-link a", { timeout: 5000 });
      const link = await page.$(".cta-link a");

      if (await link) {
        await page.click(".cta-link a");
      }
    } catch (error) {}
  }

  /**
   * Go to Actions
   * @param {Object} page - Methods to interact with a single tab or extension background page in Browser
   */

  async goToActions({ page }: GoToActions) {
    await page.waitForSelector("span >> text=Actions");
    await page.click("span >> text=Actions");
    await page.waitForLoadState("networkidle");
  }

  /**
   * Start Action
   * @param {Object} page - Methods to interact with a single tab or extension background page in Browser
   * @param {string} actionName - name of Action what should be executed
   */

  async startAction({ page, actionName }: StartAction) {
    console.log(`Choosing action ${actionName}`, new Date());
    await page.click(`div >> text=${actionName}`);
  }
}
