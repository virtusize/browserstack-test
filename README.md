## BrowserStack Test

Run your Mocha or Jasmine tests automatically on BrowserStack virtual machines.

## Installation

    $ npm install browserstack-test -g

## Usage

    $ browserstack-test -u <username> -p <password> -k <api-key> -b config.json <url>

The `url` can be either local or remote. The configuration file should be a valid JSON file containing an array of valid BrowserStack browser specifications. Remember to hide your username, password and API key if you run browserstack-test as part of a continuous integration setup.

### Mocha

To run your Mocha tests you'll need to use the [Mocha BrowserStack reporter](https://github.com/bramstein/mocha-browserstack), which will report the test results back to the console. The reporter extends the HTML reporter so you can still keep testing locally.

### Jasmine

To run your Jasmine tests you'll need to use the [Jasmine BrowserStack reporter](https://github.com/bramstein/jasmine-browserstack), which will report the test results back to the console.

## License

BrowserStack Test is licensed under the three clause BSD license. Copyright 2013 Bram Stein, all rights reserved.
