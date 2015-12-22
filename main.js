TeamCityReporter = {};

TeamCityReporter.isTeamCityAvailable = function() {
    return process.env.hasOwnProperty('TEAMCITY_VERSION')
        && !!process.env['TEAMCITY_VERSION']
    ;

}; // method

TeamCityReporter.getMessage = function(prefix, data) {
    // check inputs.
    if (!prefix || !data || !_.isString(prefix) || !_.isObject(data)) {
        return;
    }

    var message = '##teamcity['+ prefix;

    for (var key in data) {
        var value = data[key] +'';

        // escape single quotes.
        value = value.replace(/'/g, '\\\'');

        message += ' '+ key + '=\'' + value + '\'';
    } // for

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

TeamCityReporter.startListening = function() {
// Only run if operating on a teamcity server.
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
};

