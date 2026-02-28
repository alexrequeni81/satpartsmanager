import React, { useState, useEffect, useContext } from 'react';
import { X, Save } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const RecordModal = ({ isOpen, onClose, columns, initialData, onSave }) => {
    const { t } = useContext(AppContext);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Empty init
            const empty = {};
            columns.forEach(col => empty[col] = '');
            setFormData(empty);
        }
    }, [initialData, columns, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{initialData ? t('editRecord') : t('newRecord')}</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    {columns.map(col => (
                        <div key={col}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{col.toUpperCase()}</label>
                            <input
                                type="text"
                                name={col}
                                value={formData[col] || ''}
                                onChange={handleChange}
                                className="glass-input"
                            />
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} className="glass-button" style={{ color: 'var(--text-muted)' }}>
                            {t('cancel')}
                        </button>
                        <button type="submit" className="glass-button primary">
                            <Save size={18} /> {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordModal;
