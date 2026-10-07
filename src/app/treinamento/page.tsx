'use client';

import React from 'react';
import { GraduationCap, PlayCircle, BookOpen, Award, CheckCircle } from 'lucide-react';

export default function TreinamentoPage() {
  const modules = [
    { title: 'Técnicas de Fechamento de Alto Padrão', duration: '45 min', progress: '100%', completed: true },
    { title: 'Como utilizar o WhatsApp para aquecer leads frios', duration: '30 min', progress: '65%', completed: false },
    { title: 'Minha Casa Minha Vida: Novas Regras de Subsídio', duration: '50 min', progress: '0%', completed: false },
    { title: 'Argumentação para quebra de objeções de permuta', duration: '25 min', progress: '0%', completed: false }
  ];

  return (
    <div className="content-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <GraduationCap size={24} color="#16a34a" />
        <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Treinamento da Equipe Imobiliária</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Módulos de Capacitação Contínua</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Cursos rápidos e práticos para os corretores e associados melhorarem a taxa de conversão do funil de vendas.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {modules.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PlayCircle size={24} color={m.completed ? '#16a34a' : '#2563eb'} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Duração: {m.duration} · Progresso: {m.progress}
                  </div>
                </div>
              </div>

              {m.completed ? (
                <span className="badge badge-warm" style={{ background: '#dcfce7', color: '#15803d' }}>
                  <CheckCircle size={12} /> Concluído
                </span>
              ) : (
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Continuar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
