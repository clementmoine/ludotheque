import { omit } from './omit';

describe('omit', () => {
  it('should return an empty object when every keys are excluded', () => {
    const result = omit({ a: 1, b: 2 }, ['a', 'b']);
    expect(result).toEqual({});
  });

  it('should return an object with the excluded keys removed', () => {
    const result = omit({ a: 1, b: 2 }, ['b']);
    expect(result).toEqual({ a: 1 });
  });
});
