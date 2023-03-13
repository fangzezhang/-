const http = require('http');
const fs = require('fs');

const readFile = function(path, res) {
  fs.readFile(path, (error, data) => {
    res.writeHead(203);
    res.end(data);
  })
};

http.createServer((req, res) => {
  console.info(req.url);
  switch(req.url) {
    case '/':
      readFile(`${__dirname}/views/index.html`, res);
      break;
    case '/index.css':
      setTimeout(() => {
        readFile(`${__dirname}/views/index.css`, res);
      }, 1000);
      break;
    case '/index.js':
      readFile(`${__dirname}/views/index.js`, res);
      break;
    case '/index2.js':
      readFile(`${__dirname}/views/index2.js`, res);
      break;
    case '/resType':
      readFile(`${__dirname}/views/index2.js`, res);
      break;
    default:
      res.end();
  }
})
  .listen(3000);
