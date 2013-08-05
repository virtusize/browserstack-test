var Runner = require('browserstack-workers'),
    Mocha = require('mocha'),

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

      job.on('end', function (browser, data) {
        var stats = data.stats;

        var fmt = color('bright pass', ' ') + color('green', ' %d passing') + color('light', ' (%sms)');

        console.log(fmt, stats.passes || 0, stats.duration);

        if (stats.failures) {
          failed = true;

          fmt = color('fail', '  %d failing');

          console.error(fmt, stats.failures);

          Mocha.reporters.Base.list(data.failures.map(function (f) {
            return {
              title: f.title,
              fullTitle: function () {
                return f.fullTitle;
              },
              err: f.err
            };
          }));
        }

        console.log();
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
        run: job.run.bind(job)
      });
    }
  });
};

module.exports = BrowserStackTest;
