const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const https = require('https');
const fs = require('fs');
const port = 443;

const authPath = '/static/auth/auth.html';

app.disable('x-powered-by');
app.set('port', port);
app.disable('x-powered-by');
app.set('port', port);
app.use(cors());

const checkHeaders = function(request, response, next) {
  request.app.isXml = false;
  const isFrontDoor =
    request.headers['x-caller'] && request.headers['x-caller'].toLowerCase() === 'fd';

  if (isFrontDoor) {
    const isFDxml =
      request.headers['x-fd-accept'] && request.headers['x-fd-accept'].includes('application/xml');
    request.app.isXml = isFDxml;
  }

  next();
};
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', checkHeaders, function(request, response) {
  if (request.app.isXml) {
    console.log('Front door request - setting content to text/fdxml');
    response.set('Content-Type', 'text/fdxml');
  }
  // response.header('Access-Control-Allow-Origin', '*');
  console.log(`request path: ${request.path}`);
  if (request.path.toLowerCase() === authPath) {
    response.sendFile(path.join(__dirname, 'build', authPath));
  } else {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});

https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    app
  )
  .listen(port, function() {
    console.log(`Devserver started on port ${port}`);
  });
