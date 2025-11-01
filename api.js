// api.js
const http = require('http');
const port = 3001;
const zlib = require('zlib');

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

      let filteredData = _body.filter(item =>
        item.symbol.endsWith('USDT')
      );
      filteredData.sort((a, b) => parseFloat(b.quoteVolume || 0) - parseFloat(a.quoteVolume || 0));
      filteredData = filteredData.slice(0, 200);  // Adjust N as needed
      filteredData = filteredData.map(item => [
        item.symbol.replace('USDT', ''),
        parseFloat(item.lastPrice),
        parseFloat(item.priceChangePercent)
      ]);

      output = JSON.stringify(filteredData);

      if (req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
        zlib.gzip(output, (err, compressed) => {
          if (err) return res.end(output);
          res.end(compressed);
        });
      }
      else {
        res.end(output);
      }
    }
  });
});
server.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});