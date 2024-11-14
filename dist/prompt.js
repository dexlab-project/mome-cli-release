"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptSelectCommand = promptSelectCommand;
exports.promptSelectToken = promptSelectToken;
exports.promptInputAmount = promptInputAmount;
exports.promptInputTokenAddress = promptInputTokenAddress;
exports.promptConfirm = promptConfirm;
exports.promptWalletPath = promptWalletPath;
exports.promptRpcUrl = promptRpcUrl;
const prompts_1 = require("@inquirer/prompts");
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const validator_1 = require("./validator");
const mome_sdk_1 = require("@dexlab-project/mome-sdk");
const chalk_1 = __importDefault(require("chalk"));
async function promptSelectCommand(menu) {
    return (0, prompts_1.select)({
        message: 'Choose a command:',
        choices: menu,
    });
}
async function promptSelectToken(tokens) {
    const maxSymbolLength = Math.min(Math.max(...tokens.map(token => token.symbol.length)), 10);
    const tokenChoices = tokens.map((token) => {
        let active = false;
        let tokenStatusText = '';
        if (token.poolStatus === 'initialized') {
            active = true;
            tokenStatusText = '🟢Active';
        }
        else {
            tokenStatusText = '🚀Migrated';
        }
        const symbol = token.symbol.padEnd(maxSymbolLength);
        const createdAt = new Date(token.createdAt).toISOString()
            .replace('T', ' ')
            .replace(/\..+/, '');
        const row = `${active ? chalk_1.default.green(symbol) : chalk_1.default.gray(symbol)} ${token.tokenAddress} ${createdAt} ${tokenStatusText}`;
        return {
            name: active ? row : chalk_1.default.gray(row),
            value: token,
            disabled: !active,
        };
    });
    const choices = [
        ...tokenChoices,
        {
            name: chalk_1.default.blue('Next >>'),
            value: 'next',
        },
    ];
    return (0, prompts_1.select)({
        message: 'Choose a token to trade:',
        loop: false,
        pageSize: choices.length,
        choices: [...choices],
        theme: {
            style: {
                disabled: (text) => {
                    return `  ${text.replace('(disabled)', '')}`;
                },
            },
        },
    });
}
async function promptInputAmount(action, token, balance, extraMessage) {
    let userInput = null;
    const actionText = action === 'buy' ? chalk_1.default.green('BUY') : chalk_1.default.red('SELL');
    const unit = action === 'buy' ? chalk_1.default.green('SOL') : chalk_1.default.red(token.symbol);
    const uiBalance = action === 'buy' ? chalk_1.default.green((0, mome_sdk_1.lamportsToSol)(balance)) : chalk_1.default.red((0, mome_sdk_1.toUiVolume)(balance, token.decimals));
    console.log(`Do you want to ${actionText} this token?`);
    (0, util_1.formattedPrint)({
        ...(0, util_1.tokenInfoToRecord)(token),
        tags: undefined,
        extensions: undefined,
    });
    while (!userInput) {
        const promptInput = await (0, prompts_1.input)({
            message: `${extraMessage || ''}Input ${unit} amount to ${actionText} (Your balance ${uiBalance} ${unit}):`,
            validate: action === 'buy' ? validator_1.amountValidator : validator_1.percentAmountValidator,
        });
        if (promptInput) {
            userInput = promptInput;
        }
    }
    return (0, validator_1.parseAmountInput)(userInput);
}
async function promptInputTokenAddress() {
    return (0, prompts_1.input)({
        message: 'Input Token Address: ',
    });
}
async function promptConfirm(trade) {
    const actionText = trade.action === 'buy' ? chalk_1.default.green('BUY') : chalk_1.default.red('SELL');
    const unit = trade.action === 'buy' ? chalk_1.default.green('SOL') : chalk_1.default.red(trade.symbol);
    const jitoBoostPrint = trade.useJitoBoost ? `, Jito Boost: ${trade.useJitoBoost}` : '';
    const computeUnitPrint = trade.useComputeUnit ? `, Compute Unit: ${trade.useComputeUnit}` : '';
    (0, util_1.formattedPrint)({
        'Token': `${trade.symbol} (${trade.tokenAddress})`,
        'Request': `${actionText} ${trade.amount} ${unit}\n(slippage: ${trade.slippageBps / 100}%${jitoBoostPrint}${computeUnitPrint})`,
    });
    return (0, prompts_1.confirm)({
        message: 'Do you want to proceed with this trade? ',
        default: true,
    });
}
async function promptWalletPath() {
    return (0, prompts_1.input)({
        message: 'Enter wallet path: ',
        default: `${path.join(os.homedir(), '.config', 'solana', 'id.json')}`,
        validate: validator_1.walletPathValidator,
    });
}
async function promptRpcUrl() {
    return (0, prompts_1.input)({
        message: 'Enter RPC URL: ',
    });
}
