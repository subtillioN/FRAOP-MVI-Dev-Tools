export type Option<T> = Some<T> | typeof None;
export type Some<T> = {
    readonly _tag: 'Some';
    readonly value: T;
};
export declare const Some: <T>(value: T) => Some<T>;
export type NoneType = {
    readonly _tag: 'None';
};
export declare const None: NoneType;
export declare const isSome: <T>(option: Option<T>) => option is Some<T>;
export declare const isNone: <T>(option: Option<T>) => option is typeof None;
export declare const map: <T, U>(option: Option<T>, f: (value: T) => U) => Option<U>;
export declare const flatMap: <T, U>(option: Option<T>, f: (value: T) => Option<U>) => Option<U>;
export declare const getOrElse: <T>(option: Option<T>, defaultValue: T) => T;
export declare const fold: <T, U>(option: Option<T>, onNone: () => U, onSome: (value: T) => U) => U;
export declare const fromNullable: <T>(value: T | null | undefined) => Option<T>;
export declare const toNullable: <T>(option: Option<T>) => T | null;
