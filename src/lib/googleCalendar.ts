import { Task, GoogleCalendarSyncState } from '../types/crm';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const GOOGLE_CALENDAR_EVENTS_MOCK: Array<Omit<Task, 'id'> & { googleEventId: string }> = [
  {
    title: 'Visita Decorado c/ Dr. Carlos Eduardo // Reserva Ville',
    description: 'Apresentação das plantas de 142m² e simulação do fluxo de pagamento com a construtora.',
    leadName: 'Carlos Eduardo',
    type: 'visita',
    priority: 'alta',
    dueDate: '2026-10-06',
    dueTime: '10:30',
    completed: true,
    completedAt: '2026-10-06T11:45:00',
    source: 'google_calendar',
    location: 'Av. Engenheiro Carlos Reinaldo Mendes, 1800 - Sorocaba',
    googleEventId: 'gcal_ev_101'
  },
  {
    title: 'Reunião de Alinhamento de Proposta // Rogerio Camilo',
    description: 'Discussão da proposta de permuta de veículo + financiamento bancário pré-aprovado.',
    leadName: 'Rogerio Camilo',
    type: 'reuniao',
    priority: 'alta',
    dueDate: '2026-10-06',
    dueTime: '16:00',
    completed: false,
    source: 'google_calendar',
    meetLink: 'https://meet.google.com/nn-sor-prog',
    googleEventId: 'gcal_ev_102'
  },
  {
    title: 'Vistoria Técnica de Entrega de Chaves // Edifício Ubiti',
    description: 'Conferência de acabamentos, medição e entrega das vias do memorial descritivo.',
    leadName: 'Clau L Lima',
    type: 'visita',
    priority: 'alta',
    dueDate: '2026-10-07',
    dueTime: '09:00',
    completed: false,
    source: 'google_calendar',
    location: 'Rua Ubiti, 310 - Bloco B, Apto 82 - Sorocaba',
    googleEventId: 'gcal_ev_103'
  },
  {
    title: 'Assinatura de Contrato e Financiamento Caixa // Amanda Pedrol',
    description: 'Assinatura presencial do contrato com garantia fiduciária na agência bancária.',
    leadName: 'Amanda Pedrol',
    type: 'proposta',
    priority: 'alta',
    dueDate: '2026-10-07',
    dueTime: '14:30',
    completed: false,
    source: 'google_calendar',
    location: 'Caixa Econômica Federal - Ag. Centro Sorocaba',
    googleEventId: 'gcal_ev_104'
  },
  {
    title: 'Call de Apresentação de Investimento // Larissa Tavares',
    description: 'Apresentação dos lotes com previsão de valorização de 28% nos primeiros 18 meses.',
    leadName: 'Larissa Tavares',
    type: 'reuniao',
    priority: 'media',
    dueDate: '2026-10-08',
    dueTime: '11:00',
    completed: false,
    source: 'google_calendar',
    meetLink: 'https://meet.google.com/nossonegocio-invest',
    googleEventId: 'gcal_ev_105'
  },
  {
    title: 'Visita Guiada Gran Campolim // Eugenio Silva',
    description: 'Visita à cobertura duplex no Gran Campolim com investidor para locação de alto padrão.',
    leadName: 'Eugenio Silva',
    type: 'visita',
    priority: 'alta',
    dueDate: '2026-10-09',
    dueTime: '15:00',
    completed: false,
    source: 'google_calendar',
    location: 'Rua Maria Moron Malzoni, 450 - Parque Campolim',
    googleEventId: 'gcal_ev_106'
  },
  {
    title: 'Reunião de Fechamento Trimestral // Diretoria Nosso Negócio',
    description: 'Alinhamento de metas VGV do mês de Outubro 2026 e lançamento da nova campanha digital.',
    type: 'reuniao',
    priority: 'media',
    dueDate: '2026-10-10',
    dueTime: '09:30',
    completed: false,
    source: 'google_calendar',
    meetLink: 'https://meet.google.com/nn-diretoria-2026',
    googleEventId: 'gcal_ev_107'
  }
];

export async function requestGoogleCalendarAuth(): Promise<{
  success: boolean;
  account: {
    email: string;
    name: string;
    photo?: string;
  };
  events: Task[];
}> {
  // If real Firebase Auth is configured, attempt popup with calendar scope
  if (isFirebaseConfigured) {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      // In real scenario, if accessToken exists, we could fetch:
      // https://www.googleapis.com/calendar/v3/calendars/primary/events
      // Fallback/enrich with real estate tasks:
      const convertedTasks: Task[] = GOOGLE_CALENDAR_EVENTS_MOCK.map((m, idx) => ({
        ...m,
        id: `gcal-${m.googleEventId}-${Date.now() + idx}`
      }));

      return {
        success: true,
        account: {
          email: user.email || 'guilherme.martins@nossonegocio.com.br',
          name: user.displayName || 'Guilherme Martins',
          photo: user.photoURL || undefined
        },
        events: convertedTasks
      };
    } catch (err: any) {
      console.warn('Firebase Google Auth error, falling back to interactive simulator:', err);
    }
  }

  // Simulated Google Auth response
  const convertedTasks: Task[] = GOOGLE_CALENDAR_EVENTS_MOCK.map((m, idx) => ({
    ...m,
    id: `gcal-${m.googleEventId}-${Date.now() + idx}`
  }));

  return {
    success: true,
    account: {
      email: 'guilherme.martins@nossonegocio.com.br',
      name: 'Guilherme Martins',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    },
    events: convertedTasks
  };
}
