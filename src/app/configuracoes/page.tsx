'use client';

import React, { useState } from 'react';
import {
  Webhook,
  Copy,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Users
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export default function ConfiguracoesPage() {
  const { addLead } = useCrm();

  const [copiedFb, setCopiedFb] = useState(false);
  const [copiedWpp, setCopiedWpp] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const webhookFbUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/facebook` : 'https://crm.seusite.com.br/api/webhooks/facebook';
  const webhookWppUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/whatsapp` : 'https://crm.seusite.com.br/api/webhooks/whatsapp';
  const verifyToken = 'nosso_negocio_crm_token_2026';

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const simulateFacebookLead = () => {
    setSimulating('facebook');
    setTimeout(() => {
      const mockFbLead = {
        name: `Mariana Castro (${Math.floor(100 + Math.random() * 900)})`,
        email: 'mariana.castro@gmail.com',
        phone: '+55 15 99781-4455',
        value: 750000,
        status: 'novo_lead' as const,
        funnelId: 'funil_sorocaba',
        temperature: 'quente' as const,
        isNewForYou: true,
        origin: 'LEAD FORM - RESERVA VILLE - INSTAGRAM',
        assignedTo: 'Letícia Alves',
        tags: ['Meta Ads', 'Instagram', 'Entrada Automática'],
        notes: 'Lead capturado instantaneamente via Webhook da Meta Graph API.'
      };

      addLead(mockFbLead);
      setSimulating(null);
      setSuccessMsg('Lead do Facebook Ads inserido com sucesso na coluna NOVO LEAD do Kanban! 🎯');
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 700);
  };

  const simulateWhatsAppLead = () => {
    setSimulating('whatsapp');
    setTimeout(() => {
      const mockWppLead = {
        name: `Carlos Eduardo (${Math.floor(100 + Math.random() * 900)})`,
        email: 'carlos.imoveis@outlook.com',
        phone: '+55 11 98822-1133',
        value: 920000,
        status: 'novo_lead' as const,
        funnelId: 'funil_sorocaba',
        temperature: 'quente' as const,
        isNewForYou: true,
        origin: 'WhatsApp Receptivo // Anúncio Campolim',
        assignedTo: 'Reinaldo Santos',
        tags: ['WhatsApp', 'Click-to-WhatsApp'],
        notes: 'Cliente mandou mensagem: "Olá, gostaria de saber os valores do condomínio Ubiti."'
      };

      addLead(mockWppLead);
      setSimulating(null);
      setSuccessMsg('Lead do WhatsApp inserido com sucesso na coluna NOVO LEAD do Kanban! 💬');
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 700);
  };

  return (
    <div className="content-container">
      {/* Header */}
      <div className="page-hero-bar">
        <div>
          <h1 className="page-hero-title">CONFIGURAÇÕES // INTEGRAÇÕES & AUTOMAÇÃO</h1>
          <p className="page-hero-subtitle">
            Configure a entrada automática de leads via Webhooks do Facebook/Instagram Ads e WhatsApp.
          </p>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-xs)',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid of Webhooks & Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', marginBottom: '28px' }}>
        {/* Left: Webhook Endpoints */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Webhook size={18} color="var(--brand-terracotta)" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Endpoints de Webhook Ativos
            </h3>
          </div>

          {/* Facebook Ads Webhook */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                Meta Ads (Facebook & Instagram Lead Ads)
              </span>
              <span className="badge badge-new" style={{ fontSize: '10px' }}>
                POST / GET
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Insira esta URL no Painel de Desenvolvedores do Meta ou no formulário instantâneo de anúncios.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                readOnly
                value={webhookFbUrl}
                className="form-input"
                style={{ fontSize: '12px', background: 'var(--bg-card)' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => copyToClipboard(webhookFbUrl, setCopiedFb)}
                style={{ padding: '8px 12px' }}
              >
                {copiedFb ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              </button>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <span>Token de Verificação (Verify Token):</span>
              <button
                type="button"
                onClick={() => copyToClipboard(verifyToken, setCopiedToken)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-terracotta)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <code>{verifyToken}</code>
                {copiedToken ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* WhatsApp Webhook */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                WhatsApp Gateway (Evolution API, Z-API ou Meta Cloud)
              </span>
              <span className="badge badge-warm" style={{ fontSize: '10px' }}>
                POST
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Configure no webhook da instância para cadastrar novos contatos automaticamente.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                readOnly
                value={webhookWppUrl}
                className="form-input"
                style={{ fontSize: '12px', background: 'var(--bg-card)' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => copyToClipboard(webhookWppUrl, setCopiedWpp)}
                style={{ padding: '8px 12px' }}
              >
                {copiedWpp ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Test Simulator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Zap size={18} color="var(--brand-terracotta)" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Testador de Automação em Tempo Real
              </h3>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Clique nos botões abaixo para simular a chegada de um lead real via Webhook. O sistema processará os dados e criará o card imediatamente na coluna <strong>NOVO LEAD</strong> do seu Kanban!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={simulating !== null}
                onClick={simulateFacebookLead}
                style={{
                  width: '100%',
                  padding: '12px',
                  justifyContent: 'space-between',
                  border: '1px solid #bfdbfe',
                  background: '#eff6ff',
                  color: '#1d4ed8'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🎯</span>
                  <span>SIMULAR LEAD DO FACEBOOK ADS</span>
                </div>
                {simulating === 'facebook' ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                disabled={simulating !== null}
                onClick={simulateWhatsAppLead}
                style={{
                  width: '100%',
                  padding: '12px',
                  justifyContent: 'space-between',
                  border: '1px solid #bbf7d0',
                  background: '#f0fdf4',
                  color: '#15803d'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>💬</span>
                  <span>SIMULAR LEAD DO WHATSAPP</span>
                </div>
                {simulating === 'whatsapp' ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              </button>
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              marginTop: '20px',
              fontSize: '11.5px',
              color: 'var(--text-muted)'
            }}
          >
            💡 <strong>Dica de Produção:</strong> Ao subir o site na Vercel ou Firebase, essas mesmas URLs de Webhook responderão publicamente na internet 24 horas por dia.
          </div>
        </div>
      </div>

      {/* Rules & Distribution */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sliders size={18} color="var(--brand-terracotta)" />
          <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Regras de Distribuição Automática (Motor de Ação)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              1. Roleta (Round-Robin)
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Distribui cada lead sequencialmente entre os corretores que estão marcados como ativos na fila.
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              2. Modo Fogo Cruzado
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Notifica toda a equipe ao mesmo tempo via WhatsApp. O primeiro corretor que aceitar assume o lead no CRM.
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-subtle)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
              3. SLA de Primeiro Contato
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Se o corretor não iniciar o contato em até 15 minutos, o lead é transferido automaticamente para o próximo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
