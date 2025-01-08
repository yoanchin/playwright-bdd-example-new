/**
 * Extended Map that automatically creates item if it does not exist.
 */
export declare class AutofillMap<K, V> extends Map<K, V> {
    getOrCreate(key: K, createFn: (key: K) => V): V;
}
//# sourceMappingURL=AutofillMap.d.ts.map