import { supabase } from '@/lib/supabase';

export async function createContractDraft({ templateId, variables, contentHtml, contentHash, programId = null, companyId = null }) {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const userId = userData?.user?.id;
  if (!userId) throw new Error('Supabase session not found. Please log in before issuing contracts.');

  const { data, error } = await supabase
    .from('contracts')
    .insert({
      template_id: templateId,
      program_id: programId,
      company_id: companyId,
      issued_by: userId,
      status: 'draft',
      variables,
      content_html: contentHtml,
      content_hash: contentHash,
      jurisdiction: variables?.jurisdiction || variables?.governing_law || null,
      governing_law: variables?.governing_law || null,
      venue: variables?.venue || null
    })
    .select('*')
    .single();
  if (error) throw new Error(`Insert contracts failed: ${error.message}`);
  return data;
}

export async function addContractParty({ contractId, role, email, fullName, userId = null }) {
  const { data, error } = await supabase
    .from('contract_parties')
    .insert({ contract_id: contractId, role, email, full_name: fullName || null, user_id: userId })
    .select('*')
    .single();
  if (error) throw new Error(`Insert party failed: ${error.message}`);
  return data;
}

export async function addContractEvent({ contractId, eventType, payload = {} }) {
  const { data, error } = await supabase
    .from('contract_events')
    .insert({ contract_id: contractId, event_type: eventType, payload })
    .select('*')
    .single();
  if (error) throw new Error(`Insert event failed: ${error.message}`);
  return data;
}

export async function addContractVersion({ contractId, version, contentHtml, contentHash, pdfPath = null }) {
  const { data, error } = await supabase
    .from('contract_versions')
    .insert({ contract_id: contractId, version, content_html: contentHtml, content_hash: contentHash, pdf_path: pdfPath })
    .select('*')
    .single();
  if (error) throw new Error(`Insert version failed: ${error.message}`);
  return data;
}
