# ReceiptPrinterQR
This repo includes all of the code used to allow people to connect to a receipt printer wirelessly.
A QR code with a link and a random token is generated every 5 minutes and displayed on a website.
The QR code redirects the user to a website that allows the user to choose a file to print, which is then sent to the printer for printing.


## Setup:
- Own an Epson TM-T20III thermal receipt printer (or similar, not tested.)
- Change the URL in index.js to your own url
- install NodeJS
- install Python 3
- run npm install in the QRCodeWebsite folder
- run pip install -r requirements.txt in the QRCodeWebsite folder

## Usage:
- Open a terminal in the QRCodeWebsite folder
- Start hotfolder.py or hotfolder_windows.py using python /scripts/hotfolder(_windows).py
- run docker-compose up
- Start index.js using node index.js


### Basic technical drawing
![Skizze](https://github.com/LeYoshi05/ReceiptPrinterQR/blob/main/photo_2024-07-16_18-17-20.jpg)
