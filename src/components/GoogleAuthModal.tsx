'use client';

import React, { useState } from 'react';
import { X, Calendar, ShieldCheck, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const { connectGoogleCalendar } = useCrm();
  const [selectedAccount, setSelectedAccount] = useState<'default' | 'custom'>('default');
  const [customEmail, setCustomEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAuthorize = async () => {
    setIsSubmitting(true);
    try {
      const email = selectedAccount === 'default' ? 'guilherme.martins@nossonegocio.com.br' : (customEmail || 'corretor@nossonegocio.com.br');
      const name = selectedAccount === 'default' ? 'Guilherme Martins' : 'Corretor Associado';

      const res = await connectGoogleCalendar({
        email,
        name,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
      });

      onSuccess(res.count);
      onClose();
    } catch (err) {
      console.error('Google auth error:', err);
      alert('Erro ao conectar com Google Agenda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '92%',
          background: '#ffffff',
          color: '#1f2937',
          borderRadius: '12px',
          padding: '28px 24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Google Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Google "G" Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24">
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
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                Fazer login com o Google
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                para autorizar o <strong>Nosso Negócio CRM</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Banner */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '18px',
            fontSize: '12px',
            color: '#475569',
            lineHeight: 1.45
          }}
        >
          O aplicativo terá acesso para visualizar e importar compromissos da sua agenda do Google diretamente para o quadro de tarefas imobiliárias.
        </div>

        {/* Account Selection */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '8px' }}>
            Escolha uma conta para sincronizar
          </div>

          {/* Account 1 */}
          <div
            onClick={() => setSelectedAccount('default')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              border: selectedAccount === 'default' ? '2px solid #2563eb' : '1px solid #e5e7eb',
              background: selectedAccount === 'default' ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px'
                }}
              >
                GM
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                  Guilherme Martins
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  guilherme.martins@nossonegocio.com.br
                </div>
              </div>
            </div>
            {selectedAccount === 'default' && <Check size={16} color="#2563eb" />}
          </div>

          {/* Account 2 (Custom) */}
          <div
            onClick={() => setSelectedAccount('custom')}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: selectedAccount === 'custom' ? '2px solid #2563eb' : '1px solid #e5e7eb',
              background: selectedAccount === 'custom' ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    border: '1px dashed #94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#64748b'
                  }}
                >
                  +
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Usar outra conta Google
                </div>
              </div>
              {selectedAccount === 'custom' && <Check size={16} color="#2563eb" />}
            </div>

            {selectedAccount === 'custom' && (
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <input
                  type="email"
                  placeholder="seu.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Permissions Scope list */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '8px' }}>
            Permissões solicitadas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
              <Calendar size={14} color="#2563eb" />
              <span>Ver eventos e compromissos do Google Agenda</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
              <ShieldCheck size={14} color="#16a34a" />
              <span>Importar visitas e vistorias agendadas com clientes</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>

          <button
            onClick={handleAuthorize}
            disabled={isSubmitting}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Autorizando & Importando...</span>
              </>
            ) : (
              <>
                <span>Continuar & Importar</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
