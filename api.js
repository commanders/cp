// api.js
const http = require('http');
const port = 3001;

const request = require('request');
let url = "https://data-api.binance.vision/api/v3/ticker/24hr";
let options = { json: true };

const server = http.createServer((req, res) =>
{
  res.setHeader('Content-Type', 'application/json');
  request(url, options, (error, res, body) => {
    if (error) {
      console.log(error)
    };

    if (!error && res.statusCode == 200) {
      console.log(body);
      res.end(body);
    };
  });
  
  /*res.end(JSON.stringify({ message: 'Node.js API' }));*/
});
server.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});