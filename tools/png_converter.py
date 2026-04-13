import os
from PIL import Image

def convert_jpg_to_png(image_path):
    try:
        # Bild öffnen
        with Image.open(image_path) as img:
            # Dateiname ohne Endung extrahieren
            base_name = os.path.splitext(image_path)[0]
            
            # Als PNG speichern
            new_filename = f"{base_name}.png"
            img.save(new_filename, "PNG")
            
            print(f"Erfolgreich konvertiert: {new_filename}")
            
    except Exception as e:
        print(f"Fehler bei der Konvertierung: {e}")

# Beispielaufruf
convert_jpg_to_png("icon-512.jpg")
convert_jpg_to_png("icon-192.jpg")