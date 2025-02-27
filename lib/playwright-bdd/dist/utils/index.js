"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbolByName = getSymbolByName;
exports.removeDuplicates = removeDuplicates;
exports.resolvePackageRoot = resolvePackageRoot;
exports.getPackageVersion = getPackageVersion;
exports.callWithTimeout = callWithTimeout;
exports.stringifyLocation = stringifyLocation;
exports.omit = omit;
exports.removeUndefined = removeUndefined;
exports.toArray = toArray;
exports.trimTrailingSlash = trimTrailingSlash;
exports.booleanDefault = booleanDefault;
exports.calculateSha1 = calculateSha1;
exports.throwIf = throwIf;
exports.saveFileSync = saveFileSync;
exports.toBoolean = toBoolean;
exports.areSetsEqual = areSetsEqual;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:timers/promises"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Returns Symbol by name.
 * See: https://stackoverflow.com/questions/50453640/how-can-i-get-the-value-of-a-symbol-property
 */
function getSymbolByName(target, name) {
    const ownKeys = Reflect.ownKeys(target);
    const symbol = ownKeys.find((key) => key.toString() === `Symbol(${name})`);
    if (!symbol) {
        throw new Error(`Symbol "${name}" not found in target. ownKeys: ${ownKeys}`);
    }
    return symbol;
}
function removeDuplicates(arr) {
    return [...new Set(arr)];
}
function resolvePackageRoot(packageName) {
    try {
        const packageJsonPath = require.resolve(`${packageName}/package.json`);
        return node_path_1.default.dirname(packageJsonPath);
    }
    catch {
        throw new Error(`Package "${packageName}" is not installed.`);
    }
}
function getPackageVersion(packageName) {
    try {
        const packageRoot = resolvePackageRoot(packageName);
        const packageJsonPath = node_path_1.default.join(packageRoot, 'package.json');
        const packageJson = JSON.parse(node_fs_1.default.readFileSync(packageJsonPath, 'utf8'));
        return (packageJson.version || '');
    }
    catch {
        return '';
    }
}
async function callWithTimeout(fn, timeout, timeoutMsg) {
    if (!timeout)
        return fn();
    const ac = new AbortController();
    return Promise.race([
        fn(),
        promises_1.default.setTimeout(timeout, null, { ref: false, signal: ac.signal }).then(() => {
            throw new Error(timeoutMsg || `Function timeout (${timeout} ms)`);
        }),
    ]).finally(() => ac.abort());
}
function stringifyLocation({ line, column }) {
    return `${line}:${column || 0}`;
}
function omit(obj, key) {
    const res = { ...obj };
    delete res[key];
    return res;
}
function removeUndefined(obj) {
    if (!obj)
        return obj;
    const res = {};
    const keys = Object.keys(obj);
    keys.forEach((key) => {
        if (obj[key] !== undefined)
            res[key] = obj[key];
    });
    return res;
}
function toArray(value) {
    return Array.isArray(value) ? value : [value];
}
function trimTrailingSlash(s) {
    return s.replace(/[/\\]+$/, '');
}
function booleanDefault(value, defaultValue) {
    return typeof value === 'boolean' ? value : defaultValue;
}
// See: https://github.com/microsoft/playwright/blob/6f16b6cc08f7d59a079d9afa67afacc321a37675/packages/playwright-core/src/utils/crypto.ts#L24
function calculateSha1(buffer) {
    const hash = crypto_1.default.createHash('sha1');
    const data = typeof buffer === 'string' ? buffer : new Uint8Array(buffer);
    hash.update(data);
    return hash.digest('hex');
}
function throwIf(condition, message) {
    if (condition)
        throw new Error(message);
}
/**
 * Save file synchronously, create directory if needed.
 */
function saveFileSync(filePath, content) {
    node_fs_1.default.mkdirSync(node_path_1.default.dirname(filePath), { recursive: true });
    node_fs_1.default.writeFileSync(filePath, content);
}
function toBoolean(value) {
    return Boolean(value);
}
function areSetsEqual(set1, set2) {
    return set1.size === set2.size && [...set1].every((val) => set2.has(val));
}
//# sourceMappingURL=index.js.map