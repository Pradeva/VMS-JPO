const http = require('http');
const fs = require('fs');
const path = require('path');
const App = require('./NVRJS'); // Sesuaikan path-nya jika perlu

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'web', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('File tidak ditemukan');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url.startsWith('/static/')) {
    // Handle requests for static assets (e.g., CSS files)
    const staticFilePath = path.join(__dirname, 'web', req.url);
    fs.readFile(staticFilePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('File tidak ditemukan');
      } else {
        // Determine the appropriate content type based on the file extension
        const fileExtension = path.extname(staticFilePath);
        let contentType = 'text/plain';

        // Update this block to handle JavaScript files
        if (fileExtension === '.css') {
          contentType = 'text/css';
        } else if (fileExtension === '.js') {
          contentType = 'application/javascript';
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url.startsWith('/static/js/')) {
    // Handle requests for JavaScript files in /static/js
    const staticJsFilePath = path.join(__dirname, 'static', 'js', path.basename(req.url));
    fs.readFile(staticJsFilePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('File tidak ditemukan');
      } else {
        // Set the content type to JavaScript
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url.startsWith('/static/css/fonts/')) {
    // Handle requests for font files in /static/css/fonts
    const fontFilePath = path.join(__dirname, 'static', 'css', 'fonts', path.basename(req.url));
    fs.readFile(fontFilePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('File tidak ditemukan');
      } else {
        // Set the appropriate content type for font files (e.g., woff, woff2, ttf)
        const fontFileExtension = path.extname(fontFilePath).substring(1);
        let fontContentType = '';

        if (fontFileExtension === 'woff') {
          fontContentType = 'application/font-woff';
        } else if (fontFileExtension === 'woff2') {
          fontContentType = 'application/font-woff2';
        } else if (fontFileExtension === 'ttf') {
          fontContentType = 'application/font-sfnt';
        }

        res.writeHead(200, { 'Content-Type': fontContentType });
        res.write(data);
        res.end();
      }
    });
  } else {
    // Handle other requests (e.g., for additional routes)
    App(req, res); // Menjalankan Express app dari NVRJS.js untuk menangani rute-rute lainnya
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
