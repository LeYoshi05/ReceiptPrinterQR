import os
import time
import subprocess

while True:
  # Verzeichnis für Bilder definieren
  bilder_verzeichnis = "images"

  # Liste aller Dateien im Verzeichnis erhalten
  dateien = os.listdir(bilder_verzeichnis)

  # Prüfen, ob Bilder im Verzeichnis vorhanden sind
  if len(dateien) > 0:
    # Jedes Bild im Verzeichnis drucken und löschen
    for datei in dateien:
      bild_pfad = os.path.join(bilder_verzeichnis, datei)
      os.startfile(bild_pfad, "print")
      os.remove(bild_pfad)
      print(f"Bild {datei} gedruckt und gelöscht.")

  # Wartezeit bis zur nächsten Prüfung festlegen (in Sekunden)
  wartezeit = 1
  time.sleep(wartezeit)
  print("Wartezeit abgelaufen.")
