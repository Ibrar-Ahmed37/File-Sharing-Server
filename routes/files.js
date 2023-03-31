import { Router } from "express";
import { upload } from "../fileStorage.js";
import { encodeFilename, decodeFilename } from "../utils/decodeEncodeFile.js";
// import { fileExists } from "../utils/fileExists.js";
import { FileStream } from "../utils/fileStream.js";

const router = Router();

// * API endpoint to download a file
router.get("/:publicKey", async(req, res) => {
  const { publicKey } = req.params;
  const fileStreamObj = new FileStream(publicKey);
  try
  {
    const exists = await fileStreamObj.fileExists();   
    //Checks for the file and if doesnt exists, return with 400
    if(!exists){
      return res.status(400).send('File does not Exists')
    }
    //else Proceed to downloading/reading the file
    const fileStream = fileStreamObj.getStream();
    fileStream.pipe(res);
  }
  catch(error){
    return res.status(500).send('Server Failure')
  }
});

// * API endpoint to upload new files
router.post("/", upload.single("file"), (req, res) => {
  //set fileName to be the Public Key
  const publicKey = req.file.filename;
  //set the private key by encoding the public key
  const privateKey = encodeFilename(req.file.filename);

  res.send({ publicKey, privateKey }).status(200);
});

// * API endpoint to remove existing files
router.delete("/:privateKey", (req, res) => {
  const { privateKey } = req.params;
  //Gets the fileName by decoding the private Key
  const filename = decodeFilename(privateKey);
  //Deletes the file 
  const file = new FileStream(filename).deleteFile();

  res.send({ message: 'File deleted successfully' }).status(200);
});

export { router as filesRouter };
