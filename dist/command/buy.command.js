"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyCommand = void 0;
const contant_1 = require("../contant");
const commander_1 = require("commander");
const validator_1 = require("../validator");
const mome_sdk_1 = require("@dexlab-project/mome-sdk");
const abstract_trade_command_1 = require("./abstract-trade.command");
const trade_options_1 = require("./trade.options");
class BuyCommand extends abstract_trade_command_1.AbstractTradeCommand {
    constructor(config) {
        super(config);
        this._command = (0, commander_1.createCommand)(this.name)
            .helpCommand(true)
            .description(contant_1.COMMAND_BUY_DESCRIPTION)
            .addArgument((0, commander_1.createArgument)('tokenAddress').argOptional())
            .addArgument((0, commander_1.createArgument)('amount').argOptional())
            .action(async (...args) => {
            const [tokenAddressArg, amountArg, option, command] = args;
            await this.action(tokenAddressArg, amountArg, option);
        })
            .hook('preAction', async () => {
            if (!this.config.isUserConfigValid()) {
                console.error('Please set `walletPath` and `rpcUrl`. You can set them by using `config set` command');
                process.exit(1);
            }
        });
        trade_options_1.tradeOptions.forEach((option) => {
            this._command.addOption(option);
        });
    }
    get name() {
        return contant_1.COMMAND_BUY;
    }
    command() {
        return this._command;
    }
    async action(tokenAddressArg, amountArg, option) {
        if (!(0, validator_1.tradeOptionValidator)(option)) {
            throw new Error('Invalid trade option');
        }
        const userConfig = this.config.getConfig();
        const mome = mome_sdk_1.MomeSDK.init(userConfig.rpcUrl, userConfig.walletPath);
        const inputs = await this.requireTradeInputs(mome, 'buy', option, tokenAddressArg, amountArg);
        if (!inputs) {
            throw new Error('Trade canceled');
        }
        const token = mome.getToken(inputs.tokenAddress);
        const tokenInfo = await token.getInfo();
        if (tokenInfo.status !== 'initialized') {
            throw new Error(`The token has ${tokenInfo.symbol} left the launchpad.\n` +
                `You can continue trading on the MOME web.\n` +
                `Continue at ${contant_1.MOME_TOKEN_URI}/${tokenInfo.address}`);
        }
        const solBalance = await mome.getLamports();
        const tradeLamports = (0, mome_sdk_1.solToLamports)(inputs.amount);
        if (tradeLamports <= 0n || solBalance < tradeLamports) {
            throw new Error(`Invalid trade amount. Your balance is ${(0, mome_sdk_1.lamportsToSol)(solBalance)} SOL`);
        }
        const buyTrade = this.buildTransaction(mome.getToken(inputs.tokenAddress)
            .beginTrade()
            .buy({
            amount: tradeLamports,
            slippageBps: inputs.slippageBps,
        }), option);
        const tx = await buyTrade.transaction().send();
        await this.finalizeTransaction(mome, tx);
    }
}
exports.BuyCommand = BuyCommand;
