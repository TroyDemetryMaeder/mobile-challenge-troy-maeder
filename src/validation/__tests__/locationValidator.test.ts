import {validateLocation} from '../locationValidator';

describe('validateLocation', () => {
  it.each([
    'London',
    'São Paulo',
    'Stratford-upon-Avon',
    'Paris, France',
    'LA',
    '90210',
    'SW1A',
  ])('accepts "%s"', input => {
    expect(validateLocation(input).valid).toBe(true);
  });

  it('trims whitespace and returns trimmed value', () => {
    expect(validateLocation('  Berlin  ')).toEqual({
      valid: true,
      value: 'Berlin',
    });
  });

  it.each(['', 'a', '   ', '  x  '])('rejects "%s" as too short', input => {
    expect(validateLocation(input).valid).toBe(false);
  });

  it('returns a non-empty reason when invalid', () => {
    const result = validateLocation('');
    if (!result.valid) {
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });
});
