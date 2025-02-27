import { validateCode, rules } from '../functional';
import { isSome } from '../../utils/option';

describe('Functional Programming Validation Rules', () => {
  describe('mutation rule', () => {
    const rule = rules.find(r => r.name === 'mutation')!;

    it('should detect direct property mutations', () => {
      const code = `
        obj.prop = 42;
        this.state = newState;
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should detect increment/decrement operators', () => {
      const code = `
        count++;
        i--;
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should pass for immutable updates', () => {
      const code = `
        const newObj = { ...obj, prop: 42 };
        const newState = { ...state, count: state.count + 1 };
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(false);
    });
  });

  describe('side-effect rule', () => {
    const rule = rules.find(r => r.name === 'side-effect')!;

    it('should detect console logging', () => {
      const code = `
        console.log('debug');
        console.error('oops');
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should detect random number generation', () => {
      const code = `const random = Math.random();`;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should pass for pure functions', () => {
      const code = `
        const add = (a: number, b: number): number => a + b;
        const multiply = (x: number, y: number): number => x * y;
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(false);
    });
  });

  describe('mutable-state rule', () => {
    const rule = rules.find(r => r.name === 'mutable-state')!;

    it('should detect useState without initialization', () => {
      const code = `const [state, setState] = useState();`;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should detect class component state mutations', () => {
      const code = `this.state = { count: 0 };`;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should pass for immutable state updates', () => {
      const code = `
        const [state, setState] = useImmer(initialState);
        const [value, setValue] = useOption(Some(0));
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(false);
    });
  });

  describe('null-check rule', () => {
    const rule = rules.find(r => r.name === 'null-check')!;

    it('should detect null usage', () => {
      const code = `const value = null;`;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should detect optional chaining', () => {
      const code = `const name = user?.name;`;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(true);
    });

    it('should pass for Option type usage', () => {
      const code = `
        const value: Option<number> = Some(42);
        const result = value.fold(() => 0, x => x * 2);
      `;
      const result = rule.validate(code);
      expect(isSome(result)).toBe(false);
    });
  });

  describe('validateCode', () => {
    it('should return all violations', () => {
      const code = `
        let count = 0;
        count++;
        console.log(count);
        const value = null;
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'mutation')).toBe(true);
      expect(results.some(r => r.rule === 'side-effect')).toBe(true);
      expect(results.some(r => r.rule === 'null-check')).toBe(true);
    });

    it('should return no violations for functional code', () => {
      const code = `
        const add = (a: number, b: number): number => a + b;
        const newState = { ...state, count: state.count + 1 };
        const value: Option<number> = Some(42);
      `;
      const results = validateCode(code);
      expect(results.length).toBe(0);
    });
  });
}); 