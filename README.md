[![Build Status](https://travis-ci.org/prime-8-consulting/velocity-teamcity-reporter.svg?branch=master)](https://travis-ci.org/prime-8-consulting/velocity-teamcity-reporter) [![Code Climate](https://codeclimate.com/github/prime-8-consulting/velocity-teamcity-reporter/badges/gpa.svg)](https://codeclimate.com/github/prime-8-consulting/velocity-teamcity-reporter)

Velocity TeamCity Reporter
====
TeamCity reporter for Meteor's [Velocity testing framework](https://velocity.meteor.com). This reporter 
will make your test results available to TeamCity.

## Installation
Install this and at least one Velocity-compatible testing framework then add this package:

`meteor add prime8consulting:velocity-teamcity-reporter`

## Usage
Relax. The plugin will detect if it is being run on a TeamCity server and output test results in TeamCity's format.

Generate notes on testing in CI mode:
Testing a project
`meteor --test`

Testing a package
`velocity test-package <name of or path to package> --velocity` 