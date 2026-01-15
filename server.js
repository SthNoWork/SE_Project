import http from 'http';
import handler from './api/hospital.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    if (body) {
      try { req.body = JSON.parse(body); } catch (e) { req.body = {}; }
    } else {
      req.body = {};
    }
    handler(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
