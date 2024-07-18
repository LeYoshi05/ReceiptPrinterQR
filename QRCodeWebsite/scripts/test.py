import os
import time
import subprocess
from pathlib import Path

while True:
  # Verzeichnis für Bilder definieren
  bilder_verzeichnis = "images"

  # Liste aller Dateien im Verzeichnis erhalten
  dateien = None

  if not Path(bilder_verzeichnis).is_dir():
    os.mkdir(bilder_verzeichnis)

  dateien = os.listdir(bilder_verzeichnis)
  

  # Prüfen, ob Bilder im Verzeichnis vorhanden sind
  if len(dateien) > 0:
    # Jedes Bild im Verzeichnis drucken und löschen
    for datei in dateien:
      bild_pfad = os.path.join(bilder_verzeichnis, datei)
      subprocess.run(["lpr", "-P", "EPSON_TM-T20III", "-o", "page-left=0", bild_pfad])
      os.remove(bild_pfad)
      print(f"Bild {datei} gedruckt und gelöscht.")

  # Wartezeit bis zur nächsten Prüfung festlegen (in Sekunden)
  wartezeit = 1
  time.sleep(wartezeit)
  print("hihi")
