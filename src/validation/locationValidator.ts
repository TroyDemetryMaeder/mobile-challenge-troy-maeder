/**
 * Validates a user-entered location string.
 *
 * TODO: Implement.
 *
 * You decide what counts as valid. Some things to think about:
 *   - Minimum / maximum length
 *   - Allowed characters (letters, spaces, hyphens, commas, accents?)
 *   - Trimming whitespace
 *   - How to communicate WHY something is invalid back to the UI
 *
 * Document your choices in NOTES.md.
 */

export type ValidationResult =
  | {valid: true; value: string}
  | {valid: false; reason: string};

export function validateLocation(_input: string): ValidationResult {
  throw new Error('validateLocation not implemented');
}
