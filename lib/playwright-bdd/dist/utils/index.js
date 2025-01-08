"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanDefault = exports.trimTrailingSlash = exports.toArray = exports.omit = exports.stringifyLocation = exports.callWithTimeout = exports.getPackageVersion = exports.resolvePackageRoot = exports.removeDuplicates = exports.extractTemplateParams = exports.template = exports.getSymbolByName = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:timers/promises"));
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
exports.getSymbolByName = getSymbolByName;
/**
 * Inserts params into template.
 * Params defined as <param>.
 */
function template(t, params = {}) {
    return t.replace(/<(.+?)>/g, (match, key) => {
        return params[key] !== undefined ? String(params[key]) : match;
    });
}
exports.template = template;
/**
 * Extracts all template params from string.
 * Params defined as <param>.
 */
function extractTemplateParams(t) {
    return [...t.matchAll(/<(.+?)>/g)].map((m) => m[1]);
}
exports.extractTemplateParams = extractTemplateParams;
function removeDuplicates(arr) {
    return [...new Set(arr)];
}
exports.removeDuplicates = removeDuplicates;
function resolvePackageRoot(packageName) {
    try {
        const packageJsonPath = require.resolve(`${packageName}/package.json`);
        return node_path_1.default.dirname(packageJsonPath);
    }
    catch {
        throw new Error(`Package "${packageName}" is not installed.`);
    }
}
exports.resolvePackageRoot = resolvePackageRoot;
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
exports.getPackageVersion = getPackageVersion;
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
exports.callWithTimeout = callWithTimeout;
function stringifyLocation({ line, column }) {
    return `${line}:${column}`;
}
exports.stringifyLocation = stringifyLocation;
function omit(obj, key) {
    const res = { ...obj };
    delete res[key];
    return res;
}
exports.omit = omit;
function toArray(value) {
    return Array.isArray(value) ? value : [value];
}
exports.toArray = toArray;
function trimTrailingSlash(s) {
    return s.replace(/[/\\]+$/, '');
}
exports.trimTrailingSlash = trimTrailingSlash;
function booleanDefault(value, defaultValue) {
    return typeof value === 'boolean' ? value : defaultValue;
}
exports.booleanDefault = booleanDefault;
//# sourceMappingURL=index.js.map