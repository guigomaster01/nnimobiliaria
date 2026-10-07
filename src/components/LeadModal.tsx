'use client';

import React, { useState } from 'react';
import { X, UserPlus, Trash2, Phone, Mail, Building, Tag } from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { LeadStatus, LeadTemperature } from '../types/crm';
import { SALES_REPRESENTATIVES } from '../data/mockData';

export function LeadModal() {
  const { modalOpen, closeModals, addLead, updateLead, deleteLead, selectedLeadId, leads, funnels, selectedFunnelId } = useCrm();

  const isEditing = modalOpen === 'lead_detail' && selectedLeadId;
  const currentLead = isEditing ? leads.find((l) => l.id === selectedLeadId) : null;

  const [name, setName] = useState(currentLead?.name || '');
  const [email, setEmail] = useState(currentLead?.email || '');
  const [phone, setPhone] = useState(currentLead?.phone || '');
  const [value, setValue] = useState(currentLead?.value ? String(currentLead.value) : '500000');
  const [status, setStatus] = useState<LeadStatus>(currentLead?.status || 'novo_lead');
  const [funnelId, setFunnelId] = useState(currentLead?.funnelId || selectedFunnelId);
  const [temperature, setTemperature] = useState<LeadTemperature>(currentLead?.temperature || 'morno');
  const [origin, setOrigin] = useState(currentLead?.origin || 'LEAD FORM - SITE');
  const [assignedTo, setAssignedTo] = useState(currentLead?.assignedTo || 'Guilherme Martins');
  const [tagsInput, setTagsInput] = useState(currentLead?.tags.join(', ') || 'Interesse Alto');
  const [notes, setNotes] = useState(currentLead?.notes || '');

  // Reset or update on mount if lead changes
  React.useEffect(() => {
    if (currentLead) {
      setName(currentLead.name);
      setEmail(currentLead.email);
      setPhone(currentLead.phone);
      setValue(String(currentLead.value));
      setStatus(currentLead.status);
      setFunnelId(currentLead.funnelId);
      setTemperature(currentLead.temperature);
      setOrigin(currentLead.origin);
      setAssignedTo(currentLead.assignedTo);
      setTagsInput(currentLead.tags.join(', '));
      setNotes(currentLead.notes || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setValue('450000');
      setStatus('novo_lead');
      setFunnelId(selectedFunnelId);
      setTemperature('morno');
      setOrigin('LEAD FORM - SITE');
      setAssignedTo('Guilherme Martins');
      setTagsInput('Interesse Geral');
      setNotes('');
    }
  }, [currentLead, selectedFunnelId, modalOpen]);

  if (modalOpen !== 'new_lead' && modalOpen !== 'lead_detail') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe o nome do lead.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing && selectedLeadId) {
      updateLead(selectedLeadId, {
        name,
        email,
        phone,
        value: Number(value) || 0,
        status,
        funnelId,
        temperature,
        origin,
        assignedTo,
        tags: tagsArray,
        notes
      });
    } else {
      addLead({
        name,
        email,
        phone,
        value: Number(value) || 0,
        status,
        funnelId,
        temperature,
        isNewForYou: true,
        origin,
        assignedTo,
        tags: tagsArray,
        notes
      });
    }

    closeModals();
  };

  return (
    <div className="modal-backdrop" onClick={closeModals}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={20} color="#2563eb" />
            <h3>{isEditing ? 'Detalhes do Lead' : 'Cadastrar Novo Lead'}</h3>
          </div>
          <button className="modal-close-btn" onClick={closeModals}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome Completo *</label>
              <input
                className="form-input"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">
                  <Phone size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Telefone / WhatsApp
                </label>
                <input
                  className="form-input"
                  placeholder="+55 15 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  E-mail
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Valor Estimado (VGV R$)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="500000"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Temperatura</label>
                <select
                  className="form-select"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value as LeadTemperature)}
                >
                  <option value="quente">🔥 Quente (Alta intenção)</option>
                  <option value="morno">🟡 Morno (Em avaliação)</option>
                  <option value="frio">❄️ Frio (Pouco engajado)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Etapa no Funil</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                >
                  <option value="novo_lead">Novo Lead</option>
                  <option value="em_relacionamento">Em Relacionamento</option>
                  <option value="agendamento">Agendamento</option>
                  <option value="atendimento">Atendimento</option>
                  <option value="ganho">Venda Ganha 🎉</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Building size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Funil Selecionado
                </label>
                <select
                  className="form-select"
                  value={funnelId}
                  onChange={(e) => setFunnelId(e.target.value)}
                >
                  {funnels.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Corretor Responsável</label>
                <select
                  className="form-select"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  {SALES_REPRESENTATIVES.filter((s) => s !== 'Todos os vendedores').map((rep) => (
                    <option key={rep} value={rep}>
                      {rep}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Origem / Campanha</label>
                <input
                  className="form-input"
                  placeholder="Ex: LEAD FORM - CASA UBITI - SO"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Tag size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Tags (separadas por vírgula)
              </label>
              <input
                className="form-input"
                placeholder="Casa Térrea, Alto Padrão, Financiamento Caixa"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observações Internas</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Anotações sobre preferências, histórico de conversa, visitas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            {isEditing && selectedLeadId && (
              <button
                type="button"
                className="btn btn-danger"
                style={{ marginRight: 'auto' }}
                onClick={() => {
                  if (confirm('Deseja realmente excluir este lead?')) {
                    deleteLead(selectedLeadId);
                  }
                }}
              >
                <Trash2 size={15} />
                Excluir
              </button>
            )}

            <button type="button" className="btn btn-secondary" onClick={closeModals}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Salvar Alterações' : 'Criar Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
