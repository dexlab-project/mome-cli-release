"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const commander_1 = require("commander");
const contant_1 = require("./contant");
const prompt_1 = require("./prompt");
const config_command_1 = require("./command/config.command");
const buy_command_1 = require("./command/buy.command");
const sell_command_1 = require("./command/sell.command");
const trade_options_1 = require("./command/trade.options");
const list_command_1 = require("./command/list.command");
const package_json_1 = __importDefault(require("../package.json"));
const chalk_1 = __importDefault(require("chalk"));
class Program {
    constructor(config) {
        this.config = config;
        this.program = commander_1.program;
        this.subCommands = new Map();
        const buyCommand = new buy_command_1.BuyCommand(this.config);
        const sellCommand = new sell_command_1.SellCommand(this.config);
        const configCommand = new config_command_1.ConfigCommand(this.config);
        const listCommand = new list_command_1.ListCommand(buyCommand);
        this.subCommands.set(configCommand.name, configCommand);
        this.subCommands.set(buyCommand.name, buyCommand);
        this.subCommands.set(sellCommand.name, sellCommand);
        this.subCommands.set(listCommand.name, listCommand);
        commander_1.program
            .helpCommand(true)
            .name(contant_1.PROGRAM_NAME)
            .description(package_json_1.default.description)
            .version(package_json_1.default.version)
            .action(async (...args) => {
            await this.mainAction(...args);
        });
        this.subCommands.forEach((commandAction, name) => {
            commander_1.program.addCommand(commandAction.command());
        });
    }
    run(args) {
        return this.program.parse(args);
    }
    async mainAction(...args) {
        let isRunning = true;
        process.on('SIGINT', () => {
            console.log('\nInterrupt signal received. Exiting...');
            isRunning = false;
        });
        while (isRunning) {
            const command = await (0, prompt_1.promptSelectCommand)([
                contant_1.COMMAND_BUY_NAME,
                contant_1.COMMAND_SELL_NAME,
                contant_1.COMMAND_LIST_NAME,
                chalk_1.default.gray('exit'),
            ]);
            switch (command) {
                case contant_1.COMMAND_BUY_NAME:
                case contant_1.COMMAND_SELL_NAME:
                    await this.subCommands.get(command).action(null, null, (0, trade_options_1.defaultTradeOptionObject)());
                    break;
                case contant_1.COMMAND_LIST_NAME:
                    await this.subCommands.get(command).action((0, trade_options_1.defaultTradeOptionObject)());
                    break;
                case 'exit':
                    isRunning = false;
                    break;
                default:
                    isRunning = false;
                    break;
            }
        }
    }
}
exports.Program = Program;
