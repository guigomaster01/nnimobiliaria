export type LeadStatus = 'novo_lead' | 'em_relacionamento' | 'agendamento' | 'atendimento' | 'ganho' | 'perdido';

export type LeadTemperature = 'quente' | 'morno' | 'frio';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  value: number; // VGV estimado
  commission?: number; // VGC estimado
  status: LeadStatus;
  funnelId: string;
  temperature: LeadTemperature;
  isNewForYou?: boolean;
  origin: string; // Ex: 'LEAD FORM - CASA UBITI - SO', 'Facebook/Instagram Ads', etc.
  assignedTo: string; // Nome do corretor
  assignedAvatar?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  daysInactive?: number;
  cadenceNote?: string;
  notes?: string;
}

export interface Funnel {
  id: string;
  name: string;
  city: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  leadId?: string;
  leadName?: string;
  type: 'visita' | 'ligacao' | 'whatsapp' | 'reuniao' | 'proposta';
  priority: 'baixa' | 'media' | 'alta';
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  source?: 'crm' | 'google_calendar';
  location?: string;
  meetLink?: string;
  googleEventId?: string;
}

export interface GoogleCalendarSyncState {
  connected: boolean;
  accountEmail: string | null;
  accountName: string | null;
  accountPhoto?: string | null;
  lastSyncedAt: string | null;
  syncedEventsCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'client' | 'system';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isInternalNote?: boolean;
}

export interface ChatConversation {
  id: string;
  phone: string;
  clientName?: string;
  avatarColor?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived';
  attendant: string;
  leadId?: string;
  tags: string[];
}

export interface AssociatePerformance {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  vgv: number;
  commission: number;
}
