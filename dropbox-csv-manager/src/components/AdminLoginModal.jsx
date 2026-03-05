import React, { useState, useContext } from 'react';
import { X, Lock, Mail, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const AdminLoginModal = ({ isOpen, onClose }) => {
    const { loginAsAdmin } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const success = await loginAsAdmin(email, password);
        if (success) {
            onClose();
        } else {
            setError('Credenciales incorrectas o acceso denegado.');
        }
        setLoading(false);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1.5rem', marginRight: '-1.5rem' }}>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem' }}>
                        <Lock size={32} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Acceso Superusuario</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Inicie sesión para validar cambios pendientes</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem', textAlign: 'left' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>EMAIL</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="glass-input"
                                style={{ paddingLeft: '3rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@ejemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>CONTRASEÑA</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="glass-input"
                                style={{ paddingLeft: '3rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#ef4444', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="glass-button primary"
                        disabled={loading}
                        style={{ height: '52px', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 600 }}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar como Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
