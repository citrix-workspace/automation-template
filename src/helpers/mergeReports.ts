import fs, { existsSync } from 'fs';

interface CreateReport {
    setupReport: string;
    testReport: string;
    writeFilePath?: string;
}

export const mergeReports = ({ setupReport, testReport, writeFilePath="artifacts/mergedReport.json" }: CreateReport) => {
    if (existsSync(setupReport) && existsSync(testReport)) {
        let setupReportData = fs.readFileSync(setupReport, 'utf8');

        let setupReportObj = JSON.parse(setupReportData);

        let testReportData = fs.readFileSync(testReport, 'utf8');
        let testReportObj = JSON.parse(testReportData);

        let mergedReport = {
            ...setupReportObj[0],
            ...testReportObj,
        };
        console.log(mergedReport);

        fs.writeFile(writeFilePath, JSON.stringify(mergedReport), function (err) {
            if (err) throw err;
        });


    } else {
        console.log('File not found');
    }
};
