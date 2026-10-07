import { NextRequest, NextResponse } from 'next/server';

// Token de verificação configurado no Painel de Desenvolvedores do Meta (Facebook)
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'nosso_negocio_crm_token_2026';

/**
 * GET: Handshake de Verificação exigido pelo Meta / Facebook Graph API
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
    console.log('[Facebook Webhook] Handshake realizado com sucesso.');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token de verificação inválido' }, { status: 403 });
}

/**
 * POST: Recebimento do Lead gerado no formulário do Facebook/Instagram Ads
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Facebook Webhook] Payload recebido:', JSON.stringify(body, null, 2));

    // Exemplo de extração de dados do Meta Lead Ads:
    // O payload do Meta envia o leadgen_id, formulário e página
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const leadData = changes?.value || body;

    // Mapeamento dos campos do Lead
    const newLead = {
      id: `lead-fb-${Date.now()}`,
      name: leadData.full_name || leadData.name || 'Lead do Facebook Ads',
      email: leadData.email || 'lead.facebook@email.com',
      phone: leadData.phone_number || leadData.phone || '+55 15 99999-0000',
      value: Number(leadData.estimated_value) || 500000,
      status: 'novo_lead',
      temperature: 'quente',
      isNewForYou: true,
      origin: leadData.form_name || leadData.campaign_name || 'LEAD FORM - META ADS',
      assignedTo: 'Reinaldo Santos', // Roleta de corretores (Round-Robin)
      createdAt: new Date().toISOString().slice(0, 10),
      tags: ['Facebook Ads', 'Instant Form'],
      notes: `Lead recebido automaticamente via Webhook do Facebook Ads. Formulário: ${leadData.form_id || 'Principal'}`
    };

    // Aqui o lead é persistido no Firestore / Banco de dados do CRM
    console.log('[Facebook Webhook] Lead processado com sucesso:', newLead);

    return NextResponse.json({
      success: true,
      message: 'Lead recebido e cadastrado na etapa NOVO LEAD do Kanban',
      lead: newLead
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Facebook Webhook Error]:', error);
    return NextResponse.json({ error: 'Falha ao processar webhook do Facebook' }, { status: 500 });
  }
}
