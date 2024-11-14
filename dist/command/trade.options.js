"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTradeOptionObject = exports.tradeOptions = void 0;
const commander_1 = require("commander");
const contant_1 = require("../contant");
const optionSlippage = (0, commander_1.createOption)(contant_1.OPTION_SLIPPAGE_BPS, contant_1.OPTION_SLIPPAGE_BPS_DESCRIPTION).default(contant_1.DEFAULT_SLIPPAGE_BPS);
const optionYes = (0, commander_1.createOption)(contant_1.OPTION_YES, contant_1.OPTION_YES_DESCRIPTION).default(false);
const optionUseJitoBoost = (0, commander_1.createOption)(contant_1.OPTION_USE_JITO_BOOST, contant_1.OPTION_USE_JITO_BOOST_DESCRIPTION);
const optionUseComputeUnit = (0, commander_1.createOption)(contant_1.OPTION_USE_COMPUTE_UNIT, contant_1.OPTION_USE_COMPUTE_UNIT_DESCRIPTION);
exports.tradeOptions = [
    optionSlippage,
    optionYes,
    optionUseJitoBoost,
    optionUseComputeUnit,
];
const defaultTradeOptionObject = () => {
    return exports.tradeOptions.reduce((acc, option) => {
        const defaultValue = option.defaultValue;
        if (defaultValue !== undefined) {
            acc[option.attributeName()] = option.defaultValue;
        }
        return acc;
    }, {});
};
exports.defaultTradeOptionObject = defaultTradeOptionObject;
