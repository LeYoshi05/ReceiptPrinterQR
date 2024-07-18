const express = require('express');
const qr = require('qrcode');
const mysql = require('mysql');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const app = express();
const port = 3000;
var con;

connectToDatabase();
pushTokenToDB();

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


function connectToDatabase() {
    const loginData = fs.readFileSync('login_data.txt', 'utf8').split('\n');
    const host = loginData[0].trim();
    const user = loginData[1].trim();
    const password = loginData[2].trim();

    console.log(`Connecting to database at ${host} as user ${user}`);

    con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "qrtokens"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

function createToken() {
    token = uuidv4();
    return token;
}

function pushTokenToDB() {
    token = createToken();
    var sql = `INSERT INTO tokens (token) VALUES ('${token}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Token inserted");
    });
}