const fs = require('fs');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

// Credenciales extraídas de final_sync.js
const supabase = createClient(
    'https://ccehnbikmzcuqceziuiy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZWhuYmlrbXpjdXFjZXppdWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTgwODMsImV4cCI6MjA4NzgzNDA4M30.4DMr75pkuLLMZBNtagNVf9DvpRN79IQ7c2KqZrtAPLM'
);

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
    "rodamiento": { es: "Rodamiento", en: "Bearing", fr: "Roulement", it: "Cuscinetto", de: "Lager" },
    "conector": { es: "Conector", en: "Connector", fr: "Connecteur", it: "Connettore", de: "Stecker" }
};

function translateTechnical(text) {
    if (!text) return { es: "", en: "", fr: "", it: "", de: "" };
    const lower = text.toLowerCase();
    const result = { es: text, en: text, fr: text, it: text, de: text };

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

async function runTrial() {
    console.log('Reading CSV...');
    const csvFile = fs.readFileSync('sat_repuestos.csv', 'utf8');
    const parsed = Papa.parse(csvFile, { header: true, skipEmptyLines: true });

    // Solo los primeros 100
    const trialBatch = parsed.data.slice(0, 100);
    console.log(`Processing ${trialBatch.length} records...`);

    for (const record of trialBatch) {
        const ref = String(record.REFERENCIA || '').trim();
        const descOriginal = String(record['DESCRIPCIÓN'] || '').trim();

        if (!ref) continue;

        const multiLangDesc = translateTechnical(descOriginal);

        // Actualizamos en Supabase
        const { error } = await supabase
            .from('repuestos')
            .update({ 'DESCRIPCIÓN': multiLangDesc })
            .eq('REFERENCIA', ref);

        if (error) {
            console.error(`Error updating ${ref}:`, error.message);
        } else {
            console.log(`Updated ${ref} with multi-language description.`);
        }
    }
    console.log('Trial completed.');
}

runTrial();
