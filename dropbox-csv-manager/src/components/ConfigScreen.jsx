import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Database, KeyRound, Loader2 } from 'lucide-react';

const ConfigScreen = () => {
    const { verifyAndLoad, loading, error } = useContext(AppContext);
    const [localUrl, setLocalUrl] = useState('');
    const [localKey, setLocalKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyAndLoad(localUrl, localKey);
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                <Database size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>SAT - Repuestos</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Configura tu acceso a Supabase para cargar la base de datos de repuestos.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                            <Database size={18} /> Supabase Project URL
                        </label>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="https://xxxxx.supabase.co"
                            value={localUrl}
                            onChange={(e) => setLocalUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                            <KeyRound size={18} /> Supabase Anon Key
                        </label>
                        <input
                            type="password"
                            className="glass-input"
                            placeholder="eyJhbG..."
                            value={localKey}
                            onChange={(e) => setLocalKey(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

                    <button type="submit" className="glass-button primary" style={{ justifyContent: 'center', padding: '1rem' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Conectar y Cargar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfigScreen;
