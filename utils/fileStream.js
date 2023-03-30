import fs from "fs";
import path from 'path';

class FileStream {
  constructor(filename) {
    this.folder = process.env.FOLDER || 'uploads/';
    this.filename = path.join(this.folder, filename);
  }

  getStream() {
    return fs.createReadStream(this.filename);
  }

  deleteFile() {
    return fs.unlinkSync(this.filename);
  }
}

export { FileStream };
