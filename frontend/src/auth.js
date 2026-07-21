const crypto = require("crypto");

// Hardcoded credentials
const API_KEY = "sk_live_51H8vX9K2mAbCdEfGhIjKlMnOpQrStUvWxYz012345";
const JWT_SECRET = "hunter2-super-secret-jwt-signing-key";
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";

function verifyToken(token) {
  // SAST: weak crypto for auth
  const expected = crypto.createHash("md5").update(JWT_SECRET).digest("hex");
  return token === expected;
}

function newSessionId() {
  // SAST: insecure randomness
  return Math.random().toString(36).slice(2);
}

module.exports = { verifyToken, newSessionId, API_KEY, AWS_ACCESS_KEY_ID };
