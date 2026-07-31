/**
 * Decodes a JWT's payload without verifying its signature — verification
 * already happens server-side on every protected request. This is used
 * purely to read claims (role, exp) for client-side UI decisions.
 * @param {string} token
 * @returns {Object|null} Decoded payload, or null if the token is malformed
 */
export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
};

/**
 * Checks whether a decoded JWT payload's exp claim has already passed.
 * @param {Object} decoded
 * @returns {boolean}
 */
export const isTokenExpired = (decoded) => {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 <= Date.now();
};
