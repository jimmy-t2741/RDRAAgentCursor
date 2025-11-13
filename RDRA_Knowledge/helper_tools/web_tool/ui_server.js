const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const SERVER_ROOT = __dirname;
const HTML_PATH = path.join(SERVER_ROOT, 'ui.html');
const ACTOR_HTML_PATH = path.join(SERVER_ROOT, 'actorUI.html');
const UI_JSON_PATH = path.join(SERVER_ROOT, '../../../2_RDRASpec/ui.json');
const ACTOR_UI_JSON_PATH = path.join(SERVER_ROOT, '../../../2_RDRASpec/actor_ui.json');
const LOGICAL_DATA_PATH = path.join(SERVER_ROOT, '../../../2_RDRASpec/論理データ.tsv');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const serveFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
};

const readJsonFile = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 500, { error: 'JSONファイル読み込みエラー', details: err.message });
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    serveFile(res, HTML_PATH, 'text/html; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && (req.url === '/actor-ui' || req.url === '/actor-ui.html' || req.url === '/actor-ui/' || req.url === '/actor-ui/index.html')) {
    serveFile(res, ACTOR_HTML_PATH, 'text/html; charset=utf-8');
    return;
  }

    if (req.method === 'GET' && req.url === '/2_RDRASpec/actor_ui.json') {
    serveFile(res, ACTOR_UI_JSON_PATH, 'application/json; charset=utf-8');
    return;
  }

if (req.method === 'GET' && req.url === '/api/ui') {
    readJsonFile(res, UI_JSON_PATH);
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/actor-ui')) {
    readJsonFile(res, ACTOR_UI_JSON_PATH);
    return;
  }

  if (req.method === 'POST' && req.url === '/api/ui') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        fs.writeFile(UI_JSON_PATH, JSON.stringify(json, null, 2), (err) => {
          if (err) {
            sendJson(res, 500, { error: 'ファイル保存エラー', details: err.message });
            return;
          }
          sendJson(res, 200, { status: '保存成功' });
        });
      } catch (error) {
        sendJson(res, 400, { error: 'JSONパースエラー', details: error.message });
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/entities') {
    fs.readFile(LOGICAL_DATA_PATH, 'utf8', (err, data) => {
      if (err) {
        sendJson(res, 500, { error: '論理データファイル読み込みエラー', details: err.message });
        return;
      }

      const lines = data.split('\n');
      const entities = new Set();

      for (let i = 1; i < lines.length; i += 1) {
        const line = lines[i].trim();
        if (!line) continue;
        const [entity] = line.split('\t');
        if (entity) {
          entities.add(entity);
        }
      }

      sendJson(res, 200, Array.from(entities).sort());
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/shutdown') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ message: 'サーバーをシャットダウンします' }), 'utf-8');
    console.log('シャットダウンリクエストを受信しました。サーバーを終了します...');
    setTimeout(() => {
      server.close(() => {
        console.log('サーバーが正常に終了しました。');
        process.exit(0);
      });
    }, 100);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`ポート${PORT}は既に使用されています。`);
    console.error('既存のサーバーが起動している可能性があります。');
    process.exit(1);
  } else {
    console.error('サーバーエラー:', error);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  const url = `http://localhost:${PORT}/`;
  console.log(`Opening browser to ${url}`);

  if (process.platform === 'win32') {
    exec(`start ${url}`);
  } else if (process.platform === 'darwin') {
    exec(`open ${url}`);
  } else {
    exec(`xdg-open ${url}`);
  }
});




