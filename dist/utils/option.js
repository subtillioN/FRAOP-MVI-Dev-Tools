export const Some = (value) => ({
    _tag: 'Some',
    value
});
export const None = {
    _tag: 'None'
};
// Type guard functions
export const isSome = (option) => option._tag === 'Some';
export const isNone = (option) => option._tag === 'None';
// Safe type transformations
export const map = (option, f) => isSome(option) ? Some(f(option.value)) : None;
export const flatMap = (option, f) => isSome(option) ? f(option.value) : None;
export const getOrElse = (option, defaultValue) => isSome(option) ? option.value : defaultValue;
export const fold = (option, onNone, onSome) => isSome(option) ? onSome(option.value) : onNone();
// Conversion utilities
export const fromNullable = (value) => value === null || value === undefined ? None : Some(value);
export const toNullable = (option) => isSome(option) ? option.value : null;
//# sourceMappingURL=option.js.map