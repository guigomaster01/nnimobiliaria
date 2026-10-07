'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, LeadStatus, Task, ChatConversation, ChatMessage, Funnel, GoogleCalendarSyncState } from '../types/crm';
import {
  INITIAL_LEADS,
  INITIAL_TASKS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_FUNNELS
} from '../data/mockData';
import { requestGoogleCalendarAuth } from '../lib/googleCalendar';

interface CrmContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Funnels
  funnels: Funnel[];
  selectedFunnelId: string;
  setSelectedFunnelId: (id: string) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStatus: (id: string, newStatus: LeadStatus) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Chat
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  sendMessage: (conversationId: string, text: string, isInternal?: boolean) => void;

  // Action engine (Motor de Ação)
  motorAcaoActive: boolean;
  triggerMotorAcao: () => void;

  // Modals
  modalOpen: 'none' | 'new_lead' | 'new_task' | 'lead_detail';
  selectedLeadId: string | null;
  openNewLeadModal: () => void;
  openNewTaskModal: () => void;
  openLeadDetailModal: (leadId: string) => void;
  closeModals: () => void;
  // Google Calendar Integration
  googleCalendarSync: GoogleCalendarSyncState;
  connectGoogleCalendar: (accountOverride?: { email: string; name: string; photo?: string }) => Promise<{ count: number }>;
  syncGoogleCalendar: () => Promise<number>;
  disconnectGoogleCalendar: () => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_KEY_LEADS = 'imobiliaria_crm_leads';
const STORAGE_KEY_TASKS = 'imobiliaria_crm_tasks';
const STORAGE_KEY_CONVS = 'imobiliaria_crm_conversations';
const STORAGE_KEY_MSGS = 'imobiliaria_crm_messages';
const STORAGE_KEY_DARK = 'imobiliaria_crm_darkmode';
const STORAGE_KEY_SIDEBAR = 'imobiliaria_crm_sidebar_collapsed';
const STORAGE_KEY_GCAL = 'imobiliaria_crm_google_calendar_sync';

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [funnels] = useState<Funnel[]>(INITIAL_FUNNELS);
  const [selectedFunnelId, setSelectedFunnelId] = useState<string>('funil_sorocaba');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [motorAcaoActive, setMotorAcaoActive] = useState<boolean>(false);
  const [googleCalendarSync, setGoogleCalendarSync] = useState<GoogleCalendarSyncState>({
    connected: false,
    accountEmail: null,
    accountName: null,
    accountPhoto: null,
    lastSyncedAt: null,
    syncedEventsCount: 0
  });

  // Modals
  const [modalOpen, setModalOpen] = useState<'none' | 'new_lead' | 'new_task' | 'lead_detail'>('none');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedDark = localStorage.getItem(STORAGE_KEY_DARK);
      if (storedDark !== null) {
        setIsDarkMode(storedDark === 'true');
      }

      const storedSidebar = localStorage.getItem(STORAGE_KEY_SIDEBAR);
      if (storedSidebar !== null) {
        setIsSidebarCollapsed(storedSidebar === 'true');
      }

      const storedLeads = localStorage.getItem(STORAGE_KEY_LEADS);
      if (storedLeads) {
        const parsed: Lead[] = JSON.parse(storedLeads);
        const hasWonLeads = parsed.some((l) => l.status === 'ganho');
        if (!hasWonLeads) {
          const wonFromInitial = INITIAL_LEADS.filter((l) => l.status === 'ganho');
          const merged = [...parsed, ...wonFromInitial];
          setLeads(merged);
          localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(merged));
        } else {
          setLeads(parsed);
        }
      }

      const storedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      if (storedTasks) setTasks(JSON.parse(storedTasks));

      const storedConvs = localStorage.getItem(STORAGE_KEY_CONVS);
      if (storedConvs) setConversations(JSON.parse(storedConvs));

      const storedMsgs = localStorage.getItem(STORAGE_KEY_MSGS);
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));

      const storedGcal = localStorage.getItem(STORAGE_KEY_GCAL);
      if (storedGcal) setGoogleCalendarSync(JSON.parse(storedGcal));
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(STORAGE_KEY_DARK, String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_SIDEBAR, String(next));
      return next;
    });
  };
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const updated = leads.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString().slice(0, 10) } : item
    );
    setLeads(updated);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  };

  const deleteLead = (id: string) => {
    const updated = leads.filter((item) => item.id !== id);
    setLeads(updated);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    if (selectedLeadId === id) {
      setModalOpen('none');
      setSelectedLeadId(null);
    }
  };

  const moveLeadStatus = (id: string, newStatus: LeadStatus) => {
    updateLead(id, { status: newStatus });
  };

  // Tasks actions
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : undefined
          }
        : t
    );
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
  };

  // Google Calendar Integration Handlers
  const connectGoogleCalendar = async (accountOverride?: { email: string; name: string; photo?: string }): Promise<{ count: number }> => {
    const authRes = await requestGoogleCalendarAuth();
    const account = accountOverride || authRes.account;
    const newEvents = authRes.events;

    setTasks((prev) => {
      const existingGcalIds = new Set(prev.map((t) => t.googleEventId).filter(Boolean));
      const toAdd = newEvents.filter((e) => !existingGcalIds.has(e.googleEventId));
      const merged = [...toAdd, ...prev];
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(merged));
      return merged;
    });

    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    const syncState: GoogleCalendarSyncState = {
      connected: true,
      accountEmail: account.email,
      accountName: account.name,
      accountPhoto: account.photo || null,
      lastSyncedAt: nowStr,
      syncedEventsCount: newEvents.length
    };

    setGoogleCalendarSync(syncState);
    localStorage.setItem(STORAGE_KEY_GCAL, JSON.stringify(syncState));

    return { count: newEvents.length };
  };

  const syncGoogleCalendar = async (): Promise<number> => {
    const authRes = await requestGoogleCalendarAuth();
    const newEvents = authRes.events;

    setTasks((prev) => {
      const taskMap = new Map(prev.map((t) => [t.googleEventId, t]));
      const updatedEvents = newEvents.map((ev) => {
        const existing = taskMap.get(ev.googleEventId);
        return existing ? { ...ev, completed: existing.completed, completedAt: existing.completedAt, id: existing.id } : ev;
      });

      const otherTasks = prev.filter((t) => !t.googleEventId);
      const combined = [...updatedEvents, ...otherTasks];
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(combined));
      return combined;
    });

    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    setGoogleCalendarSync((prev) => {
      const updated: GoogleCalendarSyncState = {
        ...prev,
        lastSyncedAt: nowStr,
        syncedEventsCount: newEvents.length
      };
      localStorage.setItem(STORAGE_KEY_GCAL, JSON.stringify(updated));
      return updated;
    });

    return newEvents.length;
  };

  const disconnectGoogleCalendar = () => {
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.source !== 'google_calendar');
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(filtered));
      return filtered;
    });

    const emptyState: GoogleCalendarSyncState = {
      connected: false,
      accountEmail: null,
      accountName: null,
      accountPhoto: null,
      lastSyncedAt: null,
      syncedEventsCount: 0
    };
    setGoogleCalendarSync(emptyState);
    localStorage.removeItem(STORAGE_KEY_GCAL);
  };

  // Chat actions
  const sendMessage = (conversationId: string, text: string, isInternal = false) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isInternalNote: isInternal
    };

    const currentList = messages[conversationId] || [];
    const updatedMsgs = {
      ...messages,
      [conversationId]: [...currentList, newMsg]
    };
    setMessages(updatedMsgs);
    localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updatedMsgs));

    // Update conversation lastMessage
    const updatedConvs = conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            lastMessage: text,
            lastMessageTime: newMsg.timestamp
          }
        : c
    );
    setConversations(updatedConvs);
    localStorage.setItem(STORAGE_KEY_CONVS, JSON.stringify(updatedConvs));
  };

  const triggerMotorAcao = () => {
    setMotorAcaoActive(true);
    setTimeout(() => {
      setMotorAcaoActive(false);
    }, 3000);
  };

  // Modals
  const openNewLeadModal = () => {
    setModalOpen('new_lead');
  };

  const openNewTaskModal = () => {
    setModalOpen('new_task');
  };

  const openLeadDetailModal = (leadId: string) => {
    setSelectedLeadId(leadId);
    setModalOpen('lead_detail');
  };

  const closeModals = () => {
    setModalOpen('none');
    setSelectedLeadId(null);
  };

  return (
    <CrmContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        funnels,
        selectedFunnelId,
        setSelectedFunnelId,
        leads,
        addLead,
        updateLead,
        deleteLead,
        moveLeadStatus,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        motorAcaoActive,
        triggerMotorAcao,
        modalOpen,
        selectedLeadId,
        openNewLeadModal,
        openNewTaskModal,
        openLeadDetailModal,
        closeModals,
        googleCalendarSync,
        connectGoogleCalendar,
        syncGoogleCalendar,
        disconnectGoogleCalendar,
        isSidebarCollapsed,
        toggleSidebar
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
}
