"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCommand = void 0;
const contant_1 = require("../contant");
const commander_1 = require("commander");
const prompt_1 = require("../prompt");
const mome_sdk_1 = require("@dexlab-project/mome-sdk");
const trade_options_1 = require("./trade.options");
const DEFAULT_PAGE_SIZE = 7;
const optionListSort = (0, commander_1.createOption)(contant_1.OPTION_LIST_SORT, contant_1.OPTION_LIST_SORT_DESCRIPTION);
class ListCommand {
    constructor(buyCommand) {
        this.buyCommand = buyCommand;
        this._command = (0, commander_1.createCommand)(this.name)
            .allowUnknownOption(false)
            .addOption(optionListSort)
            .description(contant_1.COMMAND_LIST_DESCRIPTION)
            .action(async (...args) => {
            await this.action(...args);
        });
        this.momeApi = new mome_sdk_1.MomeApi();
    }
    get name() {
        return contant_1.COMMAND_LIST;
    }
    command() {
        return this._command;
    }
    async action(...args) {
        let isRunning = true;
        while (isRunning) {
            let currentPage = 1;
            const sort = args[0]?.sort || 'createdAt';
            let list = await this.momeApi.listToken(currentPage, DEFAULT_PAGE_SIZE, sort, 'desc');
            let selected = null;
            while (!selected && (!!list?.data && list.data.length > 0)) {
                const response = await (0, prompt_1.promptSelectToken)(list.data);
                if (typeof response === 'string' && response === 'next') {
                    currentPage++;
                    list = await this.momeApi.listToken(currentPage, DEFAULT_PAGE_SIZE, sort, 'desc');
                    continue;
                }
                else if (typeof response === 'string' && response === 'exit') {
                    isRunning = false;
                    break;
                }
                else {
                    selected = response;
                }
                await this.buyCommand.action(selected?.tokenAddress, null, (0, trade_options_1.defaultTradeOptionObject)());
            }
        }
    }
}
exports.ListCommand = ListCommand;
