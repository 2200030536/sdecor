'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Sparkles, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  // ── Tab state: 'login' | 'register'
  const [tab,  setTab]  = useState('login');
  // ── Role: 'user' | 'admin'
  const [role, setRole] = useState('user');

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const isAdminMode = role === 'admin';

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const user = await login(form.email, form.password);
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        // register — always creates a 'user' role
        await register(form.name, form.email, form.password);
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* ── Animated gradient background ────────────────────────────────── */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        }}
      />
      {/* Ambient blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl animate-float"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '1s' }}
      />

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Logo */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand shadow-lg mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">SDecor</h1>
          <p className="text-white/50 text-sm mt-1">Patna&apos;s Premium Decoration Service</p>
        </div>

        {/* ── Role toggle ──────────────────────────────────────────────────── */}
        <div className="px-8 pb-2">
          <div
            className="flex rounded-xl p-1"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            {['user', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                id={`role-tab-${r}`}
                onClick={() => { setRole(r); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  role === r
                    ? 'gradient-brand text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {r === 'user' ? '👤 User' : '🔐 Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Login / Register tab ─────────────────────────────────────────── */}
        {!isAdminMode && (
          <div className="px-8 pt-2 pb-0">
            <div className="flex gap-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              {['login', 'register'].map((t) => (
                <button
                  key={t}
                  type="button"
                  id={`tab-${t}`}
                  onClick={() => { setTab(t); setError(''); }}
                  className={`pb-2 text-sm font-semibold capitalize transition-all ${
                    tab === t
                      ? 'text-white border-b-2 border-orange-500'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-4">
          {/* Name field — only for user registration */}
          {tab === 'register' && !isAdminMode && (
            <div>
              <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#f97316')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder={isAdminMode ? 'admin@sdecor.com' : 'you@example.com'}
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onFocus={e => (e.target.style.borderColor = '#f97316')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-11 py-3 rounded-xl text-white text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onFocus={e => (e.target.style.borderColor = '#f97316')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />
              <button
                type="button"
                id="toggle-password"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#fca5a5',
              }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Admin hint */}
          {isAdminMode && (
            <p className="text-white/30 text-xs text-center">
              Admin accounts are managed by the system. Contact support if you need access.
            </p>
          )}

          {/* Submit */}
          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gradient-brand text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading
              ? 'Please wait…'
              : tab === 'login'
                ? (isAdminMode ? '🔐 Access Admin Panel' : '→ Login')
                : '✨ Create Account'}
          </button>

          {/* Switch tab link */}
          {!isAdminMode && (
            <p className="text-center text-white/40 text-xs">
              {tab === 'login' ? (
                <>Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-orange-400 hover:text-orange-300 font-semibold">
                    Sign up free
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-orange-400 hover:text-orange-300 font-semibold">
                    Login
                  </button>
                </>
              )}
            </p>
          )}

          <div className="pt-2 text-center">
            <Link href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">
              ← Back to SDecor
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
