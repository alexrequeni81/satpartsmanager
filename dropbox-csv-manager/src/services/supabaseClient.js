import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
let currentUrl = null;
let currentAnonKey = null;

export const initSupabase = (url, anonKey) => {
    if (!supabaseInstance || currentUrl !== url || currentAnonKey !== anonKey) {
        supabaseInstance = createClient(url, anonKey);
        currentUrl = url;
        currentAnonKey = anonKey;
    }
    return supabaseInstance;
};

export const getSupabase = () => {
    if (!supabaseInstance) {
        throw new Error("Supabase client no está inicializado.");
    }
    return supabaseInstance;
};
