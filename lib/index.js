var Runner = require('browserstack-workers'),
    Mocha = require('mocha'),
    TapConsumer = require('tap').Consumer,

    cursor = Mocha.reporters.Base.cursor,
    color = Mocha.reporters.Base.color;

function BrowserStackTest(username, password, key) {
  this.client = new Runner(username, password, key);
}

BrowserStackTest.prototype.createTest = function (url, options, callback) {
  this.client.createJob(url, options, function (err, job) {
    if (err) {
      callback(err, null);
    } else {
      var failed = false;

      job.on('error', function (browser) {
        var fmt = color('fail', '  %d error');
        console.error(fmt, browser);
        failed = true;
      });

      job.on('end', function (browser, req, res) {
        var consumer = new TapConsumer(),
            failure = [],
            tests = [],
            success = [],
            comments = [],
            current = null;

        consumer.on('data', function (data) {
          if (data) {
            if (data.hasOwnProperty('ok')) {
              data.comments = comments;
              comments = [];
              current = data;
              if (data.ok === true) {
                success.push(data);
              } else {
                failure.push(data);
              }
              tests.push(data);
            } else if (typeof data === 'string') {
              comments.push(data);
            }
          }
        });

        consumer.on('end', function () {
          if (current) {
            current.comments = comments;
          }
          console.log(color('bright pass', ' ') + color('green', '%d passing'), tests.length - failure.length);

          if (failure.length) {
            failed = true;

            console.log(color('fail', '  %d failing'), failure.length);

            Mocha.reporters.Base.list(failure.map(function (f) {
              return {
                title: f.name,
                fullTitle: function () {
                  return f.name;
                },
                err: {
                  message: f.comments.join('\n')
                }
              };
            }));
          }

          console.log();
          res.send();
        });

        req.pipe(consumer);
      });

      job.on('complete', function () {
        process.on('exit', function () {
          if (failed) {
            process.exit(1);
          } else {
            process.exit(0);
          }
        });
      });

      callback(err, {
        addBrowser: job.addBrowser.bind(job),
        run: job.run.bind(job),
        job: job
      });
    }
  });
};

module.exports = BrowserStackTest;
