const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('/')
})

app.get('/binance/ticker/24hr', (req, res) => {
  const request = require('request');
  let url = "https://data-api.binance.vision/api/v3/ticker/24hr";
  let options = { json: true };

  res.setHeader('Content-Type', 'application/json');
  request(url, options, (_error, _res, _body) => {
    res.statusCode = _res.statusCode;
    if (_error) {
      res.end(_error);
    }
    else {
      let output = JSON.stringify(_body)
      res.end(output);
    }
  });
})

app.listen(3001)