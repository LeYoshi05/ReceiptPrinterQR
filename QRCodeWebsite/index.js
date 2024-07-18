const express = require('express');
const qr = require('qrcode');
const mysql = require('mysql');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const path = require('path');



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
            const html = fs.readFileSync(path.join(__dirname, "pages/qrcode.html"));
            html.replace("{{qrCode}}", qrCode)
            res.send(html);
        }
    });
});

// define static assets
app.use('/styles.css', express.static('styles/styles.css'));
app.use('/favicon.ico', express.static('assets/favicon.ico'));

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));



const print_app = express();
const print_port = 4242;


// define static assets and configuration
print_app.use('/upload.css', express.static('styles/upload.css'));
print_app.use('/printnow.css', express.static('styles/printnow.css'));
print_app.use('/favicon.ico', express.static('assets/favicon.ico'));
print_app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit
    useTempFiles : false // store on disk, not in memory
}));

print_app.get('/', async (req, res) => {
    const key = req.query.key;

    if (await isKeyValid(key)) {
        // Serve the upload.html file
        let html = fs.readFileSync(path.join(__dirname, 'pages/upload.html'), 'utf8');
        html = html.replace('{{key}}', key);
        res.send(html);
    } else {
        res.send('Token invalid');
    }
});

print_app.post('/upload', async function(req, res, next) {
    // Was a file submitted?
    if (!req.files || !req.files.file) {
        return res.status(422).send('No files were uploaded');
    }

    const uploadedFile = req.files.file;

    // Extract the key from the referer header
    const referer = req.headers.referer;
    console.log(referer)
    const refererUrl = new URL(referer);
    const key = refererUrl.searchParams.get('key');


    console.log(refererUrl)
    console.log(key)

    // Extrahieren der Dateiendung
    const originalExtension = uploadedFile.name.split('.').pop();

    // Überprüfen der Länge der Dateiendung und Generieren des neuen Dateinamens
    const newFileName = uuidv4() + (originalExtension.length <= 5 ? '.' + originalExtension : '');

    // Verschieben der Datei mit dem neuen Dateinamen
    uploadedFile.mv('./images/' + newFileName, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        // Logik nach dem Verschieben der Datei
        console.log(`Datei wurde als ${newFileName} gespeichert.`);

        // Aktualisieren Sie die HTML-Ausgabe, um den neuen Dateinamen zu verwenden, falls erforderlich
        let html = fs.readFileSync(path.join(__dirname, 'pages/printnow.html'), 'utf8');
        html = html.replace('{{fileName}}', uploadedFile.name);
        console.log(key);
        useKey(key);
        // Serve the modified printnow.html file
        res.send(html);
    });
});

uploaded_image = null;
print_app.listen(print_port, () => console.log(`print server is running on http://localhost:${print_port}`));

const interval = setInterval(async function() {
    pushTokenToDB();
    new_key = await getNewestToken();
    console.log(new_key);
    url = `http://print.osvacneo.de:4242/?key=${new_key}`
  }, 15000);

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

async function isKeyValid(user_key){
    uses = await getKeyUses(user_key);
    if(uses > 0){
        return true;
    } else {
        return false;
    }
}

function useKey(toUse){
    console.log('using key' + toUse);
    const sql = "update tokens set uses = uses - 1 WHERE token=\'" + toUse + "\'";
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
            }
        });
}

function getKeyUses(user_key) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT uses FROM tokens WHERE token = \'" + user_key + "\'";
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                if (result.length > 0) {
                    resolve(result[0].uses);
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
        port: 3307,
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