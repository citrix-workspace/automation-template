import { it, step } from '../../init';

const FIXTURE_NAME = 'example';

describe(FIXTURE_NAME, () => {
    it(FIXTURE_NAME, async ({ context, page }) => {
        await step(context)('Go to Example Page', async () => {
            await page.goto('https://www.example.com/');
        });

        await step(context)('Assert href', async () => {
            const href = await page.evaluate(() => { return document.location.href});
            expect(href).toEqual('https://www.example.com/')
        });
       
    });

    afterAll(async () => {
        console.log('after All');
    });
});
