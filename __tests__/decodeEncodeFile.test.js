import { encodeFilename, decodeFilename } from '../utils/decodeEncodeFile.js';

describe('crypto', () => {
  test('encodeFilename and decodeFilename should work correctly', () => {
    const filename = 'test.txt';
    const encodedFilename = encodeFilename(filename);
    const decodedFilename = decodeFilename(encodedFilename);

    expect(encodedFilename).not.toEqual(filename); // Encoded filename should be different from original filename
    expect(decodedFilename).toEqual(filename); // Decoded filename should be the same as the original filename
  });
});
