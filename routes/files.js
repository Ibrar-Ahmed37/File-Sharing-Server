import { Router } from "express";
import { upload } from "../fileStorage.js";
import { encodeFilename, decodeFilename } from "../utils/decodeEncodeFile.js";
import { FileStream } from "../utils/fileStream.js";

const router = Router();

// * API endpoint to download a file
router.get("/:publicKey", (req, res) => {
  const { publicKey } = req.params;

  const fileStream = new FileStream(publicKey).getStream();
  fileStream.pipe(res);
});

// * API endpoint to upload new files
router.post("/", upload.single("file"), (req, res) => {
  const publicKey = req.file.filename;
  const privateKey = encodeFilename(req.file.filename);

  res.send({ publicKey, privateKey }).status(200);
});

// * API endpoint to remove existing files
router.delete("/:privateKey", (req, res) => {
  const { privateKey } = req.params;

  const filename = decodeFilename(privateKey);
  const file = new FileStream(filename).deleteFile();

  res.send({ message: 'File deleted successfully' }).status(200);
});

export { router as filesRouter };
