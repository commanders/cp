const express = require('express');
const app = express();
const https = require('https');

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
  paths.push("/coingecko/markets/btc/");
  paths.push("/coingecko/markets/btc/1/");
  paths.push("/coingecko/markets/usd/");
  paths.push("/coingecko/markets/usd/1/");
  paths.push("/coingecko/markets/usd/2/");
  paths.push("/binance/ticker/24hr");
  paths.push("/binance/klines/BTCUSDT/30m/1000/");
  let output = "<ul>"
  paths.forEach((element) => {
    output += "<li><a href='" + element + "'>" + element + "</a></li>";
  });
  output += "</ul>";
  //res.send('<ol><li><a href="/binance/ticker/24hr">/binance/ticker/24hr</a></li><li><a href="/binance/klines/BTCUSDT/30m/1000/">/binance/klines/BTCUSDT/30m/1000</a></li></ol>')
  res.send(output);
});

app.get('/echo/', (req, res) => {
  res.send("OK");
});

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

//function getCoinGeckoMarkets(page, vs_currency) {
//  const request = require('request');
//  let url = host_coingecko + "v3/coins/markets?vs_currency=" + vs_currency + "&order=market_cap_desc&per_page=250&page=" + page + "&sparkline=false";
//  let output = { error: null, body: null, statusCode: null, symbols: []};

//  request(url, options, (_error, _res, _body) =>
//  {
//    output.body = _body;
//    output.error = _error;
//    output.statusCode = _res.statusCode
//    if (!_error) {
//      let j = [];
//      for (var i = 0; i < _body.length; i++) {
//        j = _body[i];
//        output.symbols.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
//      }
//    }
//  });
//}

function getCoinGeckoMarkets(page, vs_currency) {
  return new Promise((resolve, reject) => {
    let url = host_coingecko + "v3/coins/markets?vs_currency=" + vs_currency + "&order=market_cap_desc&per_page=250&page=" + page + "&sparkline=false";
    output = {url: url, error: null, body: null, statusCode: null, symbols: [] };

    https.get(url, options, (response) => {
      let chunks_of_data = [];

      response.on('data', (fragments) => {
        chunks_of_data.push(fragments);
      });

      response.on('end', () => {
        let response_body = Buffer.concat(chunks_of_data);
        output.body = response_body.toString();
        output.statusCode = response.statusCode;
        resolve(output);
      });

      response.on('error', (error) => {
        output.error = error;
        reject(output);
      });
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// async function to make http request
async function GetCoingeckoMarkets(vs_currency) {
  try {
    let output = { error: null, body: null, statusCode: null, symbols: [] };
    let http_promise1 = getCoinGeckoMarkets(1, vs_currency);
    let output1 = await http_promise1;

    await sleep(1000);

    let http_promise2 = getCoinGeckoMarkets(2, vs_currency);
    let output2 = await http_promise2;

    await sleep(1000);

    if (!output1.error) {
      let j = [];
      let json = JSON.parse(output1.body);
      for (var i = 0; i < json.length; i++) {
        j = json[i];
        output.symbols.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
      }
      output.statusCode = output1.statusCode;
    }

    if (!output2.error) {
      let j = [];
      let json = JSON.parse(output2.body);
      for (var i = 0; i < json.length; i++) {
        j = json[i];
        output.symbols.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
      }
      output.statusCode = output2.statusCode;
    }

    return output;
  }
  catch (error) {
    // Promise rejected
    console.log(error);
  }
}

//app.get('/coingecko/markets/:vs_currency/:page/', (req, res) => {
//  const request = require('request');
//  const page = req.param('page');
//  const vs_currency = req.param('vs_currency');
//  let output = getCoinGeckoMarketsPage(page, vs_currency);

//  res.setHeader('Content-Type', 'application/json');
//  res.statusCode = output.statusCode;
//  if (output.error) {
//    res.end(output.error);
//  }
//  else {
//    res.end(JSON.stringify(output.symbols));
//  }
//});

app.get('/coingecko/markets/:vs_currency/', (req, res) => {
  const request = require('request');
  const vs_currency = req.param('vs_currency');

  // anonymous async function to execute some code synchronously after http request
  (async function () {
    // wait to http request to finish
    let output = await GetCoingeckoMarkets(vs_currency);

    // below code will be executed after http request is finished
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = output.statusCode;
    if (output.error) {
      res.end(output.error);
    }
    else {
      res.end(JSON.stringify(output.symbols));
    }
  })();
});

app.get('/coingecko/markets/:vs_currency/:page/', (req, res) => {
  const request = require('request');
  const page = req.param('page');
  const vs_currency = req.param('vs_currency');
  url = host_coingecko + "v3/coins/markets?vs_currency=" + vs_currency + "&order=market_cap_desc&per_page=250&page=" + page + "&sparkline=false";

  res.setHeader('Content-Type', 'application/json');
  request(url, options, (_error, _res, _body) => {
    res.statusCode = _res.statusCode;
    if (_error) {
      res.end(_error);
    }
    else {
      //res.end(JSON.stringify(_body));
      let outputArray = [];
      let j = [];
      for (var i = 0; i < _body.length; i++) {
        j = _body[i];
        outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
      }
      res.end(JSON.stringify(outputArray));
    }
  });
});

app.listen(3001)