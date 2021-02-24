const axios = require('axios');
const fs = require('fs');

const { runNumber, startDate, CONFIG_CUSTOMER_ID, serverVersionrTest, endDate, workflowName, powerBiApiKey } = process.env;

(async () => {
    let reportToPowerBI = [];
    fs.readFile('artifacts/powerBiReport.json', async function readFileCallback(err, data) {
        if (err) {
            console.log(err);
            throw new Error('Error while reading the report JSON file.');
        } else {
            const report = JSON.parse(data);
            report.forEach((integration) => {
                reportToPowerBI.push({
                    buildID: runNumber,
                    startTime: startDate,
                    customerIDCC: CONFIG_CUSTOMER_ID,
                    versionMAServer: serverVersionrTest,
                    integrationName: integration.integrationName,
                    passed: integration.passed ? 1 : 0,
                    failed: integration.passed ? 0 : 1,
                    skipped: 0,
                    total: 1,
                    endTime: endDate,
                    jobName: workflowName,
                    testName: integration.testName,
                });
            });
            try {
                await axios.post(`${powerBiApiKey}`, reportToPowerBI);
            } catch (err) {
                console.log(err);
                throw new Error(`API POST request to PowerBI failed`);
            }
        }
    });
})();
