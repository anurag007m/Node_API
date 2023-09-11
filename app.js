require("dotenv").config(); //adds and configures the dotenv library

const express = require('express');

const app = express();

const port =3001


//importing important modules
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

//Aws configuration

aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,

});

const BUCKET = process.env.BUCKET

const s3 = new aws.S3();//We're creating a new instance (a copy) of something called S3 from a package called aws-sdk. 

const upload = multer({ //setting up an object using a tool called multer
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,

        // We're telling multer-s3 how to name the files when they go into the bucket. We're using the original name of the uploaded file (file.originalname) as the name.
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname)
        }
    })
});

//This route defines a GET request handler for the root path ('/').
//when get request is made to this path it responds with an html form
app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>File Upload</title>
        </head>
        <body>
          <h1>Upload a File</h1>
          <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
          </form>
        </body>
      </html>
    `);
  });


  //express route for file upload

  //it is using upload.single('file' middleware)


app.post('/upload', upload.single('file'), (req, res) => {
  // The file has been uploaded to S3, and its URL can be obtained from the 'Location' property of req.file
  const fileUrl = req.file.location;

  // Send the S3 upload file link as a response
  res.send(`Successfully uploaded to S3 bucket. File URL: <a href="${fileUrl}" target="_blank">${fileUrl}</a>`);
});






//listening to port 3001

app.listen(port,()=>console.log(`server started at PORT: ${port} `));