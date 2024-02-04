const express = require('express')
const app = express()
let url = "";
let options = {
  json: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  }};
let host_binance = "https://data-api.binance.vision/api/";
let host_coingecko = "https://api.coingecko.com/api/";

app.get('/', (req, res) => {
  let paths = [];
  paths.push("/coingecko/markets/btc/1/");
  paths.push("/binance/ticker/24hr");
  paths.push("/binance/klines/BTCUSDT/30m/1000/");
  let output = "<ul>"
  paths.forEach((element) => {
    output += "<li><a href='" + element + "'>" + element + "</a></li>";
  });
  output += "</ul>";
  //res.send('<ol><li><a href="/binance/ticker/24hr">/binance/ticker/24hr</a></li><li><a href="/binance/klines/BTCUSDT/30m/1000/">/binance/klines/BTCUSDT/30m/1000</a></li></ol>')
  res.send(output);
})

app.get('/binance/ticker/24hr/', (req, res) => {
  const request = require('request');
  url = host_binance + "v3/ticker/24hr";

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
});

app.get('/binance/klines/BTCUSDT/30m/1000/', (req, res) => {
  const request = require('request');
  url = host_binance + "v1/klines?symbol=BTCUSDT&interval=30m&limit=1000";

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
});

app.get('/coingecko/markets/btc/1/', (req, res) => {
  const request = require('request');
  url = host_coingecko + "v3/coins/markets?vs_currency=btc&order=market_cap_desc&per_page=250&page=1&sparkline=false";

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
});

app.listen(3001)