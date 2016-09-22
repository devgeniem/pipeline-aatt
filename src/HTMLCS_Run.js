var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

var address  = system.args[1];
var standard = system.args[2];
var errLevel = system.args[3];
var screenshot_url ;

phantom.silent = false;
page.onConsoleMessage = function (msg) {};
page.onError = function (msg) {};

page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
        window.setTimeout(function () {
            page.onConsoleMessage = function (msg) {
                if (msg === 'done') {
                    setTimeout(function(){
                        phantom.exit();
                    }, 0);                           
                }                            
                console.log(msg);
            };

            var injectAllStandards = function(dir) {
                var files = fs.list(dir),
                    filesLen = files.length,
                    absPath = '';
                for (var i = 0; i < filesLen; i++) {
                    if (files[i] === '.' || files[i] === '..') continue;

                    absPath = fs.absolute(dir + '/' + files[i]);
                    if (fs.isDirectory(absPath) === true) {
                        injectAllStandards(absPath);
                    } else if (fs.isFile(absPath) === true) {
                        page.injectJs(absPath);
                    }
                }
            };

            injectAllStandards('./src/htmlcs/Standards');                
            page.injectJs('./src/htmlcs/HTMLCS.js');
            page.injectJs('runner_json.js');

            var data = {
                standard : standard,
                screenshot_url : screenshot_url,
                errLevel:  errLevel
            };
            switch (standard) {
                case 'WCAG2A':
                case 'WCAG2AA':
                case 'WCAG2AAA':
                case 'Section508':                    
                    page.evaluate(function(data) {
                        var screenshot_url = data.screenshot_url;
                        var standard = data.standard;
                        var errLevel = data.errLevel;
                        HTMLCS_RUNNER.run(standard, screenshot_url, errLevel);
                    }, data);
                break;
                default:
                    console.log('Unknown standard.');
                    setTimeout(function(){
                        phantom.exit();
                    }, 0);                
                break;
            }
        }, 200);
    }
});
