#!/bin/bash

# serverVersionAfterTest=$("\$(curl -k -s https:///hotsvcnv6xdz.us.iws.cloud.com/status/up | jq -r '.version')")
export serverVersionrTest=$(curl -k -s https:///hotsvcnv6xdz.us.iws.cloud.com/status/up | jq -r '.version')
echo $serverVersionrTest
# now=$(date +'%m/%d/%Y')
# echo "$now"


# cat artifacts/report.json | jq  -r --arg serverVersionrTest "$serverVersionrTest" \
#     '{
#     "buildID" :"buildID",
#     "startTime":"",
#     "customerIDCC":"hotsvcnv6xdz",
#     "versionMAServer":$serverVersionrTest,
#     "integrationName":"repoName",
#     "passed":.numPassedTests,
#     "failed":.numFailedTests,
#     "skipped":.numPendingTests,
#     "total":.numTotalTests,
#     "endTime":"2020-08-27T12:07:45.120Z",
#     "jobName":"workflow->",
#     }' > artifacts/report_power_bi.json
# cat artifacts/report_power_bi.json    



                  export runNumber="runNumber"
                  export workflowName=echo"ahoj"
                  export repositoryName="repositoryName"
                  export endDate="date"
                  cat artifacts/report.json | jq  -r --arg buildID "$runNumber", --arg jobName "$workflowName", --arg integrationName "$repositoryName", --arg endTime "$endDate", --arg serverVersionrTest "$serverVersionrTest", \
                      '{
                      "buildID" :$buildID,
                      "startTime":"",
                      "customerIDCC":"hotsvcnv6xdz",
                      "versionMAServer":$serverVersionrTest,
                      "integrationName":$integrationName,
                      "passed":.numPassedTests,
                      "failed":.numFailedTests,
                      "skipped":.numPendingTests,
                      "total":.numTotalTests,
                      "endTime":$endTime,
                      "jobName":$jobName,
                      }' > artifacts/report_power_bi.json
                    cat artifacts/report_power_bi.json
#