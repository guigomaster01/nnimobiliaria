'use client';

import React, { useState } from 'react';
import {
  Search,
  Archive,
  MessageSquare,
  Lock,
  Send,
  User,
  CheckCheck,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { SALES_REPRESENTATIVES } from '../../data/mockData';

export default function ChatOmnichannelPage() {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'conversas' | 'arquivadas'>('conversas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttendant, setSelectedAttendant] = useState('Todos os atendentes');
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const filteredConversations = conversations.filter((c) => {
    if (c.status !== (activeTab === 'conversas' ? 'active' : 'archived')) return false;
    if (selectedAttendant !== 'Todos os atendentes' && c.attendant !== selectedAttendant) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPhone = c.phone.toLowerCase().includes(q);
      const matchName = (c.clientName || '').toLowerCase().includes(q);
      const matchMsg = c.lastMessage.toLowerCase().includes(q);
      if (!matchPhone && !matchName && !matchMsg) return false;
    }
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, inputText, isInternalNote);
    setInputText('');
    setIsInternalNote(false);
  };

  const insertTemplate = (templateText: string) => {
    setInputText(templateText);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <div
        style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          alignItems: 'center',
          height: '54px',
          padding: '0 20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => setActiveTab('conversas')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              paddingBottom: '4px',
              borderBottom: activeTab === 'conversas' ? '2px solid var(--brand-terracotta)' : '2px solid transparent'
            }}
          >
            CONVERSAS
          </button>

          <button
            onClick={() => setActiveTab('arquivadas')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.65)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              paddingBottom: '4px',
              borderBottom: activeTab === 'arquivadas' ? '2px solid var(--brand-terracotta)' : '2px solid transparent'
            }}
          >
            <Archive size={14} />
            <span>ARQUIVADAS</span>
          </button>
        </div>

        <div style={{ paddingLeft: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {activeConversation ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                  {activeConversation.clientName || activeConversation.phone}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {activeConversation.phone}
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                Atendente: {activeConversation.attendant}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
              Selecione uma conversa para começar
            </span>
          )}
        </div>
      </div>

      {/* Main chat layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 0 }}>
        {/* Left column: Conversation list */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden'
          }}
        >
          {/* Search box & filter */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '8px 12px',
                border: '1px solid var(--border-color)'
              }}
            >
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Pesquisar conversa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                  textTransform: 'uppercase'
                }}
              >
                Filtrar conversas de:
              </div>
              <select
                value={selectedAttendant}
                onChange={(e) => setSelectedAttendant(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '12.5px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {SALES_REPRESENTATIVES.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-subtle)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--brand-terracotta)' : '3px solid transparent',
                    transition: 'background 0.15s'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: conv.avatarColor || '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}
                  >
                    <User size={18} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {conv.phone}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {conv.lastMessage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Active conversation pane */}
        {activeConversation ? (
          <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <div
              style={{
                padding: '10px 20px',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
                  Online via WhatsApp
                </span>
                {activeConversation.tags.map((t, idx) => (
                  <span key={idx} className="badge badge-warm" style={{ fontSize: '10.5px' }}>
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={`https://wa.me/${activeConversation.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                <ExternalLink size={12} />
                <span>WHATSAPP WEB</span>
              </a>
            </div>

            {/* Timeline */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {activeMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isInternal = msg.isInternalNote;

                if (isInternal) {
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: 'center',
                        maxWidth: '85%',
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        color: '#92400e',
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '12.5px'
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={13} /> Nota Interna ({msg.timestamp}):
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '68%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        background: isUser ? '#0f172a' : 'var(--bg-card)',
                        color: isUser ? '#ffffff' : 'var(--text-main)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        borderBottomRightRadius: isUser ? '2px' : '10px',
                        borderBottomLeftRadius: isUser ? '10px' : '2px',
                        border: isUser ? 'none' : '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '13.5px',
                        lineHeight: 1.5
                      }}
                    >
                      {msg.text}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: '3px'
                      }}
                    >
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck size={13} color="var(--brand-terracotta)" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick response chips */}
            <div
              style={{
                padding: '8px 20px',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto'
              }}
            >
              {[
                '📅 Agendar Visita',
                '📁 Enviar Book do Imóvel',
                '🏦 Simulação Caixa'
              ].map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertTemplate(text)}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '14px 20px',
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    style={{ accentColor: 'var(--brand-terracotta)', cursor: 'pointer' }}
                  />
                  <span>Salvar como Nota Interna (oculta para o cliente)</span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="text"
                  placeholder={isInternalNote ? 'Digite uma nota interna para a equipe...' : 'Digite sua mensagem via WhatsApp...'}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-color)',
                    background: isInternalNote ? '#fffbeb' : 'var(--bg-input)',
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 18px', background: isInternalNote ? 'var(--brand-terracotta)' : '#0f172a' }}
                >
                  <Send size={14} />
                  <span>ENVIAR</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-primary)',
              color: 'var(--text-muted)',
              gap: '10px'
            }}
          >
            <MessageSquare size={32} color="var(--brand-terracotta)" />
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
              Atendimento ao Vivo
            </div>
            <div style={{ fontSize: '12.5px' }}>
              Selecione uma conversa para começar
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
