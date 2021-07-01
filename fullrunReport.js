const fs = require('fs');
const axios = require('axios');
const argv = require('yargs').argv;

(async () => {
    axios.defaults.timeout = 30000;
    const reportToPowerBi = [];
    try {
        const reportBuffer = fs.readFileSync(`./artifacts/finalReport.json`);
        const reports = JSON.parse(reportBuffer.toString());

        const buildID = Number(argv.buildID);
        const parentalRunId = Number(argv.parentalRunId);
        const constantReport = {
            buildID,
            fullrunStartTime: argv.startTime,
            customerIDCC: argv.customerID,
            versionMAServer: argv.serverVersionTest,
            fullrunEndTime: argv.endTime,
            jobName: argv.jobName,
            parentalRunId,
            misconfigured: reports.missConfigured,
        };

        reports.testResults.forEach((report) => {
            reportToPowerBi.push({
                ...constantReport,
                integrationName: report.assertionResults[0].ancestorTitles[0],
                startTime: new Date(report.startTime).toISOString(),
                endTime: new Date(report.endTime).toISOString(),
                passed: report.status === 'passed',
                failed: report.status === 'failed',
                testName: report.assertionResults[0].title,
            });
        });
    } catch (e) {
        console.error('Failed to create a report', e);
    }

    await axios.post(`${argv.powerBiApiKey}`, reportToPowerBi);
    console.log('PowerBI report sent', reportToPowerBi);
})();
