import { useState, useRef, useEffect } from 'react';

const ADMIN_PIN = '3241';
const SESSION_KEY = 'holi_admin_auth';

/* ─── Lock icon ─── */
const IconLock = ({ open }) =>
    open ? (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
    ) : (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 9V7a2 2 0 114 0v2" />
        </svg>
    );

/* ─── Single PIN digit box ─── */
function PinBox({ value, focused, error }) {
    const filled = value !== '';
    return (
        <div
            className="w-14 h-16 rounded-2xl flex items-center justify-center text-3xl font-black transition-all duration-200"
            style={{
                background: error
                    ? 'rgba(239,68,68,0.25)'
                    : filled
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(255,255,255,0.1)',
                border: error
                    ? '2px solid rgba(239,68,68,0.7)'
                    : focused
                        ? '2px solid rgba(255,255,255,0.8)'
                        : '2px solid rgba(255,255,255,0.2)',
                boxShadow: focused && !error ? '0 0 16px rgba(255,255,255,0.3)' : 'none',
                color: '#fff',
            }}
        >
            {filled ? '●' : ''}
        </div>
    );
}

export default function AdminLogin({ onSuccess }) {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [focused, setFocused] = useState(0);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    // Auto-focus first box on mount
    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (idx, val) => {
        // Only allow single digit
        const digit = val.replace(/\D/g, '').slice(-1);
        const next = [...pin];
        next[idx] = digit;
        setPin(next);
        setError(false);

        // Move to next box if digit entered
        if (digit && idx < 3) {
            inputRefs[idx + 1].current?.focus();
            setFocused(idx + 1);
        }

        // Auto-submit when all 4 digits filled
        if (digit && idx === 3) {
            const fullPin = [...next].join('');
            if (next.every(d => d !== '')) {
                submitPin(fullPin, next);
            }
        }
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === 'Backspace') {
            const next = [...pin];
            if (next[idx]) {
                next[idx] = '';
                setPin(next);
            } else if (idx > 0) {
                next[idx - 1] = '';
                setPin(next);
                inputRefs[idx - 1].current?.focus();
                setFocused(idx - 1);
            }
            setError(false);
        }
        if (e.key === 'Enter') {
            const fullPin = pin.join('');
            if (fullPin.length === 4) submitPin(fullPin, pin);
        }
    };

    const submitPin = (fullPin, pinArr) => {
        if (fullPin === ADMIN_PIN) {
            setUnlocking(true);
            // Brief unlock animation before calling onSuccess
            setTimeout(() => {
                sessionStorage.setItem(SESSION_KEY, 'true');
                onSuccess();
            }, 800);
        } else {
            // Wrong PIN — shake + clear
            setError(true);
            setShake(true);
            setTimeout(() => {
                setShake(false);
                setPin(['', '', '', '']);
                setError(false);
                inputRefs[0].current?.focus();
                setFocused(0);
            }, 700);
        }
    };

    return (
        <div
            className="holi-bg min-h-screen w-full flex items-center justify-center p-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle,#ff6b9d,transparent)' }} />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle,#a855f7,transparent)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(circle,#ffe066,transparent)' }} />
            </div>

            {/* Login card */}
            <div
                className="glass-card relative w-full max-w-sm rounded-3xl p-8 fade-in-up text-center"
                style={{ opacity: 0 }}
            >
                {/* Lock icon */}
                <div
                    className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${unlocking ? 'pulse-green' : 'float-anim'
                        }`}
                    style={{
                        background: unlocking
                            ? 'rgba(74,222,128,0.2)'
                            : 'rgba(255,255,255,0.15)',
                        border: unlocking
                            ? '2px solid rgba(74,222,128,0.6)'
                            : '2px solid rgba(255,255,255,0.3)',
                        color: unlocking ? '#86efac' : '#fff',
                    }}
                >
                    <IconLock open={unlocking} />
                </div>

                {/* Title */}
                <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">
                    🎨 Leo Holi 2026
                </p>
                <h1 className="text-white text-2xl font-black mb-1">Admin Access</h1>
                <p className="text-white/50 text-sm mb-8">
                    {unlocking ? '✅ Access Granted!' : 'Enter your 4-digit PIN to continue'}
                </p>

                {/* PIN boxes */}
                <div
                    className={`flex justify-center gap-3 mb-6 ${shake ? 'shake-anim' : ''}`}
                >
                    {pin.map((digit, idx) => (
                        <div key={idx} className="relative">
                            <PinBox
                                value={digit}
                                focused={focused === idx}
                                error={error}
                            />
                            {/* Hidden real input layered over each box */}
                            <input
                                ref={inputRefs[idx]}
                                type="tel"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(idx, e.target.value)}
                                onKeyDown={e => handleKeyDown(idx, e)}
                                onFocus={() => setFocused(idx)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                style={{ caretColor: 'transparent' }}
                                disabled={unlocking}
                            />
                        </div>
                    ))}
                </div>

                {/* Error message */}
                <div
                    className="transition-all duration-300 overflow-hidden"
                    style={{ maxHeight: error ? '40px' : '0px' }}
                >
                    <p className="text-red-300 text-sm font-semibold mb-4">
                        ❌ Incorrect PIN. Try again.
                    </p>
                </div>

                {/* Divider */}
                <div className="my-5" style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />

                {/* Footer */}
                <p className="text-white/25 text-xs">
                    Authorised personnel only
                </p>
            </div>
        </div>
    );
}
