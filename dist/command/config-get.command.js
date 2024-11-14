"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigGetCommand = void 0;
const commander_1 = require("commander");
const contant_1 = require("../contant");
class ConfigGetCommand {
    constructor(config) {
        this.config = config;
        this._command = (0, commander_1.createCommand)(this.name)
            .description(contant_1.COMMAND_CONFIG_GET_DESCRIPTION)
            .action((...args) => {
            this.action();
        });
    }
    get name() {
        return contant_1.COMMAND_CONFIG_GET;
    }
    command() {
        return this._command;
    }
    action() {
        this.config.print();
    }
}
exports.ConfigGetCommand = ConfigGetCommand;
