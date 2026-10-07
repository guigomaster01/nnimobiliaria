'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, isFirebaseConfigured } = useAuth();

  const [email, setEmail] = useState('guilherme.martins@nossonegocio.com.br');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await signInWithEmail(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMessage(result.error || 'Credenciais inválidas.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);

    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMessage(result.error || 'Erro ao conectar via Google.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 20%, #172033 0%, #090c12 70%)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle architectural grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-elevated)',
          padding: '36px 32px',
          position: 'relative',
          zIndex: 1,
          animation: 'modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Header with logoNN.png */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', padding: '4px', background: '#000000', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.15)', marginBottom: '14px' }}>
            <img
              src="/logoNN.png"
              alt="Nosso Negócio"
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
            />
          </div>

          <h1
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            NOSSO NEGÓCIO // CRM
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Acesse sua conta para gerenciar o pipeline de vendas.
          </p>

          {/* Firebase Connection Status Badge */}
          <div style={{ marginTop: '10px' }}>
            {isFirebaseConfigured ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '10.5px',
                  fontFamily: 'var(--font-mono)',
                  color: '#15803d',
                  background: 'rgba(21, 128, 61, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  border: '1px solid rgba(21, 128, 61, 0.25)'
                }}
              >
                <ShieldCheck size={12} /> FIREBASE AUTH CONECTADO
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '10.5px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--brand-terracotta)',
                  background: 'rgba(184, 93, 67, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  border: '1px solid rgba(184, 93, 67, 0.25)'
                }}
              >
                ⚡ FIREBASE AUTH PRONTO (MODO LOCAL)
              </span>
            )}
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-xs)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '12.5px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">E-mail Profissional</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="corretor@nossonegocio.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '36px' }}
              />
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Senha</label>
              <a
                href="#esqueci"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Instruções de redefinição serão enviadas para seu e-mail.');
                }}
                style={{ fontSize: '11px', color: 'var(--brand-terracotta)', textDecoration: 'none', fontWeight: 600 }}
              >
                Esqueceu a senha?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
              />
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--brand-terracotta)', cursor: 'pointer' }}
              />
              <span>Lembrar meus dados</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            <span>{loading ? 'AUTENTICANDO...' : 'ENTRAR NO CRM'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '22px 0',
            color: 'var(--text-muted)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span>ou acesse via</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '10px', gap: '10px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>ENTRAR COM GOOGLE</span>
        </button>
      </div>
    </div>
  );
}
