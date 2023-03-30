import request from "supertest";
import { filesRouter } from "../files.js";
import { encodeFilename, decodeFilename } from "../../utils/decodeEncodeFile.js";
import { FileStream } from "../../utils/fileStream.js";

jest.mock("../utils/fileStream");

describe("Files API", () => {
  let testFile;

  beforeEach(() => {
    // create a test file
    testFile = { originalname: "test-file.jpg", filename: "test-file.jpg" };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /:publicKey", () => {
    test("returns a file stream for a valid public key", async () => {
      const fileStream = { pipe: jest.fn() };
      FileStream.mockReturnValueOnce({
        getStream: jest.fn().mockReturnValueOnce(fileStream),
      });

      const res = await request(filesRouter).get(`/${testFile.filename}`);

      expect(res.status).toEqual(200);
      expect(FileStream).toHaveBeenCalledWith(testFile.filename);
      expect(fileStream.pipe).toHaveBeenCalledWith(res);
    });

    test("returns a 404 error for an invalid public key", async () => {
      FileStream.mockImplementationOnce(() => {
        throw new Error("File not found");
      });

      const res = await request(filesRouter).get("/invalid-public-key");

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({ error: "File not found" });
    });
  });

  describe("POST /", () => {
    test("uploads a file and returns its public and private keys", async () => {
      const res = await request(filesRouter)
        .post("/")
        .attach("file", "test/test-file.jpg");

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({
        publicKey: expect.any(String),
        privateKey: expect.any(String),
      });
      expect(FileStream).toHaveBeenCalledWith(testFile.filename);
    });
  });

  describe("DELETE /:privateKey", () => {
    test("deletes a file for a valid private key", async () => {
      FileStream.mockReturnValueOnce({ deleteFile: jest.fn() });

      const res = await request(filesRouter).delete(
        `/${encodeFilename(testFile.filename)}`
      );

      expect(res.status).toEqual(200);
      expect(FileStream).toHaveBeenCalledWith(testFile.filename);
      expect(FileStream().deleteFile).toHaveBeenCalled();
    });

    test("returns a 404 error for an invalid private key", async () => {
      const res = await request(filesRouter).delete("/invalid-private-key");

      expect(res.status).toEqual(404);
      expect(res.body).toEqual({ error: "File not found" });
    });
  });
});
