'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  BarChart2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
  ExternalLink,
  MapPin,
  Video,
  Check
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { GoogleAuthModal } from '../../components/GoogleAuthModal';

export default function TarefasPage() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    openNewTaskModal,
    googleCalendarSync,
    syncGoogleCalendar,
    disconnectGoogleCalendar
  } = useCrm();

  const [selectedDay, setSelectedDay] = useState<number>(6);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // October
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [taskFilter, setTaskFilter] = useState<'todas' | 'google' | 'crm' | 'pendentes' | 'concluidas' | 'atrasadas'>('todas');

  const monthNames = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  const totalTasks = tasks.length;
  const concluidasHoje = tasks.filter((t) => t.completed).length;
  const pendentes = tasks.filter((t) => !t.completed && t.dueDate >= '2026-10-06').length;
  const atrasadas = tasks.filter((t) => !t.completed && t.dueDate < '2026-10-06').length;
  const googleTasksCount = tasks.filter((t) => t.source === 'google_calendar').length;

  const handleSyncGoogle = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando com o Google Agenda...');
    try {
      const count = await syncGoogleCalendar();
      setSyncStatus(`Agenda sincronizada com sucesso! (${count} eventos atualizados) ✓`);
    } catch (e) {
      setSyncStatus('Erro ao sincronizar com Google Agenda.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  const handleGoogleSuccess = (count: number) => {
    setSyncStatus(`Google Agenda conectada! ${count} compromissos importados com sucesso. ✓`);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const daysInMonth = 31;
  const selectedDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const tasksForSelectedDay = tasks.filter((t) => t.dueDate === selectedDateStr);

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'google') return t.source === 'google_calendar';
    if (taskFilter === 'crm') return t.source !== 'google_calendar';
    if (taskFilter === 'pendentes') return !t.completed && t.dueDate >= '2026-10-06';
    if (taskFilter === 'concluidas') return t.completed;
    if (taskFilter === 'atrasadas') return !t.completed && t.dueDate < '2026-10-06';
    return true;
  });

  return (
    <div className="content-container">
      {/* Page Hero Header */}
      <div className="page-hero-bar">
        <div>
          <div className="arch-kicker">[ 01.3 // AGENDA & COMPROMISSOS ]</div>
          <h1 className="page-hero-title">GESTÃO DE TAREFAS // CRONOGRAMA</h1>
          <p className="page-hero-subtitle">
            ORGANIZAÇÃO DIÁRIA DE VISITAS, LIGAÇÕES E REUNIÕES COM CLIENTES
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openNewTaskModal} className="btn btn-primary">
            <Plus size={14} />
            <span>NOVA TAREFA</span>
          </button>
        </div>
      </div>

      {/* Google Calendar Integration Banner */}
      {!googleCalendarSync.connected ? (
        <div
          className="card"
          style={{
            marginBottom: '22px',
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04), rgba(15, 23, 42, 0.02))',
            border: '1px solid rgba(66, 133, 244, 0.3)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Google Calendar SVG Icon */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                flexShrink: 0
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
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
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '13px', margin: 0, color: 'var(--text-main)', letterSpacing: '0.08em' }}>
                  INTEGRAÇÃO GOOGLE CALENDAR
                </h3>
                <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                  DESCONECTADO
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Conecte seu autenticador Google para importar e sincronizar visitas a imóveis, reuniões e vistorias agendadas.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 18px',
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              fontWeight: 800
            }}
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
            <span>LOGIN COM GOOGLE & IMPORTAR AGENDA</span>
          </button>
        </div>
      ) : (
        <div
          className="card"
          style={{
            marginBottom: '22px',
            padding: '16px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05), rgba(15, 23, 42, 0.02))',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={googleCalendarSync.accountPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
                alt="Google User"
                style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #22c55e', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: '#22c55e',
                  width: '13px',
                  height: '13px',
                  borderRadius: '50%',
                  border: '2px solid #ffffff'
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '13px', margin: 0, color: 'var(--text-main)', letterSpacing: '0.08em' }}>
                  GOOGLE CALENDAR ATIVO
                </h3>
                <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  ✓ CONECTADO
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  • {googleCalendarSync.accountEmail}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Última sincronização: <strong>{googleCalendarSync.lastSyncedAt || 'Hoje'}</strong> • {googleTasksCount} compromissos importados
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleSyncGoogle}
              disabled={isSyncing}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCw size={13} className={isSyncing ? 'animate-spin' : ''} color="var(--brand-terracotta)" />
              <span>{isSyncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR AGORA'}</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Deseja desconectar a conta do Google Agenda? Os compromissos importados serão removidos do cronograma.')) {
                  disconnectGoogleCalendar();
                  setSyncStatus('Google Agenda desconectada com sucesso.');
                  setTimeout(() => setSyncStatus(null), 3000);
                }
              }}
              className="btn"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '11px',
                padding: '8px 12px'
              }}
            >
              DESCONECTAR
            </button>
          </div>
        </div>
      )}

      {/* Sync Status Banner */}
      {syncStatus && (
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-xs)',
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Check size={16} color="#059669" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 4 Architectural Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '22px'
        }}
      >
        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              TOTAL GERAL
            </span>
            <BarChart2 size={16} color="var(--primary-blue)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>
            {totalTasks}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#15803d' }}>
              CONCLUÍDAS HOJE
            </span>
            <CheckCircle2 size={16} color="#15803d" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>
            {concluidasHoje}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#d97706' }}>
              PENDENTES
            </span>
            <Clock size={16} color="#d97706" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>
            {pendentes}
          </div>
        </div>

        <div className="card" style={{ padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-terracotta)' }}>
              GOOGLE AGENDA
            </span>
            <Calendar size={16} color="var(--brand-terracotta)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--text-main)' }}>
            {googleTasksCount}
          </div>
        </div>
      </div>

      {/* Calendar Grid & Selected Day Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '22px',
          marginBottom: '28px'
        }}
      >
        {/* Calendar Left */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear((y) => y - 1);
                } else {
                  setSelectedMonth((m) => m - 1);
                }
              }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <ChevronLeft size={16} />
            </button>

            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--text-main)'
              }}
            >
              {monthNames[selectedMonth]} {selectedYear}
            </span>

            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear((y) => y + 1);
                } else {
                  setSelectedMonth((m) => m + 1);
                }
              }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '12px'
            }}
          >
            <span>DOM</span>
            <span>SEG</span>
            <span>TER</span>
            <span>QUA</span>
            <span>QUI</span>
            <span>SEX</span>
            <span>SÁB</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {[27, 28, 29, 30].map((d) => (
              <div
                key={`prev-${d}`}
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  opacity: 0.3
                }}
              >
                {d}
              </div>
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isSelected = day === selectedDay;
              const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
              const hasTasks = dayTasks.length > 0;
              const hasGoogleTasks = dayTasks.some((t) => t.source === 'google_calendar');

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    height: '40px',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 800 : 500,
                    background: isSelected ? '#090c12' : 'transparent',
                    border: isSelected ? '1px solid var(--brand-terracotta)' : '1px solid transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <span>{day}</span>
                  {hasTasks && !isSelected && (
                    <div style={{ position: 'absolute', bottom: '4px', display: 'flex', gap: '2px' }}>
                      <span
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '1px',
                          background: hasGoogleTasks ? '#2563eb' : 'var(--brand-terracotta)'
                        }}
                      />
                      {hasGoogleTasks && (
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '1px',
                            background: '#16a34a'
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--brand-terracotta)' }} />
              <span>CRM Tarefas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2563eb' }} />
              <span>Google Calendar</span>
            </div>
          </div>
        </div>

        {/* Selected Day Right Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-main)'
                }}
              >
                {selectedDay} DE {monthNames[selectedMonth]}, {selectedYear}
              </div>
              <button onClick={openNewTaskModal} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '10.5px' }}>
                + AGENDAR
              </button>
            </div>

            {tasksForSelectedDay.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasksForSelectedDay.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-subtle)',
                      border: task.source === 'google_calendar' ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      style={{ accentColor: 'var(--brand-terracotta)', marginTop: '3px', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            color: 'var(--text-main)',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.6 : 1
                          }}
                        >
                          {task.title.toUpperCase()}
                        </span>

                        {task.source === 'google_calendar' && (
                          <span
                            style={{
                              fontSize: '9.5px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              padding: '1px 6px',
                              borderRadius: '3px',
                              fontWeight: 700,
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            GOOGLE AGENDA
                          </span>
                        )}
                      </div>

                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <span>⏰ {task.dueTime}</span>
                        {task.leadName && <span>👤 CLIENTE: {task.leadName.toUpperCase()}</span>}
                        {task.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <MapPin size={11} color="var(--brand-terracotta)" />
                            {task.location}
                          </span>
                        )}
                        {task.meetLink && (
                          <a
                            href={task.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', textDecoration: 'none' }}
                          >
                            <Video size={11} />
                            Google Meet
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '48px 16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)'
                }}
              >
                [ NENHUMA TAREFA AGENDADA PARA ESTE DIA ]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List Bottom Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-main)'
            }}
          >
            CRONOGRAMA GERAL DE TAREFAS
          </h3>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['todas', 'google', 'crm', 'pendentes', 'concluidas', 'atrasadas'] as const).map((filterKey) => {
              const labels: Record<string, string> = {
                todas: 'TODAS',
                google: 'GOOGLE AGENDA',
                crm: 'CRM TAREFAS',
                pendentes: 'PENDENTES',
                concluidas: 'CONCLUÍDAS',
                atrasadas: 'ATRASADAS'
              };

              return (
                <button
                  key={filterKey}
                  onClick={() => setTaskFilter(filterKey)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid',
                    borderColor: taskFilter === filterKey ? 'var(--brand-terracotta)' : 'var(--border-color)',
                    background: taskFilter === filterKey ? '#090c12' : 'var(--bg-subtle)',
                    color: taskFilter === filterKey ? '#ffffff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {labels[filterKey]}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-subtle)',
                border: t.source === 'google_calendar' ? '1px solid rgba(37, 99, 235, 0.25)' : '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTask(t.id)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--brand-terracotta)', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: 'var(--text-main)',
                        textDecoration: t.completed ? 'line-through' : 'none',
                        opacity: t.completed ? 0.6 : 1
                      }}
                    >
                      {t.title.toUpperCase()}
                    </span>

                    {t.source === 'google_calendar' && (
                      <span
                        style={{
                          fontSize: '9.5px',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          padding: '1px 6px',
                          borderRadius: '3px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        GOOGLE AGENDA
                      </span>
                    )}
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '4px' }}>
                    <span>DATA: {t.dueDate} // {t.dueTime}</span>
                    {t.leadName && <span>CLIENTE: {t.leadName.toUpperCase()}</span>}
                    {t.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                        <MapPin size={11} color="var(--brand-terracotta)" />
                        {t.location}
                      </span>
                    )}
                    {t.meetLink && (
                      <a
                        href={t.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', textDecoration: 'none' }}
                      >
                        <Video size={11} />
                        Google Meet
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-warm" style={{ fontSize: '9.5px' }}>
                  {t.priority}
                </span>

                <button
                  onClick={() => deleteTask(t.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Authenticator OAuth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  );
}
