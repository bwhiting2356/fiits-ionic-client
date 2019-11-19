// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const baseConfig = require('./protractor.conf');

exports.config = {
  ...baseConfig.config,
  capabilities: {
    chromeOptions: {
      args: [ "--headless" ]
    },
    'browserName': 'chrome'
  },
};
