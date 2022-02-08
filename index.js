const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const Api = require("./api");

const app = express();
const api = new Api();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/shorten/:id", (req, res) => {
  const id = req.params.id;

  api.get(id, (urlObject) => {
    if (!urlObject.length) {
      return res.json({
        error: "no site found with id " + id,
      });
    }

    let url = urlObject[0].url;

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    console.log("::redirecting to: " + url);
    res.redirect(url);
  });
});

app.post("/shorten", (req, res) => {
  console.log("::POST /shorten");
  const url = req.body.url;

  if (!url) {
    console.error("::Missing url in /shorten");
    res.json({
      error: "provide url",
    });
  }

  const shortenedURL = api.shorten(url);
  res.send(shortenedURL);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("::listening on " + port);
});
