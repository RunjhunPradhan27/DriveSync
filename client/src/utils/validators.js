/**
 * Matches a basic "something@something.something" shape. Used for
 * client-side email validation before submitting to the backend.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
