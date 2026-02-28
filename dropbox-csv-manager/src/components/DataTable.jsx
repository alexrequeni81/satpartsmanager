import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, Plus, Edit2, Trash2, LogOut, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, Key, Check, X, ShieldAlert, Users, Database, Activity } from 'lucide-react';
import RecordModal from './RecordModal';
import AdminLoginModal from './AdminLoginModal';
import logo from '../assets/logo.png';

const DataTable = () => {
    const {
        data, columns, loading, logout, addRecord, updateRecord, deleteRecord, loadData,
        isAdmin, loginAsAdmin, logoutAdmin, approveRecord, rejectRecord, onlineUsersCount, t
    } = useContext(AppContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [showOnlyPending, setShowOnlyPending] = useState(false);

    const pendingCount = useMemo(() => data.filter(r => r.estado === 'pendiente').length, [data]);

    // Activar filtro de pendientes al entrar como admin
    useEffect(() => {
        if (isAdmin) {
            setShowOnlyPending(true);
        } else {
            setShowOnlyPending(false);
        }
    }, [isAdmin]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Búsqueda hipereficiente + Filtro de Pendientes
    const filteredData = useMemo(() => {
        let result = data;

        if (showOnlyPending) {
            result = result.filter(row => row.estado === 'pendiente');
        }

        if (!searchTerm.trim()) return result;

        const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
        return result.filter(row => {
            // Buscador inteligente: busca en todos los campos y en todas las versiones del idioma si es JSON
            const valuesToSearch = Object.entries(row).flatMap(([key, val]) => {
                if (key === 'DESCRIPCIÓN' && typeof val === 'object' && val !== null) {
                    return Object.values(val);
                }
                return [val];
            });

            const rowValuesString = valuesToSearch.join(' ').toLowerCase();
            return searchWords.every(word => rowValuesString.includes(word));
        });
    }, [data, searchTerm, showOnlyPending]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, data]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage]);

    const toggleRow = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleAdd = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (referencia) => {
        if (window.confirm(t('confirmDelete'))) {
            await deleteRecord(referencia);
        }
    };

    const handleSave = async (recordData) => {
        if (editingRecord && editingRecord.REFERENCIA) {
            await updateRecord(editingRecord.REFERENCIA, recordData);
        } else {
            await addRecord(recordData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="container animate-fade-in">
            {/* Status Banner */}
            <div className="status-banner">
                <div className="status-item" title={t('onlineUsers')}>
                    <Users size={16} />
                    <span>{onlineUsersCount}</span>
                </div>
                <div className="status-item" title={t('totalRecords')}>
                    <Database size={16} />
                    <span>{data.length}</span>
                </div>
                <div className="status-item" title={t('dbStatus')}>
                    <div className="status-dot"></div>
                </div>
            </div>

            <div className="header-stack">
                <div className="header-row">
                    <div className="brand-container">
                        <img
                            src={logo}
                            alt="SAT Logo"
                            className="app-logo"
                            onClick={() => window.location.reload()}
                            title={t('reloadApp')}
                        />
                        <h2 className="brand-title">
                            {t('appTitle')}
                        </h2>
                    </div>

                    <div className="secondary-actions">
                        <button className="glass-button" onClick={() => loadData()} disabled={loading} title={t('refresh')}>
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>

                        <button className={`glass-button ${isAdmin ? 'active' : ''}`} onClick={isAdmin ? logoutAdmin : () => setIsAdminLoginOpen(true)} title={t('adminMode')} style={{ position: 'relative' }}>
                            <Key size={18} style={{ color: isAdmin ? 'var(--primary)' : 'inherit' }} />
                            {pendingCount > 0 && <span className="notification-badge">{pendingCount}</span>}
                        </button>

                        <button className="glass-button" onClick={logout} style={{ color: 'var(--danger)' }} title={t('logout')}>
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                <div className="header-row" style={{ gap: '1rem' }}>
                    <div className="magical-search-container">
                        <Search style={{ position: 'absolute', left: '1.2rem', color: 'var(--primary)', zIndex: 10 }} size={24} />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="glass-input magical-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="glass-button primary" onClick={handleAdd} disabled={loading} style={{ height: '56px', padding: '0 1.5rem', borderRadius: '16px', fontSize: '1.1rem' }}>
                        <Plus size={22} /> <span className="responsive-hide">{t('newRecord')}</span>
                    </button>

                    {isAdmin && (
                        <button
                            className={`glass-button ${showOnlyPending ? 'active' : ''}`}
                            onClick={() => setShowOnlyPending(!showOnlyPending)}
                            style={{
                                height: '56px',
                                background: showOnlyPending ? 'var(--warning)' : 'rgba(255,255,255,0.1)',
                                color: showOnlyPending ? 'white' : 'inherit',
                                border: showOnlyPending ? '1px solid var(--warning)' : '1px solid var(--glass-border)',
                                borderRadius: '16px'
                            }}
                            title={showOnlyPending ? t('viewAllTooltip') : t('viewPendingTooltip')}
                        >
                            <ShieldAlert size={22} />
                            <span className="responsive-hide">{showOnlyPending ? t('showAll') : t('showPending')}</span>
                        </button>
                    )}
                </div>
            </div>

            {(searchTerm.trim() === '' && !showOnlyPending) ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Search size={64} style={{ opacity: 0.2, color: 'var(--primary)' }} />
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>{t('searchingTitle')}</h3>
                    <p style={{ maxWidth: '400px', margin: '0 auto' }}>
                        {t('searchingPrompt', { count: data.length })}
                    </p>
                </div>
            ) : (
                <div className="glass-panel" style={{ overflowX: 'auto', padding: '0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, minHeight: '400px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--primary)', color: 'white' }}>
                                    <th style={{ width: '40px', padding: '1rem' }}></th>
                                    {columns.map((col, i) => (
                                        <th
                                            key={col}
                                            className={i === 1 ? 'tiny-hide' : (i > 1 ? 'responsive-hide' : '')}
                                            style={{ padding: '1rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                    <th style={{ padding: '1rem', width: '120px', textAlign: 'center' }}>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            {t('noResults', { searchTerm })}
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((row) => {
                                        const isExpanded = expandedRows.has(row.REFERENCIA);
                                        const isPending = row.estado === 'pendiente';

                                        return (
                                            <React.Fragment key={row.REFERENCIA}>
                                                <tr style={{
                                                    borderBottom: isExpanded ? 'none' : '1px solid var(--glass-border)',
                                                    transition: 'background 0.2s',
                                                    opacity: isPending ? 0.7 : 1,
                                                    background: isPending ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = isPending ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.4)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = isPending ? 'rgba(245, 158, 11, 0.05)' : 'transparent'}
                                                >
                                                    <td style={{ padding: '0.5rem 1rem' }}>
                                                        <button
                                                            className="expander-btn"
                                                            onClick={() => toggleRow(row.REFERENCIA)}
                                                        >
                                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                        </button>
                                                    </td>
                                                    {columns.map((col, colIdx) => (
                                                        <td
                                                            key={col}
                                                            className={colIdx === 1 ? 'tiny-hide' : (colIdx > 1 ? 'responsive-hide' : '')}
                                                            style={{ padding: '1rem', fontSize: '0.9rem' }}
                                                        >
                                                            {colIdx === 0 && isPending ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <ShieldAlert size={14} style={{ color: 'var(--warning)' }} />
                                                                    {row[col]}
                                                                </div>
                                                            ) : (
                                                                col === 'DESCRIPCIÓN' && typeof row[col] === 'object' && row[col] !== null
                                                                    ? (row[col][language] || row[col]['es'] || '')
                                                                    : row[col]
                                                            )}
                                                        </td>
                                                    ))}
                                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        {isAdmin && isPending ? (
                                                            <>
                                                                <button onClick={() => approveRecord(row.REFERENCIA)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }} title="Aprobar">
                                                                    <Check size={20} />
                                                                </button>
                                                                <button onClick={() => rejectRecord(row.REFERENCIA, row)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="Rechazar">
                                                                    <X size={20} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleEdit(row)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }} title="Editar">
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                {isAdmin && (
                                                                    <button onClick={() => handleDelete(row.REFERENCIA)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="Eliminar">
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                        <td colSpan={columns.length + 2} className="row-details" style={{ padding: '0 1rem 1rem 3rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                {columns.map((col, i) => {
                                                                    let className = "detail-item";
                                                                    if (i === 0) className += " responsive-hide";
                                                                    if (i === 1) className += " responsive-hide tiny-show";

                                                                    return (
                                                                        <div key={col} className={className}>
                                                                            <span className="detail-label">{col}</span>
                                                                            <span className="detail-value">{row[col] || '-'}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                                <div className="detail-item">
                                                                    <span className="detail-label">{t('status')}</span>
                                                                    <span className="detail-value" style={{
                                                                        color: isPending ? 'var(--warning)' : 'var(--success)',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {isPending ? t('pendingReview') : t('approved')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Controles de Paginación */}
                    {filteredData.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.3)', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {Math.min((currentPage - 1) * rowsPerPage + 1, filteredData.length)}-{Math.min(currentPage * rowsPerPage, filteredData.length)} {t('of')} {filteredData.length}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                    className="glass-button"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ padding: '0.3rem', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1 }}
                                    title={t('prevPage')}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                    {t('pageOf', { current: currentPage, total: totalPages })}
                                </span>
                                <button
                                    className="glass-button"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ padding: '0.3rem', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                    title={t('nextPage')}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <RecordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                columns={columns}
                initialData={editingRecord}
                onSave={handleSave}
            />

            <AdminLoginModal
                isOpen={isAdminLoginOpen}
                onClose={() => setIsAdminLoginOpen(false)}
                onLogin={loginAsAdmin}
            />
        </div>
    );
};

export default DataTable;
