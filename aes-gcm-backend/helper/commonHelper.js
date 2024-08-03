const crypto = require("crypto");

const KEYstr =
  "489962d844e3f752951c2f8d442bbb7460668dd305f534be28245b1f122cf5b1";
const KEY = Buffer.from(KEYstr, "hex");
function encrypt(message) {
  const IV = crypto.randomBytes(16);
  const ALGORITHM = "aes-256-gcm";
  //   console.log(KEYstr);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);

  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  let output = {
    encrypted,
    IV: IV.toString("hex"),
    TAG: tag.toString("hex"),
  };
  return output;
}

function hexStringToBuffer(hexString) {
  hexString = hexString.replace(/^0x/, "");
  if (hexString.length % 2 !== 0) {
    console.log(
      "WARNING: expecting an even number of characters in the hexString"
    );
  }
  return Buffer.from(hexString, "hex");
}

function decrypt(data) {
  const KEY = hexStringToBuffer(KEYstr);
  const IV = hexStringToBuffer(data.IV);
  const encrypted = hexStringToBuffer(data.encrypted);
  const TAG = hexStringToBuffer(data.TAG);

  try {
    // Create a decipher instance
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, IV);
    decipher.setAuthTag(TAG);

    // Decrypt the message
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error; // Rethrow error for handling by caller
  }
}

module.exports = {
  encrypt,
  decrypt,
};
