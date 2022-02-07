const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/shorten", (req, res) => {
  const url = req.body.url;

  if (!url) {
    console.error("missing url in /shorten");
    res.json({
      error: "provide url",
    });
  }

  const shortenedURL = api.shorten(url);
  res.send("got " + shortenedURL);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("listening on " + port);
});
