/**
 * Script de utilidad para transformar una muestra de registros al nuevo formato JSON multilingüe.
 * Nota: En un entorno real, esto llamaría a una API de traducción (DeepL/Google).
 * Para este Trial, usaremos una lógica de mapeo de términos técnicos comunes.
 */

const technicalTerms = {
    "filtro": { es: "Filtro", en: "Filter", fr: "Filtre", it: "Filtro", de: "Filter" },
    "aceite": { es: "aceite", en: "oil", fr: "huile", it: "olio", de: "Öl" },
    "aire": { es: "aire", en: "air", fr: "air", it: "aria", de: "Luft" },
    "bomba": { es: "Bomba", en: "Pump", fr: "Pompe", it: "Pompa", de: "Pumpe" },
    "motor": { es: "Motor", en: "Motor", fr: "Moteur", it: "Motore", de: "Motor" },
    "junta": { es: "Junta", en: "Gasket", fr: "Joint", it: "Guarnizione", de: "Dichtung" },
    "tornillo": { es: "Tornillo", en: "Screw", fr: "Vis", it: "Vite", de: "Schraube" },
    "tuerca": { es: "Tuerca", en: "Nut", fr: "Écrou", it: "Dado", de: "Mutter" },
    "manguera": { es: "Manguera", en: "Hose", fr: "Tuyau", it: "Tubo flessibile", de: "Schlauch" },
    "valvula": { es: "Válvula", en: "Valve", fr: "Vanne", it: "Valvola", de: "Ventil" },
    "rodamiento": { es: "Rodamiento", en: "Bearing", fr: "Roulement", it: "Cuscinetto", de: "Lager" }
};

function translateTechnical(text) {
    if (!text) return { es: "", en: "", fr: "", it: "", de: "" };

    const lower = text.toLowerCase();
    const result = { es: text, en: text, fr: text, it: text, de: text };

    // Intentamos traducir términos clave encontrados
    Object.keys(technicalTerms).forEach(key => {
        if (lower.includes(key)) {
            const terms = technicalTerms[key];
            Object.keys(terms).forEach(lang => {
                if (lang !== 'es') {
                    result[lang] = result[lang].replace(new RegExp(key, 'gi'), terms[lang]);
                }
            });
        }
    });

    return result;
}

// Ejemplo de uso para el trial (esto se vería reflejado en Supabase al ejecutar una migración real)
// console.log(JSON.stringify(translateTechnical("Filtro de aceite motor"), null, 2));
