// api.js
const http = require('http');
const port = 3001;

const request = require('request');
let url = "https://data-api.binance.vision/api/v3/ticker/24hr";
let options = { json: true };

const server = http.createServer((req, res) =>
{
  res.setHeader('Content-Type', 'application/json');
  request(url, options, (_error, _res, _body) => {
    res.statusCode = _res.statusCode;
    if (_error) {
      res.end(_error);
    }
    else {
      let output = JSON.stringify(_body);
      //let filteredData = _body.map(({ symbol, lastPrice, priceChangePercent }) => ({
      //  s : symbol,
      //  c: lastPrice,
      //  p: priceChangePercent
      //}));
      let filteredData = _body.filter(item =>
        item.symbol.endsWith('USDT')
      );
      filteredData = filteredData.map(item => [
        item.symbol.replace('USDT', ''),
        parseFloat(item.lastPrice),
        parseFloat(item.priceChangePercent)
      ]);
      res.end(JSON.stringify(filteredData));
    }
  });
});
server.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});