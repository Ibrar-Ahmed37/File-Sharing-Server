import request from 'supertest';
import { app } from '../app.js'; // assuming your express app instance is exported as `app`
import { FileStream } from '../utils/fileStream.js';
import { encodeFilename, decodeFilename } from '../utils/decodeEncodeFile';

describe('file routes', () => {
  let publicKey;
  let privateKey;
  const fileContent = 'some file content';

  beforeEach(async () => {
    // Upload a file to use for testing GET and DELETE routes
    const res = await request(app)
      .post('/files')
      .attach('file', Buffer.from(fileContent), 'test.txt');
    publicKey = res.body.publicKey;
    privateKey = res.body.privateKey;
  });

  afterEach(async () => {
    // Delete the test file after each test
    const filename = decodeFilename(privateKey);
    const file = new FileStream(filename);
    await file.deleteFile();
  });

  describe('GET /files/:publicKey', () => {
    test('should return the file content', async () => {
      const res = await request(app).get(`/files/${publicKey}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe(fileContent);
    });

    test('should return 400 if file does not exist', async () => {
      const res = await request(app).get('/files/nonexistentfile');
      expect(res.status).toBe(400);
      expect(res.text).toBe('File does not Exists');
    });

    test('should return 500 on server failure', async () => {
      jest.spyOn(FileStream.prototype, 'fileExists').mockRejectedValueOnce(new Error('server error'));
      const res = await request(app).get(`/files/${publicKey}`);
      expect(res.status).toBe(500);
      expect(res.text).toBe('Server Failure');
    });
  });

  describe('POST /files', () => {
    test('should upload a file', async () => {

      const res = await request(app)
        .post('/files')
        .attach('file', Buffer.from(fileContent), 'test.txt');
      expect(res.status).toBe(200);
      expect(res.body.publicKey).toBeDefined();
      expect(res.body.privateKey).toBeDefined();
      
      const file = new FileStream(res.body.publicKey);
      await file.deleteFile();
    });
  });

  describe("DELETE /files/:privateKey", () => {
  
    test("should delete the specified file and return status 200", async () => {
      // Upload a file first
      const uploadResponse = await request(app)
        .post("/files")
        .attach('file', Buffer.from(fileContent), 'test.txt');
  
      const privateKey = uploadResponse.body.privateKey;
  
      const response = await request(app).delete(`/files/${privateKey}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("File deleted successfully");
  
      // Check that the file was deleted
      const fileStreamObj = new FileStream(privateKey);
      const exists = await fileStreamObj.fileExists();
      expect(exists).toBe(false);
    });
  
    test("should return 400 if the file does not exist", async () => {
      const privateKey = "invalid_private_key";
  
      const response = await request(app).delete(`/files/${privateKey}`);
  
      expect(response.status).toBe(500);
      expect(response.text).toBe("Something went wrong! Please try again");
    });
  });
});