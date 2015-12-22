describe('TeamCityReporter', function() {
    it('isTeamCityAvailable returns true.', function() {
        process.env.TEAMCITY_VERSION = 'hello';
        expect(TeamCityReporter.isTeamCityAvailable()).toBeTruthy();
    });

    it('isTeamCityAvailable returns false.', function() {
        process.env.TEAMCITY_VERSION = null;
        expect(TeamCityReporter.isTeamCityAvailable()).toBeFalsy();
    });


});
