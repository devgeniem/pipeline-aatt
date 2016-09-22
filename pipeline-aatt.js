var childProcess = require('child_process');
var fs = require('fs');
var phantomjs = require('phantomjs-prebuilt/lib/phantomjs');

var readConfiguration = function(callback){
    fs.readFile('config/test-config.json', 'utf8', function(err, data) {
        if (err) throw err;
        callback(JSON.parse(data));
    });
}
var performTest = function(url, level, standard){
    var phantomJsArguments = [
        '--config=config/phantomjs-config.json', 
        'src/HTMLCS_Run.js',
        url,
        standard, 
        level
    ];

    return new Promise((resolve, reject) => {
        var resultHandler = function(err, stdout, stderr) {
            if(err) throw(err);
            if(stderr) throw(stderr);
            var result = JSON.parse(stdout.replace('done', ''));
            var cleaned = [];
            for(var i in result){
                if(result[i].type){
                    result[i].url = url;
                    cleaned.push(result[i]);
                }
            }
            resolve(cleaned);
        };
        childProcess.execFile(
            phantomjs.path, 
            phantomJsArguments,
            resultHandler
        );
    });
}

var main = function(config){
    console.log("Running accessibility test suite");
    var level = config.strictness > 2 
        ? '1,2,3' 
        : config.strictness == 2
            ? '1,2'
            : '1';
            
    var promises = config.targets.map(url => {return performTest(url, level, config.standard)});
    Promise.all(promises)
        .then(failuresByUrl => {
            var failures = failuresByUrl.reduce(
                (sum, part) => {
                    return sum.concat(part);
                }, []);
            failures.forEach(failure => {
                console.log(["Failed test: ", failure]);
            });
            var passed = failures.length === 0;
            console.log(passed 
                ? "Accessibility tests passed! (Standard: " + config.standard + ", strictness: " + config.strictness + ")"
                : "Accessibility tests FAILED: " + failures.length);
            process.exit(passed ? 0 : 1);
        })
        .catch(error => { 
            console.log("ERROR: " + error);
            process.exit(1);
        });
}

readConfiguration(main);
