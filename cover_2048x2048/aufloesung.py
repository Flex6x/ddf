import os
from PIL import Image

def resize_images(target_size=(600, 600)):
    # Ordner für die bearbeiteten Bilder
    output_folder = "resized_600x600"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Unterstützte Dateiformate
    valid_extensions = (".png", ".jpg", ".jpeg", ".webp")

    print(f"Starte Skalierung auf {target_size}...")

    for filename in os.listdir("."):
        if filename.lower().endswith(valid_extensions):
            try:
                with Image.open(filename) as img:
                    # Skalierung durchführen
                    # Image.Resampling.LANCZOS sorgt für hohe Qualität
                    resized_img = img.resize(target_size, Image.Resampling.LANCZOS)
                    
                    # Speichern im Unterordner
                    resized_img.save(os.path.join(output_folder, filename))
                    print(f"Erledigt: {filename}")
            except Exception as e:
                print(f"Fehler bei {filename}: {e}")

    print("\nFertig! Alle Bilder liegen im Ordner 'resized_600x600'.")

if __name__ == "__main__":
    resize_images()