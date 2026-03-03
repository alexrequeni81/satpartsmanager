const fs = require('fs');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

// Configuración - Usaremos los valores hardcodeados por última vez antes de pasar a .env
const SUPABASE_URL = 'https://ccehnbikmzcuqceziuiy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZWhuYmlrbXpjdXFjZXppdWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTgwODMsImV4cCI6MjA4NzgzNDA4M30.4DMr75pkuLLMZBNtagNVf9DvpRN79IQ7c2KqZrtAPLM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadInBatches() {
    console.log('📖 Leyendo archivo traducido...');
    const csvFile = fs.readFileSync('sat_repuestos_traducido.csv', 'utf8');

    const { data: records } = Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';'
    });

    console.log(`🚀 Iniciando subida de ${records.length} registros...`);

    const BATCH_SIZE = 50;
    const totalBatches = Math.ceil(records.length / BATCH_SIZE);

    for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = start + BATCH_SIZE;
        const batch = records.slice(start, end).map(r => ({
            REFERENCIA: String(r.REFERENCIA || '').trim(),
            'DESCRIPCIÓN': r['DESCRIPCIÓN'], // Ya viene como string JSON del script de Python
            'MÁQUINA': String(r['MÁQUINA'] || '').trim(),
            'GRUPO': String(r['GRUPO'] || '').trim(),
            'COMENTARIO': String(r['COMENTARIO'] || '').trim(),
            'CANTIDAD': parseFloat(r['CANTIDAD']) || 0,
            'estado': 'aprobado' // Marcar todos como aprobados por defecto
        }));

        console.log(`📦 Subiendo lote ${i + 1}/${totalBatches} (${start} a ${end})...`);

        const { error } = await supabase
            .from('repuestos')
            .upsert(batch, { onConflict: 'REFERENCIA' });

        if (error) {
            console.error(`❌ Error en el lote ${i + 1}:`, error.message);
            // Intentar reintento simple o continuar
        }
    }

    console.log('✅ ¡Sincronización completa!');
}

uploadInBatches();
