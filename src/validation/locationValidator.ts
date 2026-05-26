/**
 * Validates a user-entered location string.
 *
 * - Trims whitespace so "  London" and "London" hit the same cache entry
 * - Requires at least 2 characters to avoid pointless API calls
 * - No character restrictions — postcodes, accented characters, and
 *   non-latin city names are all valid; invalid locations are caught by the API
 * - No max length enforced — could be worth adding (~100 chars) in future
 */

export type ValidationResult =
  | {valid: true; value: string}
  | {valid: false; reason: string};

export function validateLocation(input: string): ValidationResult {
  const trimmed = input.trim();

  if (trimmed.length < 2) {
    return {
      valid: false,
      reason: 'Please enter a location with at least 2 characters.',
    };
  }

  return {valid: true, value: trimmed};
}
