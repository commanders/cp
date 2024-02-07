const express = require('express');
const app = express();

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
      //res.end(JSON.stringify(_body));
      let outputArray = [];
      let j = [];
      for (var i = 0; i < _body.length; i++) {
        j = _body[i];
        outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated});
      }
      res.end(JSON.stringify(outputArray));
    }
  });
});

app.get('/coingecko/markets/usd/1/', (req, res) => {
  const request = require('request');
  url = host_coingecko + "v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";

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
        outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated});
      }
      res.end(JSON.stringify(outputArray));
    }
  });
});

app.get('/coingecko/markets/usd/', (req, res) =>
{
  const data = ['1']

  let requests = data.map(item => {
    return fetch(host_coingecko + "v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${item}&sparkline=false", options);
  });

  Promise.all(requests).then((responses) =>
  {

  // Reason of using flat is, You will get array of responses like [[res1], [res2], [res3]]
  // If you want to merge those together, You can use flat()
    const data = responses[0].json();

  // do whatever you want with results
  let outputArray = [];
  let j = [];
    for (var i = 0; i < data.length; i++)
    {
  j = data[i];
  outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
  }

  res.end(JSON.stringify(outputArray));
  });
});

/*
const request = require('request');

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, { json: true }, (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

async function getCombinedData() {
    try {
        // Define your requests
        let request1 = makeRequest('http://api.example.com/data1');
        let request2 = makeRequest('http://api.example.com/data2');
        let request3 = makeRequest('http://api.example.com/data3');

        // Use Promise.all to execute all requests in parallel
        let responses = await Promise.all([request1, request2, request3]);

        // Combine the data from the responses
        let combinedData = {
            data1: responses[0],
            data2: responses[1],
            data3: responses[2]
        };

        console.log(combinedData);
    } catch (error) {
        console.error(error);
    }
}

getCombinedData();

 */

//app.get('/coingecko/markets/usd/', (req, res) => {
//  //get TOP 1000 coins valued in USD
//  //const request = require('request');
//  //const runs = 4;
//  //const sleep = async (milliseconds) =>
//  //{
//  //  await new Promise(resolve => setTimeout(resolve, milliseconds));
//  //}
//  const url1 = host_coingecko + "v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";
//  const url2 = host_coingecko + "v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false";
//  const url3 = host_coingecko + "v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=3&sparkline=false";
//  const url4 = host_coingecko + "v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=4&sparkline=false";

//  const data1 = await got(url).json();
//  //await sleep(2000);
//  const data2 = await got(url).json();
//  //await sleep(2000);
//  //const data3 = await got(url).json();
//  //await sleep(2000);
//  //const data4 = await got(url).json();
//  //await sleep(2000);
//  //let data = data1.concat(data2).concat(data3).concat(data4);
//  let data = data1.concat(data2);

//  let j = [];
//  for (var i = 0; i < data.length; i++) {
//    j = data[i];
//    outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
//  }

//  res.end(JSON.stringify(outputArray));

//  //let curr_url = "";

//  //res.setHeader('Content-Type', 'application/json');

//  //let outputArray = [];

//  //for (var i = 1; i <= runs; i++) {
//  //  curr_url = url.replace("page=1", "page=" + i.toString());
//  //  console.log('curr_url=' + curr_url);

//  //  request(url, options, (_error, _res, _body) => {
//  //    res.statusCode = _res.statusCode;
//  //    if (_error) {
//  //      console.log(_error);
//  //      res.end(_error);
//  //    }
//  //    else
//  //    {
//  //      let j = [];
//  //      for (var i = 0; i < _body.length; i++) {
//  //        j = _body[i];
//  //        outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });
//  //      }
//  //    }
//  //  });
//  //}

//  //res.end(JSON.stringify(outputArray));

//  // send request A
//  //got({uri: url})
//  //  .then((responseA) => {
//  //    // handle request A response
//  //    let j = [];
//  //    for (var i = 0; i < responseA.body _body.length; i++) {
//  //    j = _body[i];
//  //    outputArray.push({ id: j.id, symbol: j.symbol, name: j.name, current_price: j.current_price, ath: j.ath, ath_date: j.ath_date, market_cap_rank: j.market_cap_rank, last_updated: j.last_updated });

//  //    // send request B
//  //    return got({
//  //      uri: "https://httpbin.org/json"
//  //    })
//  //  })
//  //  .then((responseB) => {
//  //    // handle request B response
//  //    console.info(`${new Date().toISOString()}, responseB statusCode:`, responseB.statusCode)
//  //  })
//  //  .catch((error) => {
//  //    console.error('catch error:', error);
//  //  });

//  //got({ uri: url })
//  //.then()
//});

app.listen(3001)