# ReceiptPrinterQR
This repo includes all of the code used to allow people to connect to a receipt printer wirelessly.
A QR code with a link and a random token is generated every 5 minutes and displayed on a website.
The QR code redirects the user to a website that allows the user to choose a file to print, which is then sent to the printer for printing.


## Setup:
- Own an Epson TM-T20III thermal receipt printer (or similar, not tested.)
- Change the URL in index.js to your own url
- 

## Usage:
- Start hotfolder.py
- run docker-compose up
- Start index.js


### Basic technical drawing
![Skizze](https://github.com/LeYoshi05/ReceiptPrinterQR/blob/main/photo_2024-07-16_18-17-20.jpg)
