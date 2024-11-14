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
exports.Config = void 0;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const just_safe_set_1 = __importDefault(require("just-safe-set"));
const validator_1 = require("./validator");
const contant_1 = require("./contant");
const DEFAULT_CONFIG = {
    walletPath: null,
    rpcUrl: null,
    slippage: contant_1.DEFAULT_SLIPPAGE_BPS,
    waitForConfirmation: true,
};
const defaultConfigPath = path.join(os.homedir(), '.config', 'mome', 'config.json');
class Config {
    constructor() {
        this.userConfig = DEFAULT_CONFIG;
    }
    load() {
        const configPath = (0, util_1.checkFileExists)(defaultConfigPath);
        this.userConfig = configPath ? JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8')) : DEFAULT_CONFIG;
    }
    save() {
        const dir = path.dirname(defaultConfigPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(defaultConfigPath, JSON.stringify(this.userConfig, null, 2));
    }
    set(key, value) {
        switch (key) {
            case 'walletPath':
                if (typeof value !== 'string') {
                    throw new Error('walletPath must be a string');
                }
                if (!(0, validator_1.walletPathValidator)(value)) {
                    throw new Error(`Invalid wallet json path: ${value}`);
                }
                break;
            case 'rpcUrl':
                if (typeof value !== 'string') {
                    throw new Error('rpcUrl must be a string');
                }
                if (!(0, validator_1.rpcUrlValidator)(value)) {
                    throw new Error(`Invalid Solana RPC URL: ${value}`);
                }
                break;
            case 'slippage':
                let slippage;
                try {
                    slippage = parseInt(value);
                }
                catch (e) {
                    throw new Error('slippage must be a number');
                }
                if (slippage < 0 || slippage > 10000) {
                    throw new Error('slippage must be between 0 and 10000');
                }
                break;
            case 'waitForConfirmation':
                if (typeof value !== 'string') {
                    throw new Error('waitForConfirmation must be a boolean');
                }
                try {
                    value = JSON.parse(value);
                }
                catch (e) {
                    throw new Error('waitForConfirmation must be a boolean value (true or false)');
                }
                break;
            default:
                throw new Error(`Invalid key: ${key}`);
        }
        (0, just_safe_set_1.default)(this.userConfig, key, value);
    }
    getConfig() {
        return this.userConfig;
    }
    print() {
        console.log(JSON.stringify(this.userConfig, null, 2));
    }
    isUserConfigValid() {
        const userConfig = this.getConfig();
        if (!userConfig.walletPath || !userConfig.rpcUrl) {
            return false;
        }
        return true;
    }
}
exports.Config = Config;
