import os
from PIL import Image

def resize_image(image_path):
    # Bild laden
    try:
        with Image.open(image_path) as img:
            # Dateiname und Endung trennen
            base_name = os.path.splitext(image_path)[0]
            extension = os.path.splitext(image_path)[1]
            
            # Die gewünschten Zielgrößen
            sizes = [512, 192]
            
            for size in sizes:
                # Bild skalieren (LANCZOS sorgt für hohe Qualität)
                resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
                
                # Speichern im gleichen Ordner mit Größenangabe im Namen
                new_filename = f"{base_name}_{size}px{extension}"
                resized_img.save(new_filename)
                print(f"Gespeichert: {new_filename}")
                
    except Exception as e:
        print(f"Fehler beim Bearbeiten von {image_path}: {e}")

# Beispielaufruf (ersetze 'dein_bild.jpg' mit deinem Dateinamen)
resize_image("logo.jpg")