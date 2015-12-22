Package.describe({
    name: 'prime8:velocity-teamcity-reporter',
    version: '0.0.1',
    summary: 'A TeamCity reporter for Velocity',
    git: 'https://github.com/prime8/velocity-teamcity-reporter.git',
    documentation: 'README.md',
    debugOnly: true
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');

    api.use([
        'underscore',
        'velocity:core@0.7.0',
        'velocity:shim@0.1.0'
    ], 'server');

    api.addFiles([
        'main.js'
    ], 'server');

    api.export('TeamCityReporter');
});

Package.onTest(function(api) {
    api.use([
        'prime8:velocity-teamcity-reporter',
        'sanjo:jasmine',
        'velocity:console-reporter'
    ], 'server');

    api.addFiles('tests.js', 'server');
});