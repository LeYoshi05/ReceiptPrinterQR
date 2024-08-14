import os
import time
from PIL import Image

# Verzeichnis für Bilder definieren
bilder_verzeichnis = "images"
irfanview_path = "\"C:\\Program Files\\IrfanView\\i_view64.exe\""
printer_name = "EPSON TM-T20III Receipt"
max_width, max_height = 203, 203

while True:
    # Liste aller Dateien im Verzeichnis erhalten
    dateien = os.listdir(bilder_verzeichnis)

    # Prüfen, ob Bilder im Verzeichnis vorhanden sind
    if len(dateien) > 0:
        # Jedes Bild im Verzeichnis drucken und löschen
        for datei in dateien:
            bild_pfad = os.path.abspath(os.path.join(bilder_verzeichnis, datei))

            # Bildgröße berechnen, um das Seitenverhältnis beizubehalten
            with Image.open(bild_pfad) as img:
                width, height = img.size
                aspect_ratio = width / height

                if width > height:
                    new_width = min(max_width, width)
                    new_height = int(new_width / aspect_ratio)
                else:
                    new_height = min(max_height, height)
                    new_width = int(new_height * aspect_ratio)

            # IrfanView-Befehl ausführen
            command = f'{irfanview_path} {bild_pfad} /resize=({new_width},{new_height}) /print="{printer_name}"'
            print("DEBUG: ",command)
            os.system(command)

            # Bilddatei löschen
            os.remove(bild_pfad)
            print(f"Bild {datei} gedruckt und gelöscht.")

    # Wartezeit bis zur nächsten Prüfung festlegen (in Sekunden)
    wartezeit = 1
    time.sleep(wartezeit)
    print("Wartezeit abgelaufen.")