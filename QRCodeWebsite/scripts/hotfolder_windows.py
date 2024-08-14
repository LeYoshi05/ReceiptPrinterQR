import os
import time
import subprocess
from PIL import Image

# Verzeichnis für Bilder definieren
bilder_verzeichnis = "images"
irfanview_path = r"C:\Program Files\IrfanView\i_view64.exe"
printer_name = "EPSON TM-T20III Receipt"
max_width, max_height = 640, 1280

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

                if width <= max_width and height <= max_width:
                    print("Bild ist kleiner als die maximale Größe. Version 1")
                    if width > height:
                        new_width = max_width
                        new_height = int(new_width / aspect_ratio)
                    else:
                        new_height = max_width
                        new_width = int(new_height * aspect_ratio)


                elif width > max_width or height > max_width:
                    print("Bild ist größer als die maximale Größe. Version 2")
                    if width > max_width and height <= max_height:
                        new_width = max_width
                        new_height = int(new_width / aspect_ratio)
                    elif height > max_width and width <= max_height:
                        new_height = max_width
                        new_width = int(new_height * aspect_ratio)
                    else:
                        print("Bild ist größer als die maximale Größe in beiden Dimensionen. Version 3")
                        if width < height:
                            new_width = max_width
                            new_height = int(new_width / aspect_ratio)
                            if new_height > max_height:
                                new_height = max_height
                                new_width = int(new_height * aspect_ratio)
                        else:
                            new_height = max_width
                            new_width = int(new_height * aspect_ratio)
                            if new_width > max_height:
                                new_width = max_height
                                new_height = int(new_width / aspect_ratio)

            # Bild drucken
            command = [irfanview_path, bild_pfad, f"/resize=({new_width},{new_height})", f"/print={printer_name}"]
            print("DEBUG: ", " ".join(command))
            subprocess.run(command, shell=True)

            # Bilddatei löschen
            os.remove(bild_pfad)
            print(f"Bild {datei} gedruckt und gelöscht.")

    # Wartezeit bis zur nächsten Prüfung festlegen (in Sekunden)
    wartezeit = 1
    time.sleep(wartezeit)
    print("Wartezeit abgelaufen.")