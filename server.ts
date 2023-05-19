import express from "express";
import bodyParser from "body-parser";
import router from "./src/routers";
var multer = require("multer");
var multer = multer();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(upload.array());
app.use(express.static("public"));
app.use("/", router);
const server = app.listen(8888, () => {
  console.log(`Server is running on port 8888`);
});

export default server;

// "start": "tsc && nodemon --exec  node dist/server.js"
