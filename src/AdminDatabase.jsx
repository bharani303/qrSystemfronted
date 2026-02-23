import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const DB_PASSWORD = '3241';
const SESSION_KEY_DB = 'holi_admin_db_auth';

/* ══════════════════════════════════════
   SVG ICONS
══════════════════════════════════════ */
/* Lock & Eye icons for login screen */
const IconLock = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 9V7a2 2 0 114 0v2" />
    </svg>
);
const IconEye = ({ show }) => show ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const IconDatabase = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="9" ry="3" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4" />
    </svg>
);
const IconRefresh = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);
const IconUsers = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconTicket = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
);
const IconCash = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconSearch = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const IconChevronLeft = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const IconChevronRight = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

/* ══════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════ */
function LoginScreen({ onSuccess }) {
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const handleLogin = useCallback(() => {
        if (password === DB_PASSWORD) {
            onSuccess();
        } else {
            setError('Wrong password ❌');
            setShake(true);
            setTimeout(() => { setShake(false); setPassword(''); setError(''); }, 700);
        }
    }, [password, onSuccess]);

    return (
        <>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <div className="holi-bg min-h-screen w-full flex items-center justify-center p-4"
                style={{ fontFamily: "'Inter', sans-serif" }}>

                {/* Background blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#6366f1,transparent)' }} />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#8b5cf6,transparent)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#ffe066,transparent)' }} />
                </div>

                <div className="glass-card relative w-full max-w-sm rounded-3xl p-8 fade-in-up text-center"
                    style={{ opacity: 0 }}>

                    {/* Icon */}
                    <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center float-anim text-white"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}>
                        <IconLock />
                    </div>

                    <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">🎨 Leo Holi 2026</p>
                    <h1 className="text-white text-2xl font-black mb-1">Database Access</h1>
                    <p className="text-white/50 text-sm mb-8">Enter password to view ticket database</p>

                    {/* Password input */}
                    <div className={`mb-4 ${shake ? 'shake-anim' : ''}`}>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-white/50 pointer-events-none z-10">
                                <IconLock />
                            </div>
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Enter Password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                className="w-full pl-12 pr-12 py-3.5 rounded-2xl font-medium text-white outline-none transition-all duration-200 placeholder-white/30"
                                style={{
                                    background: error ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.1)',
                                    border: error ? '1.5px solid rgba(239,68,68,0.6)' : '1.5px solid rgba(255,255,255,0.2)',
                                }}
                            />
                            <button
                                onClick={() => setShowPass(s => !s)}
                                className="absolute right-4 text-white/50 hover:text-white transition-colors z-10"
                            >
                                <IconEye show={showPass} />
                            </button>
                        </div>
                        {error && <p className="text-red-300 text-sm mt-2 font-semibold">{error}</p>}
                    </div>

                    {/* Login button */}
                    <button
                        onClick={handleLogin}
                        className="verify-btn w-full py-3.5 rounded-2xl font-black text-white text-base tracking-wide"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 6px 24px rgba(99,102,241,0.5)',
                        }}>
                        Login →
                    </button>

                    <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                        <p className="text-white/25 text-xs">Authorised personnel only</p>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ══════════════════════════════════════
   STAT CARD
══════════════════════════════════════ */
function StatCard({ icon, label, value, gradient, loading }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: gradient }}
            >
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                {loading ? (
                    <div className="h-6 w-20 rounded-lg bg-gray-200 animate-pulse mt-1" />
                ) : (
                    <p className="text-2xl font-black text-gray-800 leading-tight">{value}</p>
                )}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   LOADING SKELETON ROWS
══════════════════════════════════════ */
function SkeletonRow() {
    return (
        <tr>
            {[...Array(7)].map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 rounded-lg bg-gray-200 animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                </td>
            ))}
        </tr>
    );
}

/* ══════════════════════════════════════
   MAIN PAGE (password-gated)
══════════════════════════════════════ */
export default function AdminDatabase() {
    // ── Auth gate ──
    const [authed, setAuthed] = useState(
        () => sessionStorage.getItem(SESSION_KEY_DB) === 'true'
    );

    // ── Data state (always declared — hooks must never be conditional) ──
    const [tickets, setTickets] = useState([]);
    const [totalAmount, setTotalAmount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalLoading, setTotalLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage] = useState(1);
    const rowsPerPage = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('https://leo-qr-system.onrender.com/leoholi/database');
            setTickets(Array.isArray(res.data) ? res.data : []);
        } catch {
            setError('Failed to load data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTotal = useCallback(async () => {
        setTotalLoading(true);
        try {
            const res = await axios.get('https://leo-qr-system.onrender.com/total');
            setTotalAmount(res.data);
        } catch {
            setTotalAmount('N/A');
        } finally {
            setTotalLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authed) {
            fetchData();
            fetchTotal();
        }
    }, [authed, fetchData, fetchTotal]);

    // ── Show login if not authenticated ──
    if (!authed) return (
        <LoginScreen onSuccess={() => {
            sessionStorage.setItem(SESSION_KEY_DB, 'true');
            setAuthed(true);
        }} />
    );

    // Filter by search
    const filtered = tickets.filter(t =>
        [t.name, t.email, t.phoneno, String(t.id)].some(
            v => v && v.toLowerCase().includes(search.toLowerCase())
        )
    );

    // Pagination slice (UI only — no page changing logic needed)
    const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

    // Stats
    const totalTickets = tickets.reduce((sum, t) => sum + (Number(t.tickets) || 0), 0);

    return (
        <div className="min-h-screen" style={{ background: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>

            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* ── PAGE HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
                            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                        >
                            <IconDatabase />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-none">Database</h1>
                            <p className="text-sm text-gray-400 font-medium mt-0.5">Leo Holi 2026 · Ticket Registry</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { fetchData(); fetchTotal(); }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                    >
                        <IconRefresh />
                        Refresh
                    </button>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={<IconUsers />}
                        label="Total Registrations"
                        value={loading ? '—' : tickets.length.toLocaleString()}
                        gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                        loading={loading}
                    />
                    <StatCard
                        icon={<IconTicket />}
                        label="Total Tickets"
                        value={loading ? '—' : totalTickets.toLocaleString()}
                        gradient="linear-gradient(135deg,#ec4899,#f97316)"
                        loading={loading}
                    />
                    <StatCard
                        icon={<IconCash />}
                        label="Total Amount Collected"
                        value={totalLoading ? '—' : (totalAmount !== null ? `₹${totalAmount}` : 'N/A')}
                        gradient="linear-gradient(135deg,#10b981,#059669)"
                        loading={totalLoading}
                    />
                </div>

                {/* ── TABLE CARD ── */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">

                    {/* Card header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">All Tickets</h2>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {loading ? 'Loading…' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''} found`}
                            </p>
                        </div>

                        {/* Search bar */}
                        <div className="relative w-full sm:w-72">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <IconSearch />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, ID…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: '#f9fafb' }}>
                                    {['ID', 'Name', 'Email', 'Phone No', 'Tickets', 'Amount', 'Actions'].map(h => (
                                        <th
                                            key={h}
                                            className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">

                                {/* Loading state */}
                                {loading && [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}

                                {/* Empty state */}
                                {!loading && filtered.length === 0 && !error && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="text-5xl">🎟️</span>
                                                <p className="text-gray-500 font-semibold text-base">No tickets found</p>
                                                <p className="text-gray-400 text-sm">
                                                    {search ? 'Try a different search term.' : 'No records in the database yet.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Data rows */}
                                {!loading && paginated.map((row, idx) => (
                                    <tr
                                        key={row.id ?? idx}
                                        className="transition-colors duration-150 hover:bg-indigo-50/40"
                                    >
                                        {/* ID */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                                                #{row.id}
                                            </span>
                                        </td>

                                        {/* Name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                    style={{ background: `hsl(${((row.id ?? idx) * 47) % 360}, 65%, 55%)` }}
                                                >
                                                    {row.name ? row.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <span className="font-semibold text-gray-800">{row.name || '—'}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-gray-500">{row.email || '—'}</td>

                                        {/* Phone */}
                                        <td className="px-6 py-4 font-mono text-gray-600">{row.phoneno || '—'}</td>

                                        {/* Tickets */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.tickets > 0
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-600'
                                                }`}>
                                                {row.tickets > 0 ? `✅ ${row.tickets}` : '❌ Used'}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-800">
                                                {row.amount ? `₹${row.amount}` : '—'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <a
                                                href={`/${row.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
                                                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                                            >
                                                👁️ View
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── PAGINATION FOOTER (UI only) ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
                        <p className="text-sm text-gray-400">
                            Showing <span className="font-semibold text-gray-600">{Math.min((currentPage - 1) * rowsPerPage + 1, filtered.length)}</span>–
                            <span className="font-semibold text-gray-600">{Math.min(currentPage * rowsPerPage, filtered.length)}</span> of{' '}
                            <span className="font-semibold text-gray-600">{filtered.length}</span> records
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                disabled
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                            >
                                <IconChevronLeft />
                            </button>
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                                <button
                                    key={i}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${i + 1 === currentPage
                                        ? 'text-white shadow-sm'
                                        : 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-100'
                                        }`}
                                    style={i + 1 === currentPage ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-100 transition-colors"
                            >
                                <IconChevronRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 pb-4">
                    Powered by <span className="font-semibold text-gray-500">Leo Holi 2026 · Admin System</span> &nbsp;·&nbsp; Developed by <span className="font-semibold text-gray-500">Bharani</span> 💜
                </p>
            </div>
        </div>
    );
}
