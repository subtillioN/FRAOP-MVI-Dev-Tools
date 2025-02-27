import { validateCode, patterns } from '../validation';
import { isSome } from '../../utils/option';

describe('Validation Module', () => {
  describe('validateCode', () => {
    it('should detect class usage', () => {
      const code = `
        class MyComponent {
          constructor() {}
        }
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'classKeyword')).toBe(true);
    });

    it('should detect this keyword usage', () => {
      const code = `
        class MyComponent {
          method() {
            this.state = {};
          }
        }
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'thisKeyword')).toBe(true);
    });

    it('should detect mutable operations', () => {
      const code = `
        const arr = [];
        arr.push(1);
        arr.pop();
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'mutableOperations')).toBe(true);
    });

    it('should detect instanceof usage', () => {
      const code = `
        if (obj instanceof MyClass) {
          // do something
        }
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'instanceOf')).toBe(true);
    });

    it('should detect void functions', () => {
      const code = `
        function doSomething(): void {
          console.log('hello');
        }
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'voidFunction')).toBe(true);
    });

    it('should detect null usage', () => {
      const code = `
        const value = null;
        if (obj === null) {
          return;
        }
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'nullLiteral')).toBe(true);
    });

    it('should detect let declarations', () => {
      const code = `
        let count = 0;
        let value;
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'letDeclaration')).toBe(true);
    });

    it('should detect for loops', () => {
      const code = `
        for (let i = 0; i < 10; i++) {
          console.log(i);
        }
        while (condition) {
          doSomething();
        }
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'forLoop')).toBe(true);
    });

    it('should detect delete operator', () => {
      const code = `
        const obj = { a: 1, b: 2 };
        delete obj.a;
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'deleteOperator')).toBe(true);
    });

    it('should detect assignments', () => {
      const code = `
        let x = 1;
        x = 2;
        obj.prop = 42;
      `;
      const results = validateCode(code);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.rule === 'assignment')).toBe(true);
    });

    it('should pass functional code', () => {
      const code = `
        const add = (a: number, b: number): number => a + b;
        const newState = { ...state, count: state.count + 1 };
        const value: Option<number> = Some(42);
        const result = value.fold(() => 0, x => x * 2);
      `;
      const results = validateCode(code);
      expect(results.length).toBe(0);
    });
  });
}); 