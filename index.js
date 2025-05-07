require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Add body-parser middleware
app.use(require("body-parser").urlencoded({extended : false}));

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const dns = require("dns");
const { count } = require('console');
let urlStorage = [];
let counter = 0;

// Url shorten api endpoint
app.get("/api/shorturl/:short", function(req, res) {
  const shortUrl = parseInt(req.params.short);
  const originalUrl = urlStorage[shortUrl];

  if (!originalUrl) {
    res.json({
      "error" : "No short URL found for the given input"
    });
  }
  res.redirect(originalUrl);

});

app.post("/api/shorturl", function(req, res) {
  let inputUrl = req.body.url;

  let hostName;
  try {
    hostName = new URL(inputUrl).hostname;
  } catch(err) {
    return res.json({ "error" : "invalid url" });
  }

  // Check host name through dns lookup
  dns.lookup(hostName, function(err) {
    if (err)
      return res.json({ "error" : "invalid url" });

    const shortUrl = counter++;
    urlStorage[shortUrl] = inputUrl;

    res.json({
      "original_url" : inputUrl,
      "short_url" : shortUrl
    });
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
