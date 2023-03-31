File Router API
This is a BackEnd Server for handling file storage API endpoints. It includes functionality for downloading, uploading, and deleting files.

Installation
Run npm install to install the dependencies.
Usage
-----------------------------------------------
GET files/:publicKey
This API endpoint downloads a file with the given publicKey.

Example Request
GET localhost:3000/files/:publicKey
Example Response
The response is a stream of the requested file.

If the file doesnt Exists, this return 400 status code with the message 'File does not Exists'
------------------------------------------------
POST files/
This API endpoint uploads a new file to the server and returns the public and private keys for accessing it.

Example Request

POST /
Content-Type: multipart/form-data

file: <file>
Example Response
The response is a JSON object containing the public and private keys for the uploaded file.

{
  "publicKey": "abcd1234",
  "privateKey": "aW1hZ2VzL2FiY2QxMjM0"
}

--------------------------------------------------
DELETE files/:privateKey
This API endpoint deletes a file with the given privateKey.

Example Request

DELETE files/:privateKey
Example Response
The response is a JSON object with a message indicating the file was deleted successfully.

{
  "message": "File deleted successfully"
}
----------------------------------------------------

Rate Limiting
Requests to the API are rate limited to 100 requests per day per IP address.

Error Handling
If an error occurs, the server will return a 500 Internal Server Error response with a message of "Something went wrong! Please try again". The error message will also be logged to the console.

-----------------------------------------------------
Cleanup Utility
The cleanup.js file contains a utility function that is responsible for deleting files that have been inactive for more than 30 days.

Functionality
The cleanupFiles function is a utility function that runs on a specified interval to delete files that have not been accessed for more than 30 days. It achieves this by using the fs module to access and read the files' metadata, comparing their mtime (last modified time) with the current date and deleting files whose mtime is more than 30 days old.


------------------------------------------------------