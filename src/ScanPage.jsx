import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

/* ═══════════════════════════════════════════
   INLINE SVG ICONS  (zero extra dependencies)
═══════════════════════════════════════════ */
const IconUser = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const IconMail = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const IconPhone = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const IconTicket = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconWarning = () => (
    <svg className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);
const IconX = () => (
    <svg className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IconScan = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1M4 12h1m14 0h1M6.3 6.3l.7.7M17 17l.7.7M6.3 17.7l.7-.7M17 7l.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
);

/* ═══════════════════════════════════════════
   CONFETTI  (pure CSS + JS, no deps)
═══════════════════════════════════════════ */
const CONFETTI_COLORS = ['#ff6b9d', '#ffe066', '#4ecdc4', '#a855f7', '#f97316', '#06b6d4', '#ec4899', '#fff'];

function Confetti() {
    const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        duration: `${1.8 + Math.random() * 2}s`,
        delay: `${Math.random() * 1.2}s`,
        size: `${7 + Math.random() * 8}px`,
        shape: Math.random() > 0.5 ? '50%' : '2px',
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map(p => (
                <div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: p.left,
                        backgroundColor: p.color,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        width: p.size,
                        height: p.size,
                        borderRadius: p.shape,
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════
   TICKET DETAIL CARD — GET /:id
═══════════════════════════════════════════ */
function DetailRow({ icon, label, value, delay = 0 }) {
    return (
        <div
            className="detail-row fade-in-up flex items-center gap-4 rounded-2xl px-5 py-4"
            style={{ animationDelay: `${delay}ms`, opacity: 0 }}
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'rgba(255,255,255,0.2)' }}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-0.5">{label}</p>
                <p className="text-white font-semibold truncate text-base leading-tight">{value || '—'}</p>
            </div>
        </div>
    );
}

function LoadingTicket() {
    return (
        <div className="flex flex-col items-center gap-6 py-8">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                <div className="spinner-ring absolute inset-0 rounded-full border-4 border-transparent"
                    style={{ borderTopColor: '#fff', borderRightColor: 'rgba(255,255,255,0.4)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white/80 animate-ping" />
                </div>
            </div>
            <div className="text-center">
                <p className="shimmer-text text-xl font-bold tracking-wide">Verifying Ticket…</p>
                <p className="text-white/50 text-sm mt-1">Please wait a moment</p>
            </div>
        </div>
    );
}

// ticketCount is passed as a separate live-state prop, kept in sync with parent useState
function SuccessTicket({ data, ticketCount }) {
    return (
        <div className="w-full">
            <div className="fade-in-up flex flex-col items-center gap-3 mb-8"
                style={{ animationDelay: '0ms', opacity: 0 }}>
                <div className="float-anim pulse-green w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))' }}>
                    🎟️
                </div>
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-2"
                        style={{ background: 'rgba(74,222,128,0.25)', border: '1px solid rgba(74,222,128,0.5)', color: '#86efac' }}>
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                        VALID TICKET ✓
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Welcome to Holi 2026! 🎉</h2>
                </div>
            </div>

            <div className="mb-5" style={{ height: '1px', background: 'rgba(255,255,255,0.15)' }} />

            <div className="flex flex-col gap-2">
                <DetailRow icon={<IconUser />} label="Name" value={data.name} delay={100} />
                <DetailRow icon={<IconMail />} label="Email" value={data.email} delay={200} />
                <DetailRow icon={<IconPhone />} label="Phone" value={data.phoneno} delay={300} />
                {/* ticketCount comes from parent useState — updates live on every successful scan */}
                <DetailRow icon={<IconTicket />} label="Tickets Remaining" value={ticketCount !== null ? String(ticketCount) : '—'} delay={400} />
            </div>
        </div>
    );
}

function ErrorTicket({ ticketId }) {
    return (
        <div className="fade-in-up flex flex-col items-center gap-5 py-8 text-center" style={{ opacity: 0 }}>
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(239,68,68,0.25)' }} />
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                    style={{ background: 'rgba(239,68,68,0.2)', border: '2px solid rgba(239,68,68,0.5)' }}>
                    ❌
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-black text-white mb-1">Invalid Ticket</h2>
                <p className="text-red-300 font-medium text-base">This ticket could not be verified.</p>
            </div>
            <div className="w-full rounded-2xl px-5 py-4 text-left"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-300/70 mb-1">Ticket ID</p>
                <p className="text-red-200 font-mono font-semibold text-sm break-all">{ticketId}</p>
            </div>
            <p className="text-white/40 text-sm max-w-xs">
                Please contact the event organizer if you believe this is a mistake.
            </p>
        </div>
    );
}

/* Shown inline on the card when tickets count is already 0 */
function UsedTicket({ data }) {
    return (
        <div className="fade-in-up flex flex-col items-center gap-5 py-6 text-center w-full" style={{ opacity: 0 }}>
            {/* Warning icon with pulse ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: 'rgba(234,179,8,0.2)' }} />
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl shake-anim"
                    style={{ background: 'rgba(234,179,8,0.2)', border: '2px solid rgba(234,179,8,0.6)' }}>
                    ⚠️
                </div>
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
                style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.5)', color: '#fde047' }}>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse inline-block" />
                TICKET ALREADY USED
            </div>

            <div>
                <h2 className="text-2xl font-black text-white mb-1">Entry Denied</h2>
                <p className="text-yellow-300/80 font-medium text-sm">
                    All tickets on this pass have been used.
                </p>
            </div>

            {/* Name strip */}
            <div className="w-full rounded-2xl px-5 py-4 text-left"
                style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.4)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-300/60 mb-1">Name</p>
                <p className="text-yellow-100 font-semibold text-base">{data.name}</p>
            </div>

            <p className="text-white/35 text-xs max-w-xs">
                Contact the event organizer if you believe this is an error.
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════
   ENTRY OVERLAY — full-screen result screen
═══════════════════════════════════════════ */

// ── ALLOWED (green) ──────────────────────
function OverlayAllowed({ onClose }) {
    return (
        <>
            <Confetti />
            <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #052e16ee, #14532dee, #166534ee)' }}>
                <div className="overlay-in flex flex-col items-center gap-6 text-center max-w-sm w-full">

                    {/* Animated rings */}
                    <div className="relative flex items-center justify-center w-44 h-44">
                        <div className="ring-ping absolute w-36 h-36 rounded-full"
                            style={{ border: '3px solid rgba(74,222,128,0.6)' }} />
                        <div className="ring-ping absolute w-36 h-36 rounded-full"
                            style={{ border: '3px solid rgba(74,222,128,0.4)', animationDelay: '0.5s' }} />
                        <div className="pulse-green w-36 h-36 rounded-full flex items-center justify-center text-green-400"
                            style={{ background: 'rgba(74,222,128,0.15)', border: '3px solid rgba(74,222,128,0.7)' }}>
                            <IconCheck />
                        </div>
                    </div>

                    <div>
                        <p className="text-green-300 text-sm font-bold uppercase tracking-widest mb-1">
                            Scan Complete
                        </p>
                        <h1 className="text-5xl font-black text-white leading-none mb-3">
                            ENTRY<br />ALLOWED
                        </h1>
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold text-white"
                            style={{ background: 'rgba(74,222,128,0.25)', border: '1px solid rgba(74,222,128,0.5)' }}>
                            ✅ Welcome to Leo Holi 2026
                        </div>
                    </div>

                    <p className="text-green-200/60 text-sm">
                        Ticket scanned and marked as used
                    </p>

                    <button onClick={onClose}
                        className="mt-2 px-8 py-3 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        ← Back to Details
                    </button>
                </div>
            </div>
        </>
    );
}

// ── ALREADY USED (yellow/orange) ─────────
function OverlayUsed({ onClose }) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #451a03ee, #78350fee, #92400eee)' }}>
            <div className="overlay-in flex flex-col items-center gap-6 text-center max-w-sm w-full">

                <div className="shake-anim w-36 h-36 rounded-full flex items-center justify-center text-yellow-400"
                    style={{ background: 'rgba(234,179,8,0.15)', border: '3px solid rgba(234,179,8,0.7)' }}>
                    <IconWarning />
                </div>

                <div>
                    <p className="text-yellow-300 text-sm font-bold uppercase tracking-widest mb-1">
                        Scan Failed
                    </p>
                    <h1 className="text-4xl font-black text-white leading-tight mb-3">
                        Ticket Already<br />Used ⚠️
                    </h1>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold text-white"
                        style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.5)' }}>
                        This ticket has already been scanned
                    </div>
                </div>

                <p className="text-yellow-200/60 text-sm max-w-xs">
                    Re-entry is not permitted. Contact the event manager if this is an error.
                </p>

                <button onClick={onClose}
                    className="mt-2 px-8 py-3 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    ← Back to Details
                </button>
            </div>
        </div>
    );
}

// ── INVALID QR (red) ─────────────────────
function OverlayInvalid({ onClose }) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #1c0404ee, #450a0aee, #7f1d1dee)' }}>
            <div className="overlay-in flex flex-col items-center gap-6 text-center max-w-sm w-full">

                <div className="slam-in w-36 h-36 rounded-full flex items-center justify-center text-red-400"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '3px solid rgba(239,68,68,0.7)' }}>
                    <IconX />
                </div>

                <div>
                    <p className="text-red-300 text-sm font-bold uppercase tracking-widest mb-1">
                        Verification Failed
                    </p>
                    <h1 className="text-4xl font-black text-white leading-tight mb-3">
                        Invalid<br />Ticket ❌
                    </h1>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold text-white"
                        style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)' }}>
                        QR code is not recognised
                    </div>
                </div>

                <p className="text-red-200/60 text-sm max-w-xs">
                    This ticket is invalid. Please check the QR code and try again.
                </p>

                <button onClick={onClose}
                    className="mt-2 px-8 py-3 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    ← Back to Details
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   VERIFY BUTTON SECTION  — PUT /scan/:id
═══════════════════════════════════════════ */
// onScanSuccess: callback received from ScanPage to decrement its ticketCount state
function VerifySection({ id, onScanSuccess }) {
    // 'idle' | 'loading' | 'allowed' | 'used' | 'invalid'
    const [scanState, setScanState] = useState('idle');

    const handleVerify = useCallback(async () => {
        if (scanState === 'loading') return;
        setScanState('loading');

        try {
            const res = await fetch(`https://leo-qr-system.onrender.com/scan/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            // API returns plain text strings
            const text = await res.text();
            const message = text.trim();

            if (message === 'Scanned Successfully') {
                setScanState('allowed');
                onScanSuccess(); // ← decrement the live ticket counter in parent
            } else if (message === 'TICKET USED') {
                setScanState('used');
            } else {
                // "Invalid QR ID" or any other failure
                setScanState('invalid');
            }
        } catch {
            setScanState('invalid');
        }
    }, [id, scanState, onScanSuccess]);

    const closeOverlay = () => setScanState('idle');

    return (
        <>
            {/* ─── Full-screen overlay based on result ─── */}
            {scanState === 'allowed' && <OverlayAllowed onClose={closeOverlay} />}
            {scanState === 'used' && <OverlayUsed onClose={closeOverlay} />}
            {scanState === 'invalid' && <OverlayInvalid onClose={closeOverlay} />}

            {/* ─── Verify card ─── */}
            <div className="glass-card rounded-3xl p-6 mt-4 fade-in-up" style={{ opacity: 0, animationDelay: '500ms' }}>

                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{ background: 'rgba(255,255,255,0.18)' }}>
                        <IconScan />
                    </div>
                    <div>
                        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Admin Panel</p>
                        <h3 className="text-white font-black text-lg leading-none">Entry Verification</h3>
                    </div>
                </div>

                {/* Divider */}
                <div className="mb-5" style={{ height: '1px', background: 'rgba(255,255,255,0.15)' }} />

                {/* Info strip */}
                <div className="flex items-start gap-3 rounded-2xl p-4 mb-5"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <span className="text-yellow-300 text-lg mt-0.5">⚡</span>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Clicking the button below will mark this ticket as <span className="text-white font-semibold">used</span> and
                        grant entry. This action <span className="text-red-300 font-semibold">cannot be undone</span>.
                    </p>
                </div>

                {/* Verify button */}
                <button
                    id="verify-entry-btn"
                    onClick={handleVerify}
                    disabled={scanState === 'loading'}
                    className="verify-btn w-full py-4 rounded-2xl font-black text-white text-lg tracking-wide"
                    style={{
                        background: scanState === 'loading'
                            ? 'rgba(255,255,255,0.2)'
                            : 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)',
                        boxShadow: scanState === 'loading' ? 'none' : '0 6px 24px rgba(34,197,94,0.5)',
                    }}
                >
                    {scanState === 'loading' ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="spinner-ring inline-block w-5 h-5 rounded-full border-2 border-white/30"
                                style={{ borderTopColor: '#fff' }} />
                            Verifying…
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-3">
                            <span className="text-2xl">✅</span>
                            Verify &amp; Allow Entry
                        </span>
                    )}
                </button>

                {/* BookMyShow-style stamp */}
                <p className="text-center text-white/30 text-xs mt-4">
                    Powered by <span className="text-white/50 font-semibold">Leo Holi 2026</span> · Entry Gate System
                </p>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function ScanPage() {
    const { id } = useParams();
    const [fetchState, setFetchState] = useState('loading'); // 'loading' | 'success' | 'error'
    const [ticketData, setTicketData] = useState(null);
    // Live ticket count — initialised from API data, decremented on each successful scan
    const [ticketCount, setTicketCount] = useState(null);

    useEffect(() => {
        if (!id) { setFetchState('error'); return; }

        const controller = new AbortController();

        (async () => {
            try {
                setFetchState('loading');
                const res = await fetch(`https://leo-qr-system.onrender.com/${id}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error('Not found');
                const data = await res.json();
                setTicketData(data);
                // Seed the live counter from the API value
                setTicketCount(data.tickets !== undefined ? Number(data.tickets) : null);
                setFetchState('success');
            } catch (err) {
                if (err.name === 'AbortError') return;
                setFetchState('error');
            }
        })();

        return () => controller.abort();
    }, [id]);

    // Called by VerifySection after a successful PUT — decrements the displayed count
    const handleScanSuccess = useCallback(() => {
        setTicketCount(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, []);

    return (
        <>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <div className="holi-bg min-h-screen w-full flex items-start justify-center p-4 py-10"
                style={{ fontFamily: "'Inter', sans-serif" }}>

                {/* Background blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#ff6b9d,transparent)' }} />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#ffe066,transparent)' }} />
                </div>

                {/* Content column */}
                <div className="relative w-full max-w-md flex flex-col gap-0">

                    {/* ── TICKET DETAILS CARD ── */}
                    <div className="glass-card rounded-3xl p-8 fade-in-up" style={{ opacity: 0 }}>

                        {/* Branding */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Event Pass</p>
                                <h1 className="text-white text-xl font-black tracking-tight leading-none">🎨 Leo Holi 2026</h1>
                            </div>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                style={{ background: 'rgba(255,255,255,0.15)' }}>
                                🎫
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="min-h-[260px] flex items-center justify-center w-full">
                            {fetchState === 'loading' && <LoadingTicket />}
                            {fetchState === 'success' && ticketData && ticketCount === 0 && (
                                <UsedTicket data={ticketData} />
                            )}
                            {fetchState === 'success' && ticketData && ticketCount !== 0 && (
                                <SuccessTicket data={ticketData} ticketCount={ticketCount} />
                            )}
                            {fetchState === 'error' && <ErrorTicket ticketId={id} />}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                            <p className="text-center text-white/30 text-xs">
                                Powered by <span className="text-white/60 font-semibold">Holi Fest QR System</span>
                            </p>
                            <p className="text-center text-white/20 text-xs mt-1">
                                Developed by <span className="text-white/50 font-semibold">Bharani</span> 💜
                            </p>
                        </div>
                    </div>

                    {/* ── VERIFY ENTRY SECTION (hidden when tickets = 0) ── */}
                    {fetchState === 'success' && ticketData && ticketCount !== 0 && (
                        <VerifySection id={id} onScanSuccess={handleScanSuccess} />
                    )}

                </div>
            </div>
        </>
    );
}
