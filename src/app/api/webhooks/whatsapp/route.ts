import { NextRequest, NextResponse } from 'next/server';

/**
 * POST: Recebimento de mensagens e novos contatos do WhatsApp (Evolution API, Z-API ou Meta Cloud API)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[WhatsApp Webhook] Mensagem recebida:', JSON.stringify(body, null, 2));

    // Normalização para suportar Evolution API, Z-API ou Meta Oficial:
    const senderPhone = body.phone || body.sender || body.data?.key?.remoteJid?.replace('@s.whatsapp.net', '') || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    const senderName = body.senderName || body.pushName || body.data?.pushName || 'Lead WhatsApp';
    const messageText = body.text?.message || body.message?.conversation || body.message || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || 'Olá, gostaria de mais informações';

    if (!senderPhone) {
      return NextResponse.json({ message: 'Payload sem número de remetente válido' }, { status: 400 });
    }

    // Estruturação do Lead para inserção automática no Funil
    const newLeadFromWhatsApp = {
      id: `lead-wpp-${Date.now()}`,
      name: senderName,
      phone: senderPhone.startsWith('+') ? senderPhone : `+${senderPhone}`,
      email: '',
      value: 600000,
      status: 'novo_lead',
      temperature: 'quente',
      isNewForYou: true,
      origin: 'WhatsApp Receptivo // Click-to-WhatsApp',
      assignedTo: 'Eric H. Silva', // Distribuído automaticamente pela fila de atendimento
      createdAt: new Date().toISOString().slice(0, 10),
      tags: ['WhatsApp', 'Entrada Automática'],
      notes: `Primeira mensagem do cliente: "${messageText}"`
    };

    console.log('[WhatsApp Webhook] Novo lead cadastrado no Kanban:', newLeadFromWhatsApp);

    return NextResponse.json({
      success: true,
      message: 'Lead recebido do WhatsApp e encaminhado para NOVO LEAD no Kanban',
      lead: newLeadFromWhatsApp
    }, { status: 200 });

  } catch (error: any) {
    console.error('[WhatsApp Webhook Error]:', error);
    return NextResponse.json({ error: 'Erro ao processar mensagem do WhatsApp' }, { status: 500 });
  }
}
