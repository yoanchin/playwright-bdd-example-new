"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOrImportDefaultFunction = exports.requireOrImport = void 0;
/**
 * Universal requireOrImport function that can import any file (js/ts, cjs/esm)
 */
const utils_1 = require("./utils");
const esmLoader_1 = require("./esmLoader");
const paths_1 = require("../utils/paths");
async function requireOrImport(file) {
    await (0, esmLoader_1.installEsmLoaderIfNeeded)();
    const transform = (0, utils_1.requirePlaywrightModule)('lib/transform/transform.js');
    return transform.requireOrImport(file);
}
exports.requireOrImport = requireOrImport;
// eslint-disable-next-line visual/complexity
async function requireOrImportDefaultFunction(file, expectConstructor) {
    let func = await requireOrImport(file);
    if (func && typeof func === 'object' && 'default' in func)
        func = func['default'];
    if (typeof func !== 'function') {
        throw new Error(`${(0, paths_1.relativeToCwd)(file)}: file must export a single ${expectConstructor ? 'class' : 'function'}.`);
    }
    return func;
}
exports.requireOrImportDefaultFunction = requireOrImportDefaultFunction;
//# sourceMappingURL=requireOrImport.js.map