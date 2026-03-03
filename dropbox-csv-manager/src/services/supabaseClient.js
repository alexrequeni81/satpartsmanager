import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
let currentUrl = null;
let currentAnonKey = null;

export const initSupabase = (url, anonKey) => {
    // Si no se pasan parámetros, intentar usar variables de entorno de Vite
    const sbUrl = url || import.meta.env.VITE_SUPABASE_URL;
    const sbKey = anonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!sbUrl || !sbKey) {
        console.error("Supabase credentials missing!");
        return null;
    }

    if (!supabaseInstance || currentUrl !== sbUrl || currentAnonKey !== sbKey) {
        supabaseInstance = createClient(sbUrl, sbKey);
        currentUrl = sbUrl;
        currentAnonKey = sbKey;
    }
    return supabaseInstance;
};

export const getSupabase = () => {
    if (!supabaseInstance) {
        // Intento de auto-inicialización con env vars
        return initSupabase();
    }
    return supabaseInstance;
};
