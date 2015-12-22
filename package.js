Package.describe({
    name: 'prime8:velocity-teamcity-reporter',
    version: '0.0.2',
    summary: 'A TeamCity reporter for Velocity',
    git: 'https://github.com/prime-8-consulting/velocity-teamcity-reporter',
    documentation: 'README.md',
    debugOnly: true
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');

    api.export(
        'TeamCityReporter',
        'server', // architecture
        { testOnly: true} // exportOptions
    );

    api.use([
        'underscore'
    ], 'server');

    api.addFiles([
        'main.js'
    ], 'server');
});

Package.onTest(function(api) {
    api.use([
        'prime8:velocity-teamcity-reporter',
        'sanjo:jasmine'
    ], 'server');

    api.addFiles('tests.js', 'server');
});