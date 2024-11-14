"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSetCommand = void 0;
const commander_1 = require("commander");
const contant_1 = require("../contant");
class ConfigSetCommand {
    constructor(config) {
        this.config = config;
        this._command = (0, commander_1.createCommand)(this.name)
            .addArgument((0, commander_1.createArgument)('record'))
            .addArgument((0, commander_1.createArgument)('value'))
            .description(contant_1.COMMAND_CONFIG_SET_DESCRIPTION)
            .action((record, value) => {
            this.action(record, value);
        });
    }
    get name() {
        return contant_1.COMMAND_CONFIG_SET;
    }
    command() {
        return this._command;
    }
    action(record, value) {
        this.config.set(record, value);
        this.config.save();
        this.config.print();
    }
}
exports.ConfigSetCommand = ConfigSetCommand;
