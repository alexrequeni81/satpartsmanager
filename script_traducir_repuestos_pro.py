import pandas as pd
from deep_translator import GoogleTranslator
import json
import time
import random
import os

# Configuración
INPUT = "sat_repuestos.csv"
OUTPUT = "sat_repuestos_traducido.csv"
COLUMN = "DESCRIPCIÓN"
CHECKPOINT_EVERY = 50 # Guardar progreso cada X registros

langs = ["en", "fr", "it", "de"]

translators = {
    lang: GoogleTranslator(source='es', target=lang)
    for lang in langs
}

def safe_translate(text, lang):
    if not text or str(text).strip() == "_" or str(text).strip() == "":
        return text
    try:
        # Añadimos un pequeño retardo extra aleatorio para evitar detección de bots
        time.sleep(random.uniform(0.3, 0.7)) 
        return translators[lang].translate(text)
    except Exception as e:
        print(f"⚠️ Error traduciendo a {lang}: {e}")
        return text  # fallback al original

def build_json(text):
    # Convertimos a string por si viene como NaN (float) o similar
    text_str = str(text) if text is not None and not pd.isna(text) else ""
    
    # Si ya es un JSON (por ejecuciones previas), no lo volvemos a procesar
    if text_str.startswith('{"es":'):
        return text_str

    result = {"es": text_str}
    if text_str:
        print(f"Translating: {text_str[:30]}...")
    
    for lang in langs:
        result[lang] = safe_translate(text_str, lang)
    
    return json.dumps(result, ensure_ascii=False)

def run_translation():
    if os.path.exists(OUTPUT):
        print(f"🔄 Cargando progreso desde {OUTPUT}...")
        df = pd.read_csv(OUTPUT, sep=';', encoding='utf-8')
    else:
        print(f"📄 Cargando archivo original {INPUT}...")
        try:
            # Intentamos primero con utf-8
            df = pd.read_csv(INPUT, sep=';', encoding='utf-8')
        except UnicodeDecodeError:
            # Si falla, probamos con latin-1 (común en archivos CSV de Windows/Excel en español)
            df = pd.read_csv(INPUT, sep=';', encoding='latin-1')

    # Aseguramos que la columna exista
    if COLUMN not in df.columns:
        print(f"❌ Error: La columna '{COLUMN}' no existe en el CSV.")
        return

    count = 0
    total = len(df)

    for i, row in df.iterrows():
        current_val = df.at[i, COLUMN]
        
        # Si no está traducido aún (no empieza por {), lo traducimos
        if not (isinstance(current_val, str) and current_val.startswith('{"es":')):
            df.at[i, COLUMN] = build_json(current_val)
            count += 1
            
            # Guardado incremental para no perder trabajo si Google nos bloquea
            if count % CHECKPOINT_EVERY == 0:
                print(f"💾 Guardando checkpoint... ({i+1}/{total})")
                df.to_csv(OUTPUT, index=False, sep=';', encoding='utf-8')
                # Pausa larga cada checkpoint para "enfriar" la IP
                time.sleep(5)

    df.to_csv(OUTPUT, index=False, sep=';', encoding='utf-8')
    print(f"✅ Proceso completado. Total traducidos en esta sesión: {count}")

if __name__ == "__main__":
    run_translation()
