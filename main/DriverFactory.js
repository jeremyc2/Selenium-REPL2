var browser;

const { Builder } = require('selenium-webdriver'),
    { Options } = require(`selenium-webdriver/${browser}`),
    path = require('path');

class DriverFactory {
    constructor(driverOptions) {
        require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

        this.driverOptions = driverOptions;
        this.addDriverPath();
        this.disableLogging();
    }

    addDriverPath() {
        const driverPath = process.env.DRIVER_PATH;

        if(driverPath && process.env.PATH.split(path.delimiter).every(x => x != driverPath)) {
            process.env.PATH = driverPath + path.delimiter + process.env.PATH;
        }
    }

    disableLogging() {
        const defaultSwitch = 'enable-logging';
        if(this.driverOptions) {
            const excludeSwitches = this.driverOptions.options_.excludeSwitches;
            if(!excludeSwitches || excludeSwitches.indexOf(defaultSwitch) === -1) {
                this.driverOptions.excludeSwitches(defaultSwitch);
            }
        } else {
            this.driverOptions = new Options();
            this.driverOptions.excludeSwitches(defaultSwitch);
        }
    }

    get driver() {
        return new Builder()
            .forBrowser(driver)
            .withCapabilities(this.driverOptions)
            .build();
    }
}

module.exports = DriverFactory;
