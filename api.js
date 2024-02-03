// api.js
const http = require('http');
const port = 3001;
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Node.js API' }));
});
server.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});