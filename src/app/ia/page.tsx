'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, Send, MessageSquareQuote, CheckCircle } from 'lucide-react';

export default function IaPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResponse(
        `Para abordar esse cliente que buscou imóveis em Sorocaba na faixa de R$ 500k:
1. Comece validando o perfil familiar (quantos dormitórios e vaga de garagem).
2. Destaque o condomínio Reserva Ubiti com condições exclusivas de entrada em até 36x.
3. Convide para tomar um café e conhecer a maquete no estande este fim de semana.`
      );
      setLoading(false);
    }, 800);
  };

  return (
    <div className="content-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Sparkles size={24} color="#7c3aed" />
        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Copiloto de IA para Corretores</h1>
      </div>

      <div className="card" style={{ maxWidth: '800px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
          Assistente Inteligente de Negociação & Script
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Peça ajuda para quebrar objeções de clientes, sugerir imóveis adequados ao perfil de renda ou gerar mensagens para reativar leads frios.
        </p>

        <form onSubmit={handleAsk} style={{ display: 'flex', gap: '10px' }}>
          <input
            className="form-input"
            placeholder="Ex: Como abordar um cliente que achou o valor da entrada muito alto?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={15} />
            {loading ? 'Analisando...' : 'Perguntar'}
          </button>
        </form>

        {response && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '10px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              fontSize: '13.5px',
              lineHeight: 1.6,
              whiteSpace: 'pre-line'
            }}
          >
            <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} /> Resposta da IA:
            </div>
            {response}
          </div>
        )}
      </div>
    </div>
  );
}
