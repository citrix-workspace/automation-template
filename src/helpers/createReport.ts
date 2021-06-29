import fs from 'fs';

interface CreateReport {
    report: Array<Object> | Object;
    pathToFile: string;
}

export const createReport = ({ report, pathToFile }: CreateReport) => {
    fs.readFile(pathToFile, function readFileCallback(err, data: any) {
        if (err) {
            if (err.message.includes('no such file or directory'))
                fs.writeFile(pathToFile, JSON.stringify(report), function (err) {
                    if (err) throw err;
                });
            else throw err;
        } else {
            const reportFile = JSON.parse(data);
            reportFile.push(report);
            fs.writeFile(pathToFile, JSON.stringify(reportFile.flat()), function (err) {
                if (err) throw err;
            });
        }
    });
};
