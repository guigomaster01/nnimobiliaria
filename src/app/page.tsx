'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  DollarSign,
  Trophy,
  Users,
  Award,
  Target,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export default function DashboardPage() {
  const { leads, funnels, tasks, motorAcaoActive, triggerMotorAcao, googleCalendarSync } = useCrm();
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  // Helper de filtragem de data
  const isDateInPeriod = (dateStr: string | undefined, period: string, refDate: Date | null): boolean => {
    if (!dateStr || period === 'all' || !refDate) return true;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return true;

    if (period === 'today') {
      return (
        date.getFullYear() === refDate.getFullYear() &&
        date.getMonth() === refDate.getMonth() &&
        date.getDate() === refDate.getDate()
      );
    }

    if (period === 'week') {
      const diffTime = Math.abs(refDate.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }

    if (period === 'month') {
      return (
        date.getFullYear() === refDate.getFullYear() &&
        date.getMonth() === refDate.getMonth()
      );
    }

    if (period === 'last30') {
      const diffTime = Math.abs(refDate.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }

    return true;
  };

  // Filtragem Reativa de Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Filtro de Praça / Funil
      if (selectedCity !== 'all') {
        const matchesFunnel = lead.funnelId === selectedCity;
        const matchesName = (lead.funnelId || '').toLowerCase().includes(selectedCity.toLowerCase());
        if (!matchesFunnel && !matchesName) return false;
      }

      // Filtro de Período
      if (selectedPeriod !== 'all') {
        const dateToCheck = lead.status === 'ganho' ? (lead.updatedAt || lead.createdAt) : lead.createdAt;
        if (!isDateInPeriod(dateToCheck, selectedPeriod, currentDate)) {
          return false;
        }
      }

      return true;
    });
  }, [leads, selectedCity, selectedPeriod, currentDate]);

  // Vendas Ganhas
  const wonLeads = useMemo(
    () => filteredLeads.filter((l) => l.status === 'ganho'),
    [filteredLeads]
  );

  // VGV Realizado (soma de leads ganhos)
  const totalVgv = useMemo(
    () => wonLeads.reduce((acc, l) => acc + (l.value || 0), 0),
    [wonLeads]
  );

  // VGC Realizado (Comissão de 3% a 6% ou comissão cadastrada)
  const totalVgc = useMemo(
    () => wonLeads.reduce((acc, l) => acc + (l.commission || Math.round((l.value || 0) * 0.03)), 0),
    [wonLeads]
  );

  // Leads Ativos (Pipeline em aberto)
  const activeLeads = useMemo(
    () => filteredLeads.filter((l) => l.status !== 'ganho' && l.status !== 'perdido'),
    [filteredLeads]
  );

  // VGV Previsto (Pipeline ativo)
  const pipelineVgv = useMemo(
    () => activeLeads.reduce((acc, l) => acc + (l.value || 0), 0),
    [activeLeads]
  );

  // VGC Previsto (Comissão estimada do pipeline)
  const pipelineVgc = useMemo(
    () => activeLeads.reduce((acc, l) => acc + (l.commission || Math.round((l.value || 0) * 0.03)), 0),
    [activeLeads]
  );

  // Deals Fechados
  const dealsCount = wonLeads.length;
  const avgTicket = dealsCount > 0 ? Math.round(totalVgv / dealsCount) : 0;

  // Taxa de Conversão
  const conversionRate = filteredLeads.length > 0
    ? ((dealsCount / filteredLeads.length) * 100).toFixed(1)
    : '0';

  // Novos leads criados hoje
  const todayStr = useMemo(() => {
    if (!currentDate) return '';
    return currentDate.toISOString().slice(0, 10);
  }, [currentDate]);

  const newLeadsTodayCount = useMemo(() => {
    if (!todayStr) return leads.length > 0 ? 2 : 0;
    return leads.filter((l) => (l.createdAt || '').slice(0, 10) === todayStr).length;
  }, [leads, todayStr]);

  // Metas do Mês
  const monthlyGoalVgv = selectedCity === 'all' ? 3500000 : 1500000;
  const goalPercent = monthlyGoalVgv > 0 ? Math.round((totalVgv / monthlyGoalVgv) * 100) : 0;
  const isGoalReached = goalPercent >= 100;
  const goalRemaining = Math.max(0, monthlyGoalVgv - totalVgv);

  // Ranking Dinâmico de Top Associados
  const dynamicTopAssociates = useMemo(() => {
    const brokerMap: Record<
      string,
      {
        name: string;
        vgv: number;
        commission: number;
        dealsCount: number;
        activePipeline: number;
      }
    > = {};

    filteredLeads.forEach((lead) => {
      const broker = lead.assignedTo || 'Não atribuído';
      if (!brokerMap[broker]) {
        brokerMap[broker] = {
          name: broker,
          vgv: 0,
          commission: 0,
          dealsCount: 0,
          activePipeline: 0
        };
      }

      if (lead.status === 'ganho') {
        brokerMap[broker].vgv += lead.value || 0;
        brokerMap[broker].commission += lead.commission || Math.round((lead.value || 0) * 0.03);
        brokerMap[broker].dealsCount += 1;
      } else if (lead.status !== 'perdido') {
        brokerMap[broker].activePipeline += lead.value || 0;
      }
    });

    const list = Object.values(brokerMap).sort((a, b) => {
      if (b.vgv !== a.vgv) return b.vgv - a.vgv;
      return b.activePipeline - a.activePipeline;
    });

    return list.slice(0, 5).map((item, index) => {
      const initials = item.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return {
        id: item.name,
        rank: index + 1,
        name: item.name,
        vgv: item.vgv,
        commission: item.commission,
        dealsCount: item.dealsCount,
        avatar: initials || 'CO'
      };
    });
  }, [filteredLeads]);

  // Leads em Risco (Inativos há mais de 30 dias ou com temperatura 'frio')
  const inactiveLeads = useMemo(() => {
    return filteredLeads
      .filter((l) => (l.daysInactive || 0) >= 30 || l.temperature === 'frio')
      .slice(0, 4);
  }, [filteredLeads]);

  // Tarefas de Hoje / Google Calendar
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === todayStr).slice(0, 3);
  }, [tasks, todayStr]);

  // Saudação e Data
  const greeting = useMemo(() => {
    if (!currentDate) return 'BOM DIA';
    const hour = currentDate.getHours();
    return hour < 12 ? 'BOM DIA' : hour < 18 ? 'BOA TARDE' : 'BOA NOITE';
  }, [currentDate]);

  const formattedDate = useMemo(() => {
    if (!currentDate) return 'Painel de Controle Imobiliário';
    const str = currentDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, [currentDate]);

  return (
    <div className="content-container">
      {/* Top Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)'
            }}
          >
            PANORAMA GERAL
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '3px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--brand-terracotta)',
              fontWeight: 700
            }}
          >
            {filteredLeads.length} leads no recorte
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Praça / Funil */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
          >
            <MapPin size={14} color="var(--brand-terracotta)" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12.5px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <option value="all">Todas as praças</option>
              {funnels.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
          >
            <Calendar size={14} color="var(--brand-terracotta)" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '12.5px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <option value="month">Este Mês (Outubro 2026)</option>
              <option value="today">Hoje</option>
              <option value="week">Esta Semana (7 dias)</option>
              <option value="last30">Últimos 30 dias</option>
              <option value="all">Todo o Período</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090c12 0%, #111724 60%, #1e293b 100%)',
          borderRadius: 'var(--radius-sm)',
          padding: '28px 32px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '6px'
              }}
            >
              {formattedDate}
            </div>

            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '18px'
              }}
            >
              {greeting}, GUILHERME MARTINS 👋
            </h1>

            <button
              onClick={triggerMotorAcao}
              className="btn btn-primary"
              style={{
                padding: '10px 18px',
                background: motorAcaoActive ? 'var(--brand-terracotta)' : 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(255, 255, 255, 0.25)'
              }}
            >
              <Zap size={14} color={motorAcaoActive ? '#ffffff' : 'var(--brand-terracotta)'} />
              <span>{motorAcaoActive ? 'MOTOR DE AÇÃO EM EXECUÇÃO' : 'INICIAR MOTOR DE AÇÃO'}</span>
            </button>
          </div>

          <div
            style={{
              textAlign: 'right',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              paddingLeft: '32px'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '44px',
                fontWeight: 800,
                lineHeight: 1,
                color: '#ffffff'
              }}
            >
              {newLeadsTodayCount}
            </div>
            <div
              style={{
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.75)',
                marginTop: '4px'
              }}
            >
              Novos leads hoje
            </div>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {/* VGV Realizado */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-xs)',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}
          >
            <DollarSign size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              VGV (Vendas)
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginTop: '2px' }}>
              R$ {totalVgv.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Previsto: R$ {pipelineVgv.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        {/* VGC Realizado */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-xs)',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a'
            }}
          >
            <Trophy size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              VGC (Comissão)
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginTop: '2px' }}>
              R$ {totalVgc.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Previsto: R$ {pipelineVgc.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Leads Ativos */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-xs)',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}
          >
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Leads Ativos
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginTop: '2px' }}>
              {activeLeads.length.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a' }}>
              {conversionRate}% taxa de conversão
            </div>
          </div>
        </div>

        {/* Deals Fechados */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-xs)',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309'
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Deals Fechados
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginTop: '2px' }}>
              {dealsCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {dealsCount > 0 ? `Ticket: R$ ${avgTicket.toLocaleString('pt-BR')}` : 'Nenhum fechado no recorte'}
            </div>
          </div>
        </div>
      </div>

      {/* Middle 3 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.3fr 1fr',
          gap: '20px'
        }}
      >
        {/* Previsão vs Meta */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-main)' }}>
              PREVISÃO VS META
            </h3>
            <span
              style={{
                fontSize: '12px',
                color: isGoalReached ? '#16a34a' : 'var(--brand-terracotta)',
                fontWeight: 700
              }}
            >
              {goalPercent}% atingido
            </span>
          </div>

          <div>
            <div
              style={{
                width: '100%',
                height: '7px',
                background: 'var(--bg-subtle)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, goalPercent)}%`,
                  height: '100%',
                  background: isGoalReached ? '#16a34a' : 'var(--brand-terracotta)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                R$ {totalVgv.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Realizado
              </div>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
                R$ {pipelineVgv.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Previsto (Pipeline)
              </div>
            </div>
          </div>

          {/* Goal card */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-xs)',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-xs)',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Target size={18} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1e40af' }}>
                Meta do Período — {selectedCity === 'all' ? 'Geral' : funnels.find((f) => f.id === selectedCity)?.name || selectedCity}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#1e3a8a' }}>
                R$ {monthlyGoalVgv.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: '12px', color: isGoalReached ? '#16a34a' : '#1e40af', fontWeight: 600, marginTop: '2px' }}>
                {isGoalReached ? '🎉 Meta atingida! Parabéns!' : `Faltam R$ ${goalRemaining.toLocaleString('pt-BR')} para atingir`}
              </div>
            </div>
          </div>
        </div>

        {/* Top Associados (Calculado Dinamicamente do Kanban) */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-main)' }}>
              TOP ASSOCIADOS
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              por VGV e comissão
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dynamicTopAssociates.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Nenhum corretor com vendas no período selecionado.
              </div>
            ) : (
              dynamicTopAssociates.map((assoc) => (
                <div
                  key={assoc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: assoc.rank < dynamicTopAssociates.length ? '1px solid var(--border-light)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: assoc.rank === 1 ? 'var(--brand-terracotta)' : 'var(--text-muted)'
                      }}
                    >
                      {assoc.rank === 1 ? '🥇' : assoc.rank === 2 ? '🥈' : assoc.rank === 3 ? '🥉' : `${assoc.rank}º`}
                    </div>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {assoc.avatar}
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                        {assoc.name}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                        {assoc.dealsCount} {assoc.dealsCount === 1 ? 'deal fechado' : 'deals fechados'}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      R$ {assoc.vgv.toLocaleString('pt-BR')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--brand-terracotta)', fontWeight: 600 }}>
                      Comissão: R$ {assoc.commission.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna 3: Leads em Risco & Agenda de Hoje */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--brand-terracotta)' }}>
                LEADS EM RISCO
              </h3>
              <AlertTriangle size={16} color="var(--brand-terracotta)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inactiveLeads.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px 0' }}>
                  Nenhum lead em risco de abandono na praça selecionada.
                </div>
              ) : (
                inactiveLeads.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {item.assignedTo}
                      </div>
                    </div>

                    <span className="badge badge-hot" style={{ fontSize: '10px', flexShrink: 0 }}>
                      🔥 {item.daysInactive || 30}d inativo
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Compromissos do Dia / Google Calendar */}
            {todayTasks.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    COMPROMISSOS DE HOJE
                  </span>
                  {googleCalendarSync.connected && (
                    <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>
                      ● Google Agenda
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {todayTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Clock size={12} color="var(--brand-terracotta)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.dueTime}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/kanban"
            className="btn btn-secondary"
            style={{
              marginTop: '16px',
              width: '100%',
              fontSize: '11px',
              letterSpacing: '0.08em'
            }}
          >
            <span>VER TODOS NO KANBAN</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
