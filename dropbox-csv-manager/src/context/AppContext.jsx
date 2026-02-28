import React, { createContext, useState, useEffect } from 'react';
import { initSupabase, getSupabase } from '../services/supabaseClient';
import { translations } from '../translations';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('sb_url') || '');
    const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('sb_key') || '');
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [onlineUsersCount, setOnlineUsersCount] = useState(1);
    const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('app-lang');
        if (saved) return saved;
        const browserLang = navigator.language.split('-')[0];
        return translations[browserLang] ? browserLang : 'es';
    });

    useEffect(() => {
        if (supabaseUrl && supabaseKey) {
            verifyAndLoad(supabaseUrl, supabaseKey);
        }
    }, []);

    // Presence tracking
    useEffect(() => {
        if (!isAuthenticated) return;

        const supabase = getSupabase();
        const channel = supabase.channel('online-users');

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const count = Object.keys(state).length;
                setOnlineUsersCount(count > 0 ? count : 1);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        session: sessionId,
                        role: isAdmin ? 'admin' : 'user',
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [isAuthenticated, isAdmin, sessionId]);

    const saveConfig = (url, key) => {
        localStorage.setItem('sb_url', url);
        localStorage.setItem('sb_key', key);
        setSupabaseUrl(url);
        setSupabaseKey(key);
    };

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            localStorage.setItem('app-lang', lang);
        }
    };

    const t = (key, params = {}) => {
        const dict = translations[language] || translations.es;
        let text = dict[key] || key;

        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
        });

        return text;
    };

    const logout = () => {
        localStorage.removeItem('sb_url');
        localStorage.removeItem('sb_key');
        setSupabaseUrl('');
        setSupabaseKey('');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setData([]);
    };

    const verifyAndLoad = async (url = supabaseUrl, key = supabaseKey) => {
        setLoading(true);
        setError(null);
        try {
            const supabase = initSupabase(url, key);
            const { error: testError } = await supabase.from('repuestos').select('*').limit(1);
            if (testError) throw new Error("Connection failed");

            saveConfig(url, key);
            setIsAuthenticated(true);
            await loadData();
        } catch (err) {
            setError("Error al conectar con Supabase. Revisa tus credenciales.");
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const loginAsAdmin = (password) => {
        if (password === 'admin123') { // Contraseña sencilla por defecto
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const logoutAdmin = () => {
        setIsAdmin(false);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const supabase = getSupabase();
            let allRecords = [];
            let hasMore = true;
            let page = 0;
            const pageSize = 1000;

            while (hasMore) {
                const { data: repuestos, error: fetchError } = await supabase
                    .from('repuestos')
                    .select('*')
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (fetchError) throw fetchError;
                if (repuestos && repuestos.length > 0) {
                    allRecords = [...allRecords, ...repuestos];
                    if (repuestos.length < pageSize) hasMore = false;
                    else page++;
                } else hasMore = false;
            }

            // Procesar las descripciones para convertirlas de String JSON a Objeto si es necesario
            const processedRecords = allRecords.map(r => {
                if (r['DESCRIPCIÓN'] && typeof r['DESCRIPCIÓN'] === 'string' && r['DESCRIPCIÓN'].trim().startsWith('{')) {
                    try {
                        r['DESCRIPCIÓN'] = JSON.parse(r['DESCRIPCIÓN']);
                    } catch (e) {
                        // Si falla, lo dejamos como está
                    }
                }
                return r;
            });

            setData(processedRecords);
            if (allRecords.length > 0) {
                const allKeys = Object.keys(allRecords[0]);
                const displayCols = allKeys.filter(k => k !== 'id' && k !== 'created_at' && k !== 'estado');
                setColumns(displayCols);
            }
        } catch (err) {
            setError("Error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    const addRecord = async (recordData) => {
        setLoading(true);
        try {
            const supabase = getSupabase();
            // Si es admin, puede crear directamente aprobado. Si no, pendiente.
            const newRecord = { ...recordData, estado: isAdmin ? 'aprobado' : 'pendiente' };
            const { error: insertError } = await supabase.from('repuestos').insert([newRecord]);
            if (insertError) throw insertError;
            await loadData();
        } catch (err) {
            setError(`Error al añadir: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateRecord = async (referenciaOrig, updatedRecord) => {
        setLoading(true);
        try {
            const supabase = getSupabase();
            // Al editar, si no es admin, vuelve a 'pendiente' para revisión
            const recordToUpdate = { ...updatedRecord };
            if (!isAdmin) {
                recordToUpdate.estado = 'pendiente';
            }

            const { error: updateError } = await supabase
                .from('repuestos')
                .update(recordToUpdate)
                .eq('REFERENCIA', referenciaOrig);

            if (updateError) throw updateError;
            await loadData();
        } catch (err) {
            setError(`Error al actualizar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteRecord = async (referenciaOrig) => {
        // Solo el administrador debería poder borrar físicamente según el flujo de seguridad propuesto
        if (!isAdmin) {
            setError("Solo el administrador puede eliminar registros.");
            return;
        }
        setLoading(true);
        try {
            const supabase = getSupabase();
            const { error: deleteError } = await supabase
                .from('repuestos')
                .delete()
                .eq('REFERENCIA', referenciaOrig);

            if (deleteError) throw deleteError;
            await loadData();
        } catch (err) {
            setError(`Error al eliminar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const approveRecord = async (referencia) => {
        if (!isAdmin) return;
        setLoading(true);
        try {
            const supabase = getSupabase();
            const { error } = await supabase
                .from('repuestos')
                .update({ estado: 'aprobado' })
                .eq('REFERENCIA', referencia);
            if (error) throw error;
            await loadData();
        } catch (err) {
            setError(`Error al aprobar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const rejectRecord = async (referencia, row) => {
        if (!isAdmin) return;
        // Si el registro fue añadido nuevo y rechazado, lo borramos.
        // Si era una edición de uno existente... el flujo actual sobreescribe el original, 
        // lo que dificulta "revertir" sin historial. 
        // Para simplificar, "Rechazar" aquí simplemente borra el registro si es nuevo o lo mantiene en pendiente.
        // Como no tenemos historial de cambios, si un admin "Rechaza" una edición, 
        // probablemente quiera borrarlo o contactar al usuario.
        // Implementamos borrado por ahora para la demo.
        await deleteRecord(referencia);
    };

    return (
        <AppContext.Provider value={{
            supabaseUrl, supabaseKey, data, columns, loading, error, isAuthenticated, isAdmin, onlineUsersCount,
            language, t, changeLanguage,
            verifyAndLoad, logout, addRecord, updateRecord, deleteRecord, loadData,
            loginAsAdmin, logoutAdmin, approveRecord, rejectRecord
        }}>
            {children}
        </AppContext.Provider>
    );
};
