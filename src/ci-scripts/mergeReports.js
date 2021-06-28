

const fs  = require('fs');
const { existsSync } = require('fs')

 const mergeReports = ({ setupReport, testReport, writeFilePath = "artifacts/finalReport.json" }) => {
  if (existsSync(setupReport) && existsSync(testReport)) {
    let setupReportData = fs.readFileSync(setupReport, 'utf8');

    let setupReportObj = JSON.parse(setupReportData);

    let testReportData = fs.readFileSync(testReport, 'utf8');
    let testReportObj = JSON.parse(testReportData);

    let mergedReport = {
      ...setupReportObj,
      ...testReportObj,
    };

    fs.writeFile(writeFilePath, JSON.stringify(mergedReport), function (err) {
      if (err) throw err;
    });


  } else {
    console.log('File not found');
  }
}

mergeReports({ setupReport: 'artifacts/setupReport.json', testReport: 'artifacts/report.json' })
