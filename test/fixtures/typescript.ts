const fs = require('node:fs');

export const identity = (value: any) => value
export type Legacy = String;
export type Empty = {};
export type Unsafe = Function;
export function fail(): never {
    throw 'example';
}

export { fs };
