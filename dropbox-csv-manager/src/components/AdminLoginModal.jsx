import React, { useState, useContext } from 'react';
import { X, Lock, Key } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
    const { t } = useContext(AppContext);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = onLogin(password);
        if (success) {
            setPassword('');
            setError('');
            onClose();
        } else {
            setError(t('wrongPassword'));
        }
    };

    return (
        <div className="animate-fade-in" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                    <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
                        <Lock size={30} />
                    </div>
                    <h2 style={{ margin: 0 }}>{t('adminAccess')}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('adminPrompt')}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <div style={{ position: 'relative' }}>
                            <Key style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                            <input
                                type="password"
                                autoFocus
                                className="glass-input"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder={t('passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
                    </div>

                    <button type="submit" className="glass-button primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                        {t('login')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
