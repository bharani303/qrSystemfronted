import { useState, useRef } from 'react';

const ADMIN_PASSWORD = '3241';

/* ═══════════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════════ */
const IconLock = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 9V7a2 2 0 114 0v2" />
    </svg>
);
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
const IconHash = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
);
const IconCurrency = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6M9 12h6M9 16h4M4 6h16M4 18h16" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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

/* ═══════════════════════════════════════════
   FULLSCREEN SPINNER OVERLAY
═══════════════════════════════════════════ */
function Spinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
            <div className="flex flex-col items-center gap-4">
                {/* Rainbow spinner */}
                <div className="relative flex items-center justify-center">
                    <div style={{
                        width: '4rem', height: '4rem', borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.2)',
                        boxShadow: `-12px -12px 12px #6359f8, 0px -12px 12px #9c32e2,
                        12px -12px 12px #f36896, 12px 0 12px #ff0b0b,
                        12px 12px 12px #ff5500, 0 12px 12px #ff9500,
                        -12px 12px 12px #ffb700`,
                        animation: 'spin-fast 0.7s linear infinite',
                    }} />
                    <div className="absolute w-6 h-6 rounded-full"
                        style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
                </div>
                <p className="text-white font-bold text-lg tracking-wide shimmer-text">Adding Ticket…</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   INPUT FIELD COMPONENT
═══════════════════════════════════════════ */
function InputField({ id, icon, label, type = 'text', placeholder, value, onChange, maxLength, error, rightEl }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-white/60 text-xs uppercase tracking-widest font-semibold pl-1">
                {label}
            </label>
            <div className="relative flex items-center">
                {/* Left icon */}
                <div className="absolute left-4 text-white/50 pointer-events-none z-10">
                    {icon}
                </div>
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl font-medium text-white outline-none transition-all duration-200 placeholder-white/30"
                    style={{
                        background: error ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.1)',
                        border: error ? '1.5px solid rgba(239,68,68,0.6)' : '1.5px solid rgba(255,255,255,0.2)',
                        boxShadow: 'none',
                    }}
                    onFocus={e => {
                        e.target.style.border = error
                            ? '1.5px solid rgba(239,68,68,0.8)'
                            : '1.5px solid rgba(255,255,255,0.6)';
                        e.target.style.background = error
                            ? 'rgba(239,68,68,0.18)'
                            : 'rgba(255,255,255,0.16)';
                    }}
                    onBlur={e => {
                        e.target.style.border = error
                            ? '1.5px solid rgba(239,68,68,0.6)'
                            : '1.5px solid rgba(255,255,255,0.2)';
                        e.target.style.background = error
                            ? 'rgba(239,68,68,0.15)'
                            : 'rgba(255,255,255,0.1)';
                    }}
                />
                {/* Right element (e.g. eye toggle) */}
                {rightEl && (
                    <div className="absolute right-4 z-10">{rightEl}</div>
                )}
            </div>
            {error && (
                <p className="text-red-300 text-xs pl-1 mt-0.5 font-medium">{error}</p>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════ */
function LoginScreen({ onSuccess }) {
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
            onSuccess();
        } else {
            setError('Wrong password ❌');
            setShake(true);
            setTimeout(() => { setShake(false); setPassword(''); setError(''); }, 700);
        }
    };

    return (
        <div className="glass-card w-full max-w-sm rounded-3xl p-8 fade-in-up text-center"
            style={{ opacity: 0 }}>

            {/* Icon */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center float-anim text-white"
                style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}>
                <IconLock />
            </div>

            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">🎨 Leo Holi 2026</p>
            <h1 className="text-white text-2xl font-black mb-1">Admin Portal</h1>
            <p className="text-white/50 text-sm mb-8">Enter password to access admin panel</p>

            {/* Password field */}
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
                    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                    boxShadow: '0 6px 24px rgba(168,85,247,0.5)',
                }}>
                Login →
            </button>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="text-white/25 text-xs">Authorised personnel only</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   SUCCESS TOAST
═══════════════════════════════════════════ */
function Toast({ message, onDone }) {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 fade-in-up"
            style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white shadow-2xl"
                style={{
                    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                    boxShadow: '0 8px 32px rgba(34,197,94,0.5)',
                    minWidth: '280px',
                }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <IconCheck />
                </span>
                <span>{message}</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   ADMIN FORM
═══════════════════════════════════════════ */
function AdminForm() {
    const [form, setForm] = useState({ id: '', name: '', email: '', phoneNo: '', tickets: '', amount: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [apiError, setApiError] = useState('');

    const set = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        setErrors(er => ({ ...er, [field]: '' }));
        setApiError('');
    };

    const validate = () => {
        const errs = {};
        if (!form.id || isNaN(form.id) || Number(form.id) <= 0)
            errs.id = 'Enter a valid Ticket ID';
        if (form.name.trim().length < 3)
            errs.name = 'Name must be at least 3 characters';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = 'Enter a valid email address';
        if (!/^[0-9]{10}$/.test(form.phoneNo))
            errs.phoneNo = 'Phone must be exactly 10 digits';
        if (!form.tickets || isNaN(form.tickets) || Number(form.tickets) <= 0)
            errs.tickets = 'Enter a valid ticket count';
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
            errs.amount = 'Enter a valid amount';
        return errs;
    };

    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        setApiError('');

        try {
            const res = await fetch('https://leo-qr-system.onrender.com/leo/ticket/add_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: Number(form.id),
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phoneno: form.phoneNo.trim(),
                    tickets: Number(form.tickets),
                    amount: String(form.amount),
                }),
            });

            const result = await res.text();

            if (res.ok) {
                setToast(result || 'Ticket added successfully! ✅');
                setForm({ id: '', name: '', email: '', phoneNo: '', tickets: '', amount: '' });
                setTimeout(() => setToast(null), 3500);
            } else {
                setApiError(result || 'Something went wrong ❌');
            }
        } catch {
            setApiError('Server error — could not connect ❌');
        }

        setLoading(false);
    };

    return (
        <>
            {loading && <Spinner />}
            {toast && <Toast message={toast} />}

            <div className="glass-card w-full max-w-lg rounded-3xl p-8 fade-in-up"
                style={{ opacity: 0 }}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">Admin Panel</p>
                        <h1 className="text-white text-xl font-black tracking-tight leading-tight">🎨 Leo Holi Ticket</h1>
                        <p className="text-white/40 text-sm mt-0.5">Add Ticket System</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: 'rgba(255,255,255,0.15)' }}>
                        🎫
                    </div>
                </div>

                {/* Divider */}
                <div className="mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.15)' }} />

                {/* Form fields */}
                <div className="flex flex-col gap-4">

                    <InputField
                        id="ticketId"
                        icon={<IconHash />}
                        label="Ticket ID"
                        type="number"
                        placeholder="Enter Ticket ID"
                        value={form.id}
                        onChange={set('id')}
                        error={errors.id}
                    />

                    <InputField
                        id="ticketName"
                        icon={<IconUser />}
                        label="Name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={set('name')}
                        error={errors.name}
                    />

                    <InputField
                        id="ticketEmail"
                        icon={<IconMail />}
                        label="Email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={set('email')}
                        error={errors.email}
                    />

                    <InputField
                        id="ticketPhone"
                        icon={<IconPhone />}
                        label="Phone Number"
                        type="tel"
                        placeholder="10-digit Phone Number"
                        value={form.phoneNo}
                        onChange={set('phoneNo')}
                        maxLength={10}
                        error={errors.phoneNo}
                    />

                    <InputField
                        id="ticketCount"
                        icon={<IconTicket />}
                        label="Number of Tickets"
                        type="number"
                        placeholder="e.g. 2"
                        value={form.tickets}
                        onChange={set('tickets')}
                        error={errors.tickets}
                    />

                    <InputField
                        id="ticketAmount"
                        icon={<IconCurrency />}
                        label="Amount (₹)"
                        type="number"
                        placeholder="e.g. 500"
                        value={form.amount}
                        onChange={set('amount')}
                        error={errors.amount}
                    />

                    {/* API error */}
                    {apiError && (
                        <div className="rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 text-center"
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
                            {apiError}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="verify-btn mt-2 w-full py-4 rounded-2xl font-black text-white text-lg tracking-wide"
                        style={{
                            background: loading
                                ? 'rgba(255,255,255,0.2)'
                                : 'linear-gradient(135deg, #a855f7, #7c3aed, #6d28d9)',
                            boxShadow: loading ? 'none' : '0 6px 24px rgba(168,85,247,0.5)',
                        }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <span className="spinner-ring inline-block w-5 h-5 rounded-full border-2 border-white/30"
                                    style={{ borderTopColor: '#fff' }} />
                                Adding Ticket…
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                🎟️ Add Ticket
                            </span>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <p className="text-center text-white/30 text-xs">
                        Powered by <span className="text-white/60 font-semibold">Leo Holi 2026 · Admin System</span>
                    </p>
                    <p className="text-center text-white/20 text-xs mt-1">
                        Developed by <span className="text-white/50 font-semibold">Bharani</span> 💜
                    </p>
                </div>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT — AdminPanel page
═══════════════════════════════════════════ */
const SESSION_KEY_PANEL = 'holi_admin_panel_auth';

export default function AdminPanel() {
    const [authed, setAuthed] = useState(
        () => sessionStorage.getItem(SESSION_KEY_PANEL) === 'true'
    );

    const handleSuccess = () => {
        sessionStorage.setItem(SESSION_KEY_PANEL, 'true');
        setAuthed(true);
    };

    return (
        <>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <div className="holi-bg min-h-screen w-full flex items-center justify-center p-4 py-10"
                style={{ fontFamily: "'Inter', sans-serif" }}>

                {/* Background blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#ff6b9d,transparent)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl"
                        style={{ background: 'radial-gradient(circle,#ffe066,transparent)' }} />
                </div>

                {/* Show login or form */}
                {!authed
                    ? <LoginScreen onSuccess={handleSuccess} />
                    : <AdminForm />
                }
            </div>
        </>
    );
}
