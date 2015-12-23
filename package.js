Package.describe({
    name: 'prime8consulting:velocity-teamcity-reporter',
    version: '0.0.6',
    summary: 'A TeamCity reporter for Velocity',
    git: 'https://github.com/prime-8-consulting/velocity-teamcity-reporter',
    documentation: 'README.md',
    debugOnly: true
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.4');
    api.use([
        'underscore',
        'velocity:core@0.10.0'
    ], 'server');
    api.addFiles('main.js', 'server');
	api.export('TeamCityReporter', 'server');
});

Package.onTest(function(api) {
	api.use('prime8consulting:velocity-teamcity-reporter');
	api.use('sanjo:jasmine@0.20.3');
    api.addFiles('tests.js', 'server');
});