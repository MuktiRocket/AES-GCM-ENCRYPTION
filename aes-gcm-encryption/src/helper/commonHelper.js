const KEYstr =
  "489962d844e3f752951c2f8d442bbb7460668dd305f534be28245b1f122cf5b1";

export async function decrypt(data) {
  const KEY = hexStringToArrayBuffer(KEYstr);
  const IV = hexStringToArrayBuffer(data.IV);
  const encrypted = hexStringToArrayBuffer(data.encrypted + data.TAG);

  try {
    // Import the key
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      KEY,
      "AES-GCM",
      true,
      ["decrypt"]
    );
    // Decrypt the data
    const decodedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: IV,
      },
      importedKey,
      encrypted
    );

    // Decode the plaintext
    const plaintext = new TextDecoder("utf8").decode(decodedBuffer);

    return plaintext;
  } catch (error) {
    throw error; // Rethrow error for handling by caller
  }
}

export async function encrypt(message) {
  const KEY = hexStringToArrayBuffer(KEYstr);
  const IV = crypto.getRandomValues(new Uint8Array(16)); // Generate a random IV
  const ALGORITHM = "AES-GCM";

  // Import the key
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    KEY,
    ALGORITHM,
    true,
    ["encrypt"]
  );

  // Encrypt the message
  const encodedMessage = new TextEncoder().encode(message);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: IV,
    },
    cryptoKey,
    encodedMessage
  );

  // Extract the encryption tag
  const encrypted = arrayBufferToHexString(encryptedBuffer.slice(0, -16)); // Exclude tag
  const tag = arrayBufferToHexString(encryptedBuffer.slice(-16)); // Extract tag

  return {
    encrypted,
    IV: arrayBufferToHexString(IV),
    TAG: tag,
  };
}

export function hexStringToArrayBuffer(hexString) {
  hexString = hexString.replace(/^0x/, "");
  if (hexString.length % 2 != 0) {
    console.log(
      "WARNING: expecting an even number of characters in the hexString"
    );
  }
  var bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.log("WARNING: found non-hex characters", bad);
  }
  var pairs = hexString.match(/[\dA-F]{2}/gi);
  var integers = pairs.map(function (s) {
    return parseInt(s, 16);
  });
  var array = new Uint8Array(integers);
  return array.buffer;
}

export function arrayBufferToHexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function fetchWithEncryption(url, options = {}) {
  // Encrypt the request body if present
  if (options.body) {
    try {
      const encryptedBody = await encrypt(options.body);
      options.body = JSON.stringify(encryptedBody);
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to encrypt request");
    }
  }

  // Perform the fetch request
  const response = await fetch(url, options);

  // Decrypt the response body if present
  try {
    const responseData = await response.json();
    const decryptedData = await decrypt(responseData);

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt response");
  }
}
