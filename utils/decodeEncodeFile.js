import crypto from "crypto";

const algorithm = "aes-256-ctr";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Gives the private key by encoding the public key(i.e Filename provided)
function encodeFilename(filename) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encodedFilename = cipher.update(filename, "utf8", "hex");
  encodedFilename += cipher.final("hex");

  return encodedFilename;
}

//Gets a private Key and encodes that private key, and returns the fileName
function decodeFilename(encodedFilename) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let filename = decipher.update(encodedFilename, "hex", "utf8");
  filename += decipher.final("utf8");

  return filename;
}

export { encodeFilename, decodeFilename }