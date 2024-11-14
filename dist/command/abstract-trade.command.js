"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTradeCommand = void 0;
const mome_sdk_1 = require("@dexlab-project/mome-sdk");
const util_1 = require("../util");
const validator_1 = require("../validator");
const cli_spinner_1 = require("cli-spinner");
const prompt_1 = require("../prompt");
const chalk_1 = __importDefault(require("chalk"));
const contant_1 = require("../contant");
class AbstractTradeCommand {
    constructor(config) {
        this.config = config;
    }
    buildTransaction(builder, option) {
        let txBuilder = builder;
        if (option?.useJitoBoost) {
            if ((0, validator_1.isBoolean)(option.useJitoBoost)) {
                txBuilder = txBuilder.setBundle({
                    lamports: contant_1.DEFAULT_USE_JITO_BOOST,
                });
            }
            else {
                txBuilder = txBuilder.setBundle({
                    lamports: option.useJitoBoost,
                });
            }
        }
        if (option?.useComputeUnit !== undefined && option?.useComputeUnit !== null) {
            const computeUnit = (0, util_1.convertComputeUnitPresetToValue)((0, validator_1.isBoolean)(option.useComputeUnit) ? 'default' : option.useComputeUnit);
            txBuilder = txBuilder.setComputeUnit(computeUnit);
        }
        return txBuilder;
    }
    async finalizeTransaction(mome, tx) {
        const userConfig = this.config.getConfig();
        if (userConfig.waitForConfirmation ?? true) {
            const spinner = new cli_spinner_1.Spinner(`%s Waiting for confirmation ${tx.signature}`);
            spinner.setSpinnerString(29);
            spinner.setSpinnerDelay(80);
            spinner.start();
            await mome.waitForConfirmation(tx.signature, tx.transactionBlockhash);
            spinner.stop();
            console.log(`\nTransaction confirmed!`);
        }
        else {
            console.log(`Transaction send signature: ${tx.signature}`);
        }
    }
    async requireTradeInputs(mome, tradeType, option, tokenAddressArg, amountArg) {
        let tokenAddress;
        if (tokenAddressArg) {
            tokenAddress = tokenAddressArg;
        }
        else {
            tokenAddress = await (0, prompt_1.promptInputTokenAddress)();
        }
        let token;
        try {
            token = mome.getToken(tokenAddress);
        }
        catch (e) {
            throw new Error(`Invalid token address ${tokenAddress}`);
        }
        const tokenInfo = await token.getInfo();
        const balance = tradeType === 'buy' ? await mome.getLamports() : await mome.getTokenBalance(tokenAddress);
        let userInputAmount;
        const validator = tradeType === 'buy' ? validator_1.amountValidator : validator_1.percentAmountValidator;
        if (amountArg) {
            const validated = validator(amountArg);
            if (validated === true) {
                userInputAmount = (0, validator_1.parseAmountInput)(amountArg);
            }
            else {
                const extraMessage = chalk_1.default.red(`You entered an invalid amount (${amountArg}).\n`);
                userInputAmount = await (0, prompt_1.promptInputAmount)(tradeType, tokenInfo, balance, extraMessage);
            }
        }
        else {
            userInputAmount = await (0, prompt_1.promptInputAmount)(tradeType, tokenInfo, balance);
        }
        const amount = userInputAmount.type === 'percent'
            ? (0, mome_sdk_1.toUiVolume)((balance * BigInt(Math.floor(userInputAmount.value * 100)) / 100n) / 100n, tokenInfo.decimals).toNumber()
            : userInputAmount.value;
        if (!option.yes) {
            const confirm = await (0, prompt_1.promptConfirm)({
                tokenAddress,
                symbol: tokenInfo.symbol,
                action: tradeType,
                amount: amount,
                slippageBps: option.slippageBps ?? contant_1.DEFAULT_SLIPPAGE_BPS,
                useJitoBoost: option.useJitoBoost,
                useComputeUnit: option.useComputeUnit,
            });
            if (!confirm) {
                return;
            }
        }
        return {
            tokenAddress,
            amount: amount,
            slippageBps: option.slippageBps ?? contant_1.DEFAULT_SLIPPAGE_BPS,
        };
    }
}
exports.AbstractTradeCommand = AbstractTradeCommand;
