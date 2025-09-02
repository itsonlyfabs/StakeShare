// Simple mock contracts API and renderer

export const contractTemplates = [
  {
    id: 'participation_agreement_v1',
    name: 'Founder–Creator Participation Agreement (v1)',
    jurisdiction_default: 'us',
    content: `
      <h1>Participation Agreement</h1>
      <p>This Agreement is between <strong>{{company_name}}</strong> ("Company") and <strong>{{creator_name}}</strong> ("Creator").</p>
      <p>Program: {{program_name}}</p>
      <p>Compensation: Creator receives {{equity_pct}}% phantom equity (non-voting) or {{rev_share_pct}}% revenue share (if enabled) subject to performance.</p>
      <p>Posting: Creator agrees to minimum {{min_posts}} posts/month and to include FTC-compliant disclosures.</p>
      <p>Compliance: Creator will comply with all applicable laws and platform rules. Fraud/clawback applies.</p>
      <p>IP & Confidentiality: Content license to Company; NDA applies if required.</p>
      <p>Term & Termination: Either party may terminate for breach. Obligations accrued survive.</p>
      <p>Governing Law: {{governing_law}}. Venue: {{venue}}.</p>
      <p>Date: {{effective_date}}</p>
    `
  },
  {
    id: 'mutual_nda_v1',
    name: 'Mutual NDA (v1)',
    jurisdiction_default: 'us',
    content: `
      <h1>Mutual NDA</h1>
      <p>Parties: {{company_name}} and {{creator_name}}</p>
      <p>Purpose: Evaluate participation in {{program_name}}</p>
      <p>Confidential Information: All non-public information disclosed.</p>
      <p>Term: 2 years from Effective Date ({{effective_date}}).</p>
      <p>Governing Law: {{governing_law}}. Venue: {{venue}}.</p>
    `
  },
  {
    id: 'termination_addendum_v1',
    name: 'Termination / Amendment Addendum (v1)',
    jurisdiction_default: 'us',
    content: `
      <h1>Termination / Amendment</h1>
      <p>Agreement being amended: Participation Agreement for {{program_name}}.</p>
      <p>Change: {{change_summary}}</p>
      <p>Effective: {{effective_date}}</p>
      <p>Governing Law: {{governing_law}}. Venue: {{venue}}.</p>
    `
  }
];

export function listTemplates() {
  return contractTemplates.map(({ id, name }) => ({ id, name }));
}

export function getTemplateById(id) {
  return contractTemplates.find(t => t.id === id) || null;
}

export function renderTemplate(templateId, variables) {
  const tpl = getTemplateById(templateId);
  if (!tpl) return '';
  let html = tpl.content;
  Object.entries(variables || {}).forEach(([k, v]) => {
    const re = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
    html = html.replace(re, String(v ?? ''));
  });
  // Clean any unreplaced tokens
  html = html.replace(/{{\s*[^}]+\s*}}/g, '');
  return html;
}
