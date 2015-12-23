var TeamCityReporter = Package['prime8consulting:velocity-teamcity-reporter']['TeamCityReporter'];

var SanjoJasmine = Package['sanjo:jasmine']['Jasmine'];
SanjoJasmine.onTest(function() {
	describe('TeamCityReporter', function() {
		describe('isTeamCityAvailable', function() {
			it('returns false when env variable not set.', function() {
				delete process.env['TEAMCITY_VERSION'];
				expect(TeamCityReporter.isTeamCityAvailable()).toBeFalsy();
			});

			it('returns false when env variable is set and value is falsey.', function() {
				process.env.TEAMCITY_VERSION = '';
				expect(TeamCityReporter.isTeamCityAvailable()).toBeFalsy();
			});

			it('returns true when env variable is set and value is truthy.', function() {
				process.env.TEAMCITY_VERSION = 'hello';
				expect(TeamCityReporter.isTeamCityAvailable()).toBeTruthy();
			});
		});

		describe('getMessage', function() {
			it('Returns undefined when either parameters is invalid.', function() {
				expect(TeamCityReporter.getMessage(null, null)).toBeUndefined();
				expect(TeamCityReporter.getMessage('PREFIX', null)).toBeUndefined();
				expect(TeamCityReporter.getMessage(null, {})).toBeUndefined();
			});

			it('Returns properly formatted string based on parameters and 1 attribute.', function() {
				var str = TeamCityReporter.getMessage('PREFIX', {
					key1: 'value1'
				});

				expect(str).toBe('##teamcity[PREFIX key1=\'value1\']');
			})

			it('Returns properly formatted string based on parameters and 3 attributes.', function() {
				var str = TeamCityReporter.getMessage('PREFIX', {
					key1: 'value1',
					key2: 'value2',
					key3: 'value3'
				});

				expect(str).toBe('##teamcity[PREFIX key1=\'value1\' key2=\'value2\' key3=\'value3\']');
			})

			it('Data with values containing single quotes are properly escaped.', function() {
				var str = TeamCityReporter.getMessage('PREFIX', {
					key1: 'String with \' in it.'
				});

				expect(str).toBe('##teamcity[PREFIX key1=\'String with \\\' in it.\']');
			});
		});

		describe('onChanged', function() {
			it('Failing test outputs 3 console prompts.', function() {
				// init
				spyOn(console, 'log').and.callThrough();
				spyOn(TeamCityReporter, 'getMessage').and.callThrough();

				// run
				TeamCityReporter.onChanged({
					fullName: 'MY TEST',
					failureMessage: 'FAILURE MESSAGE',
					failureStackTrace: 'FAILURE STACKTRACE',
					duration: 123,
					result: 'failed'
				});

				// verify
				expect(TeamCityReporter.getMessage.calls.allArgs()).toEqual([
						[ 'testStarted ', { name: 'MY TEST' } ],
						[ 'testFailed', {
							name: 'MY TEST',
							failureMessage: 'FAILURE MESSAGE',
							details: 'FAILURE STACKTRACE'
						}],
						[ 'testFinished', { name: 'MY TEST', duration: 123 } ]
				]);
				expect(console.log.calls.allArgs()).toEqual([
					[ '##teamcity[testStarted  name=\'MY TEST\']' ],
					[ '##teamcity[testFailed name=\'MY TEST\' failureMessage=\'FAILURE MESSAGE\' details=\'FAILURE STACKTRACE\']' ],
					[ '##teamcity[testFinished name=\'MY TEST\' duration=\'123\']' ]
				]);
			});

			it('Working test outputs 2 console prompts.', function() {
				// init
				spyOn(console, 'log').and.callThrough();
				spyOn(TeamCityReporter, 'getMessage').and.callThrough();

				// run
				TeamCityReporter.onChanged({
					fullName: 'MY TEST',
					failureMessage: 'FAILURE MESSAGE',
					failureStackTrace: 'FAILURE STACKTRACE',
					duration: 123,
					result: 'passed'
				});

				// verify
				expect(TeamCityReporter.getMessage.calls.allArgs()).toEqual([
					[ 'testStarted ', { name: 'MY TEST' } ],
					[ 'testFinished', { name: 'MY TEST', duration: 123 } ]
				]);
				expect(console.log.calls.allArgs()).toEqual([
					[ '##teamcity[testStarted  name=\'MY TEST\']' ],
					[ '##teamcity[testFinished name=\'MY TEST\' duration=\'123\']' ]
				]);
			});
		});

		describe('startListening', function() {
			it('Listeners not attached when TeamCity is not available.', function() {
				// init
				spyOn(TeamCityReporter, 'isTeamCityAvailable').and.returnValue(false);
				spyOn(VelocityTestReports, 'find').and.callThrough();

				// run
				TeamCityReporter.startListening();

				// verify
				expect(VelocityTestReports.find).not.toHaveBeenCalled();
			});

			it('Listeners attached when TeamCity is available.', function() {
				// init
				spyOn(TeamCityReporter, 'isTeamCityAvailable').and.returnValue(true);
				spyOn(VelocityTestReports, 'find').and.callThrough();

				// run
				TeamCityReporter.startListening();

				// verify
				expect(VelocityTestReports.find).toHaveBeenCalled();
			});

			it('Listeners are setup properly.', function() {
				// init
				var cursor = {
					observe: jasmine.createSpy('observe')
				};
				spyOn(TeamCityReporter, 'isTeamCityAvailable').and.returnValue(true);
				spyOn(VelocityTestReports, 'find').and.returnValue(cursor);

				// run
				TeamCityReporter.startListening();

				// verify
				expect(VelocityTestReports.find).toHaveBeenCalledWith({
					pending: false,
					$or: [
						{result: 'passed'},
						{result: 'failed'}
					]
				});
				expect(cursor.observe).toHaveBeenCalledWith({
					added: TeamCityReporter.onChanged,
					changed: TeamCityReporter.onChanged
				});
			});
		});
	});	
});
