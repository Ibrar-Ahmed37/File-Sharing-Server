import { FileStream } from '../utils/fileStream.js';
import fs from 'fs';
import path from 'path';

describe('FileStream', () => {
  const testFileName = 'test.txt';

  afterEach(() => {
    const filePath = path.join(process.env.FOLDER || 'uploads/', testFileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test('getStream should return a readable stream', () => {
    const fileStream = new FileStream(testFileName);
    const stream = fileStream.getStream();
    expect(stream.readable).toBeTruthy();
  });

  test('deleteFile should delete the file', () => {
    const filePath = path.join(process.env.FOLDER || 'uploads/', testFileName);
    fs.writeFileSync(filePath, 'test');
    const fileStream = new FileStream(testFileName);
    fileStream.deleteFile();
    expect(fs.existsSync(filePath)).toBeFalsy();
  });

  test('fileExists should return true if the file exists', async () => {
    const filePath = path.join(process.env.FOLDER || 'uploads/', testFileName);
    fs.writeFileSync(filePath, 'test');
    const fileStream = new FileStream(testFileName);
    const fileExists = await fileStream.fileExists();
    expect(fileExists).toBeTruthy();
  });

  test('fileExists should return false if the file does not exist', async () => {
    const fileStream = new FileStream(testFileName);
    const fileExists = await fileStream.fileExists();
    expect(fileExists).toBeFalsy();
  });
});
