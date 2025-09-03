// Simple mock contracts API and renderer

export const contractTemplates = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Founder–Creator Participation Agreement (v1)',
    jurisdiction_default: 'us',
    content: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #1a365d; font-size: 2.5em; font-weight: 700; text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 3px solid #3182ce; text-transform: uppercase; letter-spacing: 1px;">Participation Agreement</h1>
        
        <p style="font-size: 1.1em; margin-bottom: 2rem; text-align: center; color: #4a5568;">
          This Agreement is between <strong style="color: #2d3748;">{{company_name}}</strong> ("Company") and <strong style="color: #2d3748;">{{creator_name}}</strong> ("Creator").
        </p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Program Details</h2>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Program Name:</strong> <span style="color: #4a5568;">{{program_name}}</span></p>
        <p style="margin-bottom: 1.5rem;"><strong style="color: #2d3748;">Compensation:</strong> <span style="color: #4a5568;">Creator receives {{equity_pct}}% phantom equity (non-voting) or {{rev_share_pct}}% revenue share (if enabled) subject to performance.</span></p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Posting Requirements</h2>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Minimum Posts:</strong> <span style="color: #4a5568;">{{min_posts}} posts per month</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Branded Content Disclosure:</strong> <span style="color: #4a5568;">{{branded_content_required}} - FTC-compliant disclosures (#ad or #sponsored)</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Required Content Types:</strong> <span style="color: #4a5568;">{{required_content_types}}</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Required Hashtags:</strong> <span style="color: #4a5568;">{{hashtag_requirements}}</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Required Mentions:</strong> <span style="color: #4a5568;">{{mention_requirements}}</span></p>
        <p style="margin-bottom: 1.5rem;"><strong style="color: #2d3748;">Tracking Enabled:</strong> <span style="color: #4a5568;">{{tracking_enabled}} - Unique links and UTM codes for each creator</span></p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Legal Requirements</h2>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Terms & Conditions:</strong> <span style="color: #4a5568;">{{terms_required}}</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Non-Disclosure Agreement:</strong> <span style="color: #4a5568;">{{nda_required}}</span></p>
        <p style="margin-bottom: 1.5rem;"><strong style="color: #2d3748;">Custom Agreement:</strong> <span style="color: #4a5568;">{{custom_agreement}}</span></p>
        
                        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Compliance & Enforcement</h2>
                <p style="margin-bottom: 0.75rem; color: #4a5568;">Creator will comply with all applicable laws and platform rules. Fraud/clawback applies.</p>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">IP & Confidentiality:</strong> <span style="color: #4a5568;">Content license to Company; NDA applies if required.</span></p>
                
                <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Term & Termination</h2>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Contract Duration:</strong> <span style="color: #4a5568;">This agreement remains in effect until terminated by either party.</span></p>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Termination Notice:</strong> <span style="color: #4a5568;">Either party may terminate this agreement by providing {{termination_notice_days}} days written notice to the other party.</span></p>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Immediate Termination:</strong> <span style="color: #4a5568;">Either party may terminate immediately for material breach, fraud, or violation of platform terms.</span></p>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Phantom Equity Upon Termination:</strong> <span style="color: #4a5568;">If Creator has earned phantom equity through performance, Company must provide fair compensation based on time served and performance metrics.</span></p>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Compensation Calculation:</strong> <span style="color: #4a5568;">Termination compensation = ({{equity_pct}}% × months served ÷ total contract months) × company valuation at termination.</span></p>
                <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Surviving Obligations:</strong> <span style="color: #4a5568;">Confidentiality, NDA, and IP provisions survive termination. Creator retains rights to content created before termination.</span></p>
                <p style="margin-bottom: 1.5rem;"><strong style="color: #2d3748;">Dispute Resolution:</strong> <span style="color: #4a5568;">Any disputes regarding termination compensation will be resolved through {{dispute_resolution_method}}.</span></p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Legal Protections & Disclaimers</h2>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Independent Legal Review:</strong> <span style="color: #4a5568;">Both parties acknowledge they have had opportunity to consult independent legal counsel and understand all terms.</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Platform Disclaimer:</strong> <span style="color: #4a5568;">StakeShare provides contract templates for informational purposes only. We are not a law firm and do not provide legal advice.</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Liability Limitation:</strong> <span style="color: #4a5568;">Neither party shall hold StakeShare liable for any disputes, damages, or legal consequences arising from this agreement.</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Severability:</strong> <span style="color: #4a5568;">If any provision is found unenforceable, remaining provisions remain in full force and effect.</span></p>
        <p style="margin-bottom: 1.5rem;"><strong style="color: #2d3748;">Entire Agreement:</strong> <span style="color: #4a5568;">This document constitutes the entire agreement between parties, superseding all prior agreements.</span></p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Governing Law</h2>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Jurisdiction:</strong> <span style="color: #4a5568;">{{governing_law}}</span></p>
        <p style="margin-bottom: 0.75rem;"><strong style="color: #2d3748;">Venue:</strong> <span style="color: #4a5568;">{{venue}}</span></p>
        <p style="margin-bottom: 2rem;"><strong style="color: #2d3748;">Effective Date:</strong> <span style="color: #4a5568;">{{effective_date}}</span></p>
      </div>
    `
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Mutual NDA (v1)',
    jurisdiction_default: 'us',
    content: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #1a365d; font-size: 2.5em; font-weight: 700; text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 3px solid #3182ce; text-transform: uppercase; letter-spacing: 1px;">Mutual NDA</h1>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Parties</h2>
        <p style="margin-bottom: 1.5rem; color: #4a5568;"><strong style="color: #2d3748;">{{company_name}}</strong> and <strong style="color: #2d3748;">{{creator_name}}</strong></p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Purpose</h2>
        <p style="margin-bottom: 1.5rem; color: #4a5568;">Evaluate participation in <strong style="color: #2d3748;">{{program_name}}</strong></p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Terms</h2>
        <p style="margin-bottom: 0.75rem; color: #4a5568;"><strong style="color: #2d3748;">Confidential Information:</strong> All non-public information disclosed.</p>
        <p style="margin-bottom: 0.75rem; color: #4a5568;"><strong style="color: #2d3748;">Term:</strong> 2 years from Effective Date ({{effective_date}}).</p>
        <p style="margin-bottom: 1.5rem; color: #4a5568;"><strong style="color: #2d3748;">Governing Law:</strong> {{governing_law}}. <strong style="color: #2d3748;">Venue:</strong> {{venue}}.</p>
      </div>
    `
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Termination / Amendment Addendum (v1)',
    jurisdiction_default: 'us',
    content: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #1a365d; font-size: 2.5em; font-weight: 700; text-align: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 3px solid #3182ce; text-transform: uppercase; letter-spacing: 1px;">Termination / Amendment</h1>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Amendment Details</h2>
        <p style="margin-bottom: 0.75rem; color: #4a5568;"><strong style="color: #2d3748;">Agreement being amended:</strong> Participation Agreement for <strong style="color: #2d3748;">{{program_name}}</strong></p>
        <p style="margin-bottom: 0.75rem; color: #4a5568;"><strong style="color: #2d3748;">Change:</strong> {{change_summary}}</p>
        <p style="margin-bottom: 1.5rem; color: #4a5568;"><strong style="color: #2d3748;">Effective:</strong> {{effective_date}}</p>
        
        <h2 style="color: #2b6cb0; font-size: 1.8em; font-weight: 600; margin-top: 2.5rem; margin-bottom: 1.5rem; padding: 0.75rem 0; border-left: 4px solid #3182ce; padding-left: 1rem; background: linear-gradient(90deg, #ebf8ff 0%, transparent 100%);">Legal Framework</h2>
        <p style="margin-bottom: 0.75rem; color: #4a5568;"><strong style="color: #2d3748;">Governing Law:</strong> {{governing_law}}</p>
        <p style="margin-bottom: 1.5rem; color: #4a5568;"><strong style="color: #2d3748;">Venue:</strong> {{venue}}</p>
      </div>
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
