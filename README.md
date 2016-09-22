# Pipeline Accessibility Tester
[![License](https://img.shields.io/:license-bsd-blue.svg?style=flat-square)](https://github.com/devgeniem/pipeline-aatt/blob/master/LICENSE.md)
This is a work in progress tool to run accessibility tests in CI against different standards. The project is derived from [AATT](https://github.com/paypal/AATT/) 
and uses [HTML_CodeSniffer](https://github.com/squizlabs/HTML_CodeSniffer/) for the tests.

##Dependencies
- node (developed on 4.2.3)
- phantomjs module

## Installing
```
npm install
```

## Configuration
Configuring the tests is done with the following JSON file:
```
config/test-config.json
```
The JSON must contain these fields:
```
standard
```
This is the web accessibility standard that the target page should conform to. Options are: "WCAG2A", "WCAG2AA", "WCAG2AAA" and "Section508".
See more at: [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG20/) and [Section508](https://www.section508.gov/summary-section508-standards).
```
strictness
```
Defines how lenient the tests are in respect to the standard being tested. Meaningful values are 1 to 3. 1 fails to errors, 2 to warnings and 3 to notices.
```
targets
```
This is an array of URLs to run the tests against.

## Running
```
node pipeline-aatt
```
Exit code is 0 for passed tests, 1 for failed.
