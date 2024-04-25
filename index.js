const dev = process.argv[2] == "dev";

const express = require("express");
const app = express();
var compression = require("compression");
const https = require('https');
const http = require('http');
const fs = require("fs");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app.set("view engine", "ejs");
app.set("view engine", "ejs");
app.disable("x-powered-by");
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));


app.use((req, res, next) => {
  if (req.protocol === 'http' && !dev) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});


app.on("uncaughtException", function (err) {
  console.log(err);
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


var httpServer = http.createServer({}, app).listen(80, function () {
});

if (!dev) {
  var sslOptions = {
    key: fs.readFileSync('ssl/privkey.key', 'utf8'),
    cert: fs.readFileSync('ssl/cer.cer', 'utf8'),
  };
  var httpsServer = https.createServer(sslOptions, app).listen(443, function () {
  });
}

app.get("/", (request, response) => {
  return response.render("index.ejs", {});
});

// create for the other .ejs files

app.get("/projects", (request, response) => {
  return response.render("projects-details.ejs", {});
});

app.get("/tutoring", (request, response) => {
  return response.render("tutoring.ejs", {});
});

app.get("*", (request, response) => {
  return response.redirect("/");
});