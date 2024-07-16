const express = require('express');
const qr = require('qrcode');

const app = express();
const port = 3000;
key = "Test"
url = `https://leghast.de/qr-code?key=${key}`
app.get('/', (req, res) => {
    // Generate a random QR code
    
    qr.toDataURL(url, (err, qrCode) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            // Serve the website with the QR code and CSS stylesheet
            const html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <link rel="stylesheet" type="text/css" href="/styles.css"
                        <link rel="icon" type="image/x-icon" href="/favicon.ico">
                        <meta http-equiv="refresh" content="5">
                    </head>
                    <body>
                        <div class="head">
                            <h1>Bondruck</h1>
                        </div>
                        <div class="content">
                            <p>QR Code scannen, um etwas auf dem Bondrucker auszudrucken</p>
                        </div>
                        <div class="qr-code">
                        <img class="qrcode" src="${qrCode}" alt="QR Code">
                        </div>
                    </body>
                </html>
            `;
            res.send(html);
        }
    });
});
app.use('/styles.css', express.static('styles.css'));
app.use('/favicon.ico', express.static('favicon.ico'));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const interval = setInterval(function() {
    url = Math.floor(Math.random() * 6164697).toString();
    console.log(url);
  }, 5000);
 