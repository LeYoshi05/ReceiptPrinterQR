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

key = "Hello, World!"
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



const print_app = express();
const print_port = 4242;
print_app.get('/', (req, res) => {
            const html = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <link rel="icon" type="image/x-icon" href="/favicon.ico">
                    </head>
                    <body>
                        <p id="p1">Hello World!</p>

                        <script>
                            const queryString = window.location.search;
                            console.log(queryString);
                            const urlParams = new URLSearchParams(queryString);

                            const key = urlParams.get('key')
                            document.getElementById("p1").innerHTML = key;
                        </script>
                    </body>
                </html>
            `;
            res.send(html);
        });
print_app.use('/favicon.ico', express.static('favicon.ico'));
print_app.listen(print_port, () => {
    console.log(`print server is running on http://localhost:${print_port}`);
});


const interval = setInterval(async function() {
    pushTokenToDB();
    new_key = await getNewestToken();
    console.log(new_key);
    url = `localhost:4242?key=${new_key}`
  }, 5000);

function getNewestToken() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT token FROM tokens ORDER BY time_created DESC LIMIT 1";
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result[0].token);
                } else {
                    resolve(null);
                }
            }
        });
    });
}


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