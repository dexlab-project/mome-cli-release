#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableProcessErrorListener = void 0;
const config_1 = require("./config");
const program_1 = require("./program");
const chalk_1 = __importDefault(require("chalk"));
const errorHandler = (e) => {
    const message = e['message'];
    const redMessage = message ? chalk_1.default.red(message) : '';
    const logs = e['logs'];
    console.error(`${redMessage}${logs ? '\n' + logs.join('\n') : ''}`);
    return;
};
const unhandledRejectionListener = (reason, promise) => {
    promise.catch((e) => {
        errorHandler(e);
        process.exit(1);
    });
};
const enableProcessErrorListener = () => {
    process.on('unhandledRejection', unhandledRejectionListener);
    process.on('SIGINT', () => {
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        process.exit(0);
    });
};
exports.enableProcessErrorListener = enableProcessErrorListener;
const main = async (args) => {
    (0, exports.enableProcessErrorListener)();
    try {
        const config = new config_1.Config();
        config.load();
        const program = new program_1.Program(config);
        program.run(args);
    }
    catch (err) {
        errorHandler(err);
    }
};
main(process.argv)
    .catch((e) => {
    errorHandler(e);
})
    .finally();
