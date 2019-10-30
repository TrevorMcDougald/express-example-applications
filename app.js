// modules needed for the application
const express = require('express');
const path = require('path');
const fs = require('fs');

// create the express application and put it INSIDE the app variable
const app = express();

// write a middleware to log all incoming request
app.use(function(request, response, next) {
  console.log('Request IP: ' + request.url);
  console.log('Request date: ' + new Date());
  next(); // Go to next middleware function
});

// write the static file server middleware
app.use(function(request, response, next) {
  // use path.join to find the path where the file should be
  const filePath = path.join(__dirname, "static", request.url);
  // fs.stat([path to check], [callback(error, object-with-methods-about-file)])
  fs.stat(filePath, function(err, fileInfo) {
    if (err) {
      // if fs.stat fails, continue to the next middleware
      next();
      return;
    }
    // using the isFile() method on object from callback in fs.stat()
    if (fileInfo.isFile()) {
      // if the file exist, call response.sendFile()
      response.sendFile(filePath);
    } else {
      // otherwise, continue to the next middleware
      next();
      // next is required due to all the asynchronous behavior in express applications,
      // need to manually tell Express when to continue onto next middleware in stack
    }
  })
});

// Write the 404 Handler Middleware
//      omitting "next" argument because middleware won't need it
app.use(function(request, response) {
  // Sets the status code to 404
  response.status(404);
  // Send the error
  response.send("File not found!");
});

app.listen(3000, function() {
  console.log('App started on port 3000, http://localhost:3000');
});
