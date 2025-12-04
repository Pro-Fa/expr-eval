// Minimal static file server for the Monaco sample (no extra deps)

const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../');
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
};

function send(res, status, body, headers = {}) {
    res.writeHead(status, {'Content-Length': Buffer.byteLength(body), ...headers});
    res.end(body);
}

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url || '/');

    if (urlPath === '/' || urlPath === '/index.html') {
        urlPath = 'samples/language-service-sample/index.html';
    } else if (urlPath === '/styles.css' || urlPath === '/app.js') {
        // Serve sample-specific files from the sample folder
        urlPath = 'samples/language-service-sample' + urlPath;
    }

    const filePath = path.join(root, urlPath);

    // OBVIOUSLY THIS IS NOT SECURE! DO NOT USE IN UNSAFE ENVIRONMENTS!
    fs.stat(filePath, (err, stat) => {
        if (err) {
            return send(res, 404, 'Not found');
        }
        if (stat.isDirectory()) {
            return send(res, 403, 'Forbidden');
        }
        const ext = path.extname(filePath).toLowerCase();
        const type = mime[ext] || 'application/octet-stream';
        fs.readFile(filePath, (err2, data) => {
            if (err2) return send(res, 500, 'Server error');
            res.writeHead(200, {'Content-Type': type, 'Content-Length': data.length});
            res.end(data);
        });
    });
});

server.listen(port, () => {
    console.log(`[expr-eval] Sample server running at http://localhost:${port}`);
});
