import { Page, Browser, BrowserContext } from 'playwright';

export interface CustomContext extends BrowserContext {
    testName?: string;
}

export type CreateScreenshots = {
    context: CustomContext;
    testName?: string;
    stepName: string;
    capture: boolean;
};

export type It = {
    browser?: Browser;
    context: BrowserContext;
    page: Page;
};
