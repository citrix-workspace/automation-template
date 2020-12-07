import playwright, { Browser, BrowserContext, BrowserType } from 'playwright';
import timestamp from 'time-stamp';
import path from 'path';
import { config } from './config';
import { It, CustomContext, CreateScreenshots } from './src/types/init';

const { screenshotOnEachStep, devtools, headless, defaultTimeout, loggErrors } = config;

const ts = () => timestamp('HH:mm:ss');

const { chromium, webkit, firefox } = playwright;

const browserType: BrowserType<Browser> = chromium;

const logTestDuration = async function (startTime: Date) {
    const endTime = new Date();
    const diffTime = +endTime - +startTime;
    console.info(`⏱️  Test took: ${Math.round(diffTime / 1000)} seconds.`);
};

export const initBrowserPlaywright = async () => {
    return await browserType.launch({ headless, devtools, timeout: 600000, args: ["--no-sandbox"] });
};

export const it = function (testName: string, func: ({ page, context, browser }: It) => void) {
    return test(testName, async () => {
        const browser = await initBrowserPlaywright();
        const context: CustomContext = await browser.newContext();
        const page = await context.newPage();
        context.testName = testName;
        page.setDefaultTimeout(defaultTimeout);

        page.on('pageerror', (err: any) => {
            console.log(ts(), 'pageerror: ', err);
        });
        const startTime = new Date();
        try {
            console.info(ts(), `➡️  ${testName}`);
            page.on(
                'response',
                async (response: { ok: () => boolean; text: () => Promise<string>; status: () => number; url: () => string }) => {
                    if (loggErrors && !response.ok()) {
                        try {
                            const text = await response.text();
                            console.log(
                                ts(),
                                'Bad response',
                                '\nStatus:',
                                response.status(),
                                '\nUrl:',
                                response.url(),
                                '\nBody text:',
                                text.substring(0, 200) // response is limited only to 200 symbols
                            );
                        } catch (err) {}
                    }
                }
            );

            await func({ page, context, browser });
            await logTestDuration(startTime);
        } catch (e) {
            await logTestDuration(startTime);
            throw e;
        } finally {
            await context.close();
            await browser.close();
        }
    });
};

const createScreenshots = async ({ context, stepName = '', capture }: CreateScreenshots) => {
    const testName = typeof context.testName === 'string' ? context.testName : '';
    try {
        const pages = await context.pages();
        if (pages.length > 0 && capture) {
            for (let i = 0; i < pages.length; i++) {
                const url = pages[i].url();
                const title = await pages[i].title();
                try {
                    await pages[i].screenshot({
                        path: path.resolve(__dirname, `./artifacts/${testName}step_[${stepName}]page_[${i}].png`),
                    });
                } catch (err) {
                    console.error(
                        err,
                        `Was unable to create screenshot for \n name: ${'testName'} \n step: ${stepName} \n title: ${title} \n url: ${url}.`
                    );
                }
            }
        }
    } catch {
        console.error(`Was unable to create screenshots for test ${'testName'}.`);
    }
};

export const step = (context: BrowserContext) => async (stepName: string, func: () => void) => {
    try {
        await func();
        // Creates screenshots on each step
        await createScreenshots({ context, stepName, capture: screenshotOnEachStep });

        console.info(ts(), `✅ ${stepName}`);
    } catch (e) {
        // Creates screenshots on fail
        await createScreenshots({ context, stepName, capture: true });
        console.info(ts(), `❌ ${stepName}`);
        throw e;
    }
};

export const run = async (runName: string, func: () => void) => {
    try {
        await func();
        console.info(ts(), `✅ ${runName}`);
    } catch (e) {
        console.info(ts(), `❌ ${runName}`);
        throw e;
    }
};
