// Only run if operating on a teamcity server.

TeamCityReporter = {};

TeamCityReporter.isTeamCityAvailable = function() {
    return !!process.env.TEAMCITY_VERSION
}; // method

TeamCityReporter.getMessage = function(prefix, data) {
    var message = '##teamcity['+ prefix;

    for (var key in data) {
        var value = data[key] +'';
        value = value.replace(/'/g, '\\\'');

        message += key + '=\'' + value + '\' ';
    }

    message += ']';
    return message;
}; // method

TeamCityReporter.onChanged = function(testReport) {
    console.log(TeamCityReporter.getMessage('testStarted ', {
        name: testReport.fullName
    }));

    if (testReport.result === 'failed') {
        console.log(TeamCityReporter.getMessage('testFailed', {
            name: testReport.fullName,
            failureMessage: testReport.failureMessage,
            details: testReport.failureStackTrace
        }));
    }

    console.log(TeamCityReporter.getMessage('testFinished', {
        name: testReport.fullName,
        duration: testReport.duration
    }));
}; // method

if (TeamCityReporter.isTeamCityAvailable()) {
    VelocityTestReports
        .find({
            pending: false,
            $or: [
                {result: 'passed'},
                {result: 'failed'}
            ]
        })
        .observe({
            added: TeamCityReporter.onChanged,
            changed: TeamCityReporter.onChanged
        });
} // if
