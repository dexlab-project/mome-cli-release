"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertComputeUnitPresetToValue = exports.formattedPrint = exports.tokenInfoToRecord = exports.truncateString = exports.checkFileExists = void 0;
const fs_1 = __importDefault(require("fs"));
const checkFileExists = (path) => {
    return fs_1.default.existsSync(path);
};
exports.checkFileExists = checkFileExists;
const truncateString = (str, n) => {
    return str.length > n ? str.slice(0, n) + '...' : str;
};
exports.truncateString = truncateString;
const tokenInfoToRecord = (tokenInfo) => {
    return {
        address: tokenInfo.address,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals.toString(),
        description: tokenInfo.description || '',
        image: tokenInfo.image || '',
        tags: tokenInfo.tags ? tokenInfo.tags.join(', ') : undefined,
        extensions: tokenInfo.extensions ? JSON.stringify(tokenInfo.extensions) : undefined,
    };
};
exports.tokenInfoToRecord = tokenInfoToRecord;
const formattedPrint = (entity) => {
    const result = [];
    for (const key in entity) {
        if (entity[key] !== undefined) {
            result.push(formatKeyValue(key, entity[key], 240));
        }
    }
    console.log(result.join('\n'));
};
exports.formattedPrint = formattedPrint;
const formatKeyValue = (key, value, maxWidth) => {
    const truncatedKey = (0, exports.truncateString)(key, 11);
    const paddedKey = truncatedKey.padEnd(11);
    const regex = new RegExp(`.{1,80}`, 'g');
    const lines = (0, exports.truncateString)(value, maxWidth - 3).match(regex)?.join('\n') || '';
    const formattedLines = lines.split('\n').map((line, index) => {
        return index === 0
            ? `${paddedKey}: ${line}`
            : `${' '.repeat(paddedKey.length)}  ${line}`;
    });
    return formattedLines.join('\n');
};
const convertComputeUnitPresetToValue = (preset) => {
    switch (preset) {
        case true:
        case 'default':
            return { computeUnitLimit: 200000, computeUnitPrice: 0 };
        case 'low':
            return { computeUnitLimit: 500000, computeUnitPrice: 1000 };
        case 'medium':
            return { computeUnitLimit: 1000000, computeUnitPrice: 2000 };
        case 'high':
            return { computeUnitLimit: 1500000, computeUnitPrice: 3000 };
        case 'ultra':
            return { computeUnitLimit: 2000000, computeUnitPrice: 4000 };
        default:
            throw new Error(`Invalid compute unit preset name: ${preset}`);
    }
};
exports.convertComputeUnitPresetToValue = convertComputeUnitPresetToValue;
