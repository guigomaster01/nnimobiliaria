'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export function TaskModal() {
  const { modalOpen, closeModals, addTask, leads } = useCrm();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [type, setType] = useState<'visita' | 'ligacao' | 'whatsapp' | 'reuniao' | 'proposta'>('visita');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('media');
  const [dueDate, setDueDate] = useState('2026-10-06');
  const [dueTime, setDueTime] = useState('14:00');

  if (modalOpen !== 'new_task') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o título da tarefa.');
      return;
    }

    const selectedLead = leads.find((l) => l.id === leadId);

    addTask({
      title,
      description,
      leadId: leadId || undefined,
      leadName: selectedLead?.name,
      type,
      priority,
      dueDate,
      dueTime,
      completed: false
    });

    closeModals();
  };

  return (
    <div className="modal-backdrop" onClick={closeModals}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#2563eb" />
            <h3>Nova Tarefa</h3>
          </div>
          <button className="modal-close-btn" onClick={closeModals}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título da Tarefa *</label>
              <input
                className="form-input"
                placeholder="Ex: Visita no Gran Campolim com Rogério"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Tipo de Ação</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="visita">🏡 Visita Presencial</option>
                  <option value="ligacao">📞 Ligação Telefônica</option>
                  <option value="whatsapp">💬 Contato WhatsApp</option>
                  <option value="reuniao">👥 Reunião / Alinhamento</option>
                  <option value="proposta">📄 Envio de Proposta</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Prioridade</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="alta">🔴 Alta</option>
                  <option value="media">🟡 Média</option>
                  <option value="baixa">🟢 Baixa</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <User size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Vincular a um Lead (Opcional)
              </label>
              <select
                className="form-select"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
              >
                <option value="">Nenhum lead vinculado</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} - ({l.phone})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Data de Execução
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Horário
                </label>
                <input
                  type="time"
                  className="form-input"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição / Observações</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Detalhes sobre o que levar, dúvidas a sanar ou pontos chaves..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModals}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Agendar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
