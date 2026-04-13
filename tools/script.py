import urllib.request
import os

# Zielordner erstellen
os.makedirs("Drei_Fragezeichen_Cover", exist_ok=True)

for i in range(1, 239):
    num = str(i).zfill(3) # Macht aus "1" -> "001"
    url = f"https://dreimetadaten.de/data/Serie/{num}/cover.png"
    filename = f"Drei_Fragezeichen_Cover/cover_{num}.png"
    
    try:
        urllib.request.urlretrieve(url, filename)
        print(f"Lade herunter: {num}")
    except:
        print(f"Fehler bei Nummer {num}")