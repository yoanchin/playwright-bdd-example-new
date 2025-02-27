/**
 * Returns Symbol by name.
 * See: https://stackoverflow.com/questions/50453640/how-can-i-get-the-value-of-a-symbol-property
 */
export declare function getSymbolByName<T extends object>(target: T, name?: string): keyof T;
export declare function removeDuplicates<T>(arr: T[]): T[];
export declare function resolvePackageRoot(packageName: string): string;
export declare function getPackageVersion(packageName: string): string;
export declare function callWithTimeout<T>(fn: () => T, timeout?: number, timeoutMsg?: string): Promise<T>;
export declare function stringifyLocation({ line, column }: {
    line: number;
    column?: number;
}): string;
export declare function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K>;
export declare function removeUndefined<T extends object>(obj: T): T;
export declare function toArray<T>(value: T | T[]): T[];
export declare function trimTrailingSlash(s: string): string;
export declare function booleanDefault(value: unknown, defaultValue: boolean): boolean;
export declare function calculateSha1(buffer: Buffer | string): string;
export declare function throwIf(condition: unknown, message: string): void;
/**
 * Save file synchronously, create directory if needed.
 */
export declare function saveFileSync(filePath: string, content: string): void;
export declare function toBoolean<T>(value: T): value is NonNullable<T>;
export declare function areSetsEqual<T>(set1: Set<T>, set2: Set<T>): boolean;
//# sourceMappingURL=index.d.ts.map