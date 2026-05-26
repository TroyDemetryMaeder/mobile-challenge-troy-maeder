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
  | { valid: true; value: string }
  | { valid: false; reason: string };

export function validateLocation(input: string): ValidationResult {
  const trimmed = input.trim();

  if (trimmed.length < 2) {
    return { valid: false, reason: 'Please enter a location with at least 2 characters.' };
  }

  return { valid: true, value: trimmed };
}
