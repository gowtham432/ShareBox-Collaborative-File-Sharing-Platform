
# ShareBox-Collaborative-File-Sharing-Platform

This project is a file sharing application with backend implemented in Go. It allows users to upload files, give access to other users, and download files shared with them. If the user who shared the file deletes it, the file is also deleted from all users who were granted access.


## Features

- User registration
- User authentication
- File upload
- Grant access to other users
- Download shared files
- Automatic file deletion upon owner's deletion



## End Points

- POST /registartion: Register a new user.
- GET /getAll: Get details of all registered users.
- POST /loggedIn: Check login details.
- POST /uploadFile: Upload a file.
- GET /getAllFilesForId/{username}: Get all files for a specific user.
- DELETE /deleteFileForId/{username}/{filename}/{admin}: Delete a file for a specific user.
- POST /accessforIds: Add files to selected users.
## Tech Stack

**Client:** React, Typescript

**Server:** Go

**Database:** MySql

