import { Some, None, isSome } from '../utils/option';
// Functional programming patterns
const patterns = [
    {
        name: 'mutation',
        description: 'Avoid mutating state directly',
        test: (code) => {
            const mutationPatterns = [
                /\.[a-zA-Z]+\s*=\s*/,
                /\+\+/,
                /--/,
                /\+=|-=|\*=|\/=/
            ];
            return mutationPatterns.some(pattern => pattern.test(code));
        }
    },
    {
        name: 'side-effect',
        description: 'Functions should be pure and have no side effects',
        test: (code) => {
            const sideEffectPatterns = [
                /console\.(log|warn|error)/,
                /Math\.random/,
                /new Date\(\)/,
                /setTimeout|setInterval/
            ];
            return sideEffectPatterns.some(pattern => pattern.test(code));
        }
    },
    {
        name: 'mutable-state',
        description: 'Use immutable state management',
        test: (code) => {
            const mutableStatePatterns = [
                /useState\(\)/,
                /this\.state\s*=/,
                /setState\(\{[^}]+\}\)/
            ];
            return mutableStatePatterns.some(pattern => pattern.test(code));
        }
    },
    {
        name: 'null-check',
        description: 'Use Option types instead of null/undefined',
        test: (code) => {
            const nullPatterns = [
                /null/,
                /undefined/,
                /\?\./
            ];
            return nullPatterns.some(pattern => pattern.test(code));
        }
    }
];
// Validation rules
export const rules = patterns.map(pattern => ({
    name: pattern.name,
    description: pattern.description,
    validate: (code) => {
        const violations = [];
        if (pattern.test(code)) {
            violations.push(`Found ${pattern.name} violation: ${pattern.description}`);
        }
        return violations.length > 0 ? Some(violations) : None;
    }
}));
// Validation function
export const validateCode = (code) => {
    return rules
        .map(rule => {
        const result = rule.validate(code);
        return {
            rule: rule.name,
            violations: isSome(result) ? result.value : []
        };
    })
        .filter(result => result.violations.length > 0);
};
//# sourceMappingURL=functional.js.map