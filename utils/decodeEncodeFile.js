import crypto from "crypto";

const algorithm = "aes-256-ctr";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encodeFilename(filename) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encodedFilename = cipher.update(filename, "utf8", "hex");
  encodedFilename += cipher.final("hex");

  return encodedFilename;
}

function decodeFilename(encodedFilename) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let filename = decipher.update(encodedFilename, "hex", "utf8");
  filename += decipher.final("utf8");

  return filename;
}

export { encodeFilename, decodeFilename }