"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradeOptionValidator = exports.isBoolean = exports.parseAmountInput = exports.percentAmountValidator = exports.amountValidator = exports.rpcUrlValidator = exports.walletPathValidator = void 0;
const util_1 = require("./util");
const types_1 = require("./types");
const contant_1 = require("./contant");
const walletPathValidator = (value) => {
    return (0, util_1.checkFileExists)(value);
};
exports.walletPathValidator = walletPathValidator;
const rpcUrlValidator = (value) => {
    return value.startsWith('http');
};
exports.rpcUrlValidator = rpcUrlValidator;
const amountValidator = (value) => {
    const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(parsedValue) || parsedValue <= 0) {
        return 'Please enter a valid positive decimal number';
    }
    return true;
};
exports.amountValidator = amountValidator;
const percentAmountValidator = (value) => {
    let parsedValue;
    if (typeof value === 'string' && value.endsWith('%')) {
        parsedValue = parseFloat(value.slice(0, -1));
        if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
            return 'Please enter a valid percentage between 0 and 100';
        }
    }
    else {
        parsedValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(parsedValue) || parsedValue <= 0) {
            return 'Please enter a valid positive decimal number';
        }
    }
    return true;
};
exports.percentAmountValidator = percentAmountValidator;
const parseAmountInput = (value) => {
    let parsedValue;
    let amountType = 'number';
    if (typeof value === 'string') {
        if (value.endsWith('%')) {
            amountType = 'percent';
            parsedValue = parseFloat(value.slice(0, -1));
        }
        else {
            parsedValue = parseFloat(value);
        }
    }
    else {
        parsedValue = value;
    }
    if (isNaN(parsedValue)) {
        amountType = 'invalid';
    }
    return {
        type: amountType,
        value: parsedValue,
    };
};
exports.parseAmountInput = parseAmountInput;
const isBoolean = (value) => {
    if (value === undefined || value === null) {
        return false;
    }
    const boolString = value.toString().toLowerCase();
    return boolString === 'true' || boolString === 'false';
};
exports.isBoolean = isBoolean;
const tradeOptionValidator = (option) => {
    if (!option) {
        return false;
    }
    if (!option?.slippageBps || option.slippageBps < 0 || option.slippageBps > 10000) {
        return false;
    }
    if (option?.yes === undefined || option?.yes === null || !(0, exports.isBoolean)(option.yes)) {
        return false;
    }
    if (option?.useJitoBoost && isNaN(Number(option.useJitoBoost))) {
        console.warn(`option '${contant_1.OPTION_USE_JITO_BOOST}' lamports must be a number or empty`);
        return false;
    }
    if (option?.useComputeUnit !== undefined && option?.useComputeUnit !== null) {
        if ((0, exports.isBoolean)(option.useComputeUnit)) {
            return true;
        }
        else {
            const isValid = (0, types_1.isComputeUnitPresetName)(option.useComputeUnit);
            if (!isValid) {
                console.warn(`option '${contant_1.OPTION_USE_COMPUTE_UNIT}' preset must be one of '${types_1.ComputeUnitPresetNames.join('\', \'')}'`);
                return false;
            }
            return isValid;
        }
    }
    return true;
};
exports.tradeOptionValidator = tradeOptionValidator;
