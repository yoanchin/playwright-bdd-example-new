"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizePattern = exports.resolveFiles = exports.relativeToCwd = exports.toPosixPath = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fast_glob_1 = __importDefault(require("fast-glob"));
/**
 * Returns path with "/" separator on all platforms.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/utils/fileUtils.ts#L56
 * See: https://stackoverflow.com/questions/53799385/how-can-i-convert-a-windows-path-to-posix-path-using-node-path
 */
function toPosixPath(somePath) {
    return somePath.split(node_path_1.default.sep).join(node_path_1.default.posix.sep);
}
exports.toPosixPath = toPosixPath;
/**
 * Returns path relative to cwd.
 */
function relativeToCwd(absPath) {
    return node_path_1.default.isAbsolute(absPath) ? node_path_1.default.relative(process.cwd(), absPath) : absPath;
}
exports.relativeToCwd = relativeToCwd;
/**
 * Resolves patterns to list of files.
 * Extension can be a list: {js,ts}
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/paths/paths.ts
 */
async function resolveFiles(cwd, patterns, extension) {
    const finalPatterns = patterns.map((pattern) => finalizePattern(pattern, extension));
    return fast_glob_1.default.glob(finalPatterns, { cwd, absolute: true, dot: true });
}
exports.resolveFiles = resolveFiles;
/**
 * Appends file extension(s) to pattern.
 * Example: 'path/to/dir' -> 'path/to/dir/** /*.{js,ts}'
 * @public
 */
function finalizePattern(pattern, extension) {
    // On Windows convert path to forward slash.
    // Note: pattern must always use forward slash "/",
    // but directory can be resolved dynamically via path.xxx methods
    // that return backslash on Windows.
    if (node_path_1.default.sep === '\\')
        pattern = toPosixPath(pattern);
    switch (true) {
        case pattern.endsWith('**'):
            return `${pattern}/*.${extension}`;
        case pattern.endsWith('*'):
            return `${pattern}.${extension}`;
        case node_path_1.default.extname(pattern) === '':
            return `${pattern.replace(/\/+$/, '')}/**/*.${extension}`;
        default:
            return pattern;
    }
}
exports.finalizePattern = finalizePattern;
//# sourceMappingURL=paths.js.map