/**
 * Returns path with "/" separator on all platforms.
 * See: https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/utils/fileUtils.ts#L56
 * See: https://stackoverflow.com/questions/53799385/how-can-i-convert-a-windows-path-to-posix-path-using-node-path
 */
export declare function toPosixPath(somePath: string): string;
/**
 * Returns path relative to cwd.
 */
export declare function relativeToCwd(absPath: string): string;
/**
 * Resolves patterns to list of files.
 * Extension can be a list: {js,ts}
 * See: https://github.com/cucumber/cucumber-js/blob/main/src/paths/paths.ts
 */
export declare function resolveFiles(cwd: string, patterns: string[], extension: string): Promise<string[]>;
/**
 * Appends file extension(s) to pattern.
 * Example: 'path/to/dir' -> 'path/to/dir/** /*.{js,ts}'
 * @public
 */
export declare function finalizePattern(pattern: string, extension: string): string;
//# sourceMappingURL=paths.d.ts.map