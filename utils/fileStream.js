import fs from "fs";
import path from 'path';

// Class that encapsulates reading, deleting and acessing of the files
class FileStream {
  constructor(filename) {
    this.folder = process.env.FOLDER || 'uploads/';
    this.filename = path.join(this.folder, filename);
  }

  //returns the content of the filename
  getStream() {
    return fs.createReadStream(this.filename);
  }

  //deletes the File
  deleteFile() {
    return fs.unlinkSync(this.filename);
  }

  //Checks whether the file Exists
  async fileExists() {
    try {
      await fs.promises.access(this.filename, fs.constants.F_OK);
      return true;
    } 
    catch (err) {
      return false;
    }
  }

}

export { FileStream };
