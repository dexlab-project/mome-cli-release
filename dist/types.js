"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComputeUnitPresetName = exports.ComputeUnitPresetNames = void 0;
exports.ComputeUnitPresetNames = ['default', 'low', 'medium', 'high', 'ultra'];
const isComputeUnitPresetName = (value) => {
    return exports.ComputeUnitPresetNames.includes(value);
};
exports.isComputeUnitPresetName = isComputeUnitPresetName;
