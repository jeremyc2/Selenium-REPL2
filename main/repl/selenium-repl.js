var browser;

const DriverFactory = require('../DriverFactory'),
    selenium = require('selenium-webdriver'),
    path = require('path');

var globalThis[browser] = require(`selenium-webdriver/${browser}`);

function buildDriver() {
    var driver = new DriverFactory(driverOptions).driver;
    var interval = setInterval(() => {
        if(myrepl.context) {
            clearInterval(interval);
            myrepl.context.driver = driver;
        }
    }, 300);
    return driver;
}

function get(url) {
    url = require('../utils/misc').getFullURL(url);

    if(myrepl.context.driver) {
        return myrepl.context.driver.get(url)
            .catch(() => {
                return buildDriver().get(url);
            });
    } else {
        return buildDriver().get(url);
    }
}

function importSelectors() {
    const { $, $$, $x, $$x } = require('../utils/selector')(myrepl.context.driver);
    Object.assign(myrepl.context, {
        $,
        $$,
        $x,
        $$x
    });
}

var driverOptions = new globalThis[browser].Options()
    .addArguments(`load-extension=${path.resolve(__dirname, '../../extension')}`);

var myrepl;

module.exports = (driverPath) => {

    if(driverPath) {
        process.env.DRIVER_PATH = driverPath;
    }

    try {
        buildDriver();
    } catch (e) {
        throw "Error building webdriver";
    }

    myrepl = require('repl').start();

    Object.assign(myrepl.context, {
        ...selenium,
        globalThis[browser],
        buildDriver,
        get,
        importSelectors
    });

}
