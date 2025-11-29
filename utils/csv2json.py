import csv
import json
import os
from math import log10, floor

# ==== CONFIGURACIÓN ====
CSV_FILE = "tema-7.csv"   # ruta al archivo CSV de entrada
OUTPUT_PREFIX = "tema-7-" # prefijo para los archivos generados
OUTPUT_DIR = "tema-7"     # carpeta donde se guardarán los archivos
# ========================

# Crear carpeta de salida si no existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Leer todas las líneas del CSV
with open(CSV_FILE, newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

# Determinar número de dígitos necesarios
n = len(rows)
if n < 10:
    digits = 1
elif n < 100:
    digits = 2
else:
    digits = 3

# Procesar cada línea y generar archivos JSON
for i, (col1, col2) in enumerate(rows, start=1):
    data = {
        "front": col1,
        "back": col2
    }

    filename = f"{OUTPUT_PREFIX}{str(i).zfill(digits)}.json"
    file_path = os.path.join(OUTPUT_DIR, filename)

    with open(file_path, "w", encoding="utf-8") as out:
        json.dump(data, out, ensure_ascii=False, indent=2)

print(f"Archivos generados en la carpeta: {OUTPUT_DIR}")
