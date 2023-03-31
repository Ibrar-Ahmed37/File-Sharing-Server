import { promisify } from "util";
import fs from "fs";
import path from "path";

export async function cleanupFiles() {
  const readdir = promisify(fs.readdir);
  const stat = promisify(fs.stat);
  const unlink = promisify(fs.unlink);

  const files = await readdir(process.env.FOLDER);
  const now = Date.now();
  for (const file of files) {
    const filePath = path.join(process.env.FOLDER, file);
    const stats = await stat(filePath);
    const age = now - stats.mtime.getTime();

    // * Remove files older than 30 days
    if (age > 30 * 24 * 60 * 60 * 1000) {
      await unlink(filePath);
    }
  }
}
