"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
const contant_1 = require("../contant");
const commander_1 = require("commander");
const prompt_1 = require("../prompt");
const config_get_command_1 = require("./config-get.command");
const config_set_command_1 = require("./config-set.command");
class ConfigCommand {
    constructor(config) {
        this.config = config;
        this.subCommands = new Map();
        const getCommand = new config_get_command_1.ConfigGetCommand(config);
        const setCommand = new config_set_command_1.ConfigSetCommand(config);
        this.subCommands.set(getCommand.name, getCommand);
        this.subCommands.set(setCommand.name, setCommand);
        this._command = (0, commander_1.createCommand)(this.name)
            .allowUnknownOption(false)
            .description(contant_1.COMMAND_CONFIG_DESCRIPTION)
            .action(async (...args) => {
            await this.action(...args);
        });
        this.subCommands.forEach((subCommand) => {
            this._command.addCommand(subCommand.command());
        });
    }
    get name() {
        return contant_1.COMMAND_CONFIG;
    }
    command() {
        return this._command;
    }
    async action(...args) {
        await this.requireUserConfig();
        this.subCommands.get(contant_1.COMMAND_CONFIG_GET).action();
    }
    async requireUserConfig() {
        const userConfig = this.config.getConfig();
        const setCommand = this.subCommands.get(contant_1.COMMAND_CONFIG_SET);
        if (!userConfig.walletPath) {
            const walletPath = await (0, prompt_1.promptWalletPath)();
            setCommand.action('walletPath', walletPath);
        }
        if (!userConfig.rpcUrl) {
            const rpcUrl = await (0, prompt_1.promptRpcUrl)();
            setCommand.action('rpcUrl', rpcUrl);
        }
    }
}
exports.ConfigCommand = ConfigCommand;
