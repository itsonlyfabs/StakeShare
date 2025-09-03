import React, { useState } from 'react';
import { Mail, HelpCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PublicNavigation from '../components/PublicNavigation';
import PublicFooter from '@/components/PublicFooter';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) return;
    setStatus('loading');
    try {
      const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY;
      const groupId = import.meta.env.VITE_MAILERLITE_CONTACT_GROUP_ID; // create a "Contact Requests" group and set this ID
      const payload = {
        email,
        fields: {
          name: fullName || 'Visitor',
          message
        },
        groups: groupId ? [groupId] : []
      };
      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('MailerLite request failed');
      setStatus('success');
      setFullName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('MailerLite error:', err);
      setStatus('error');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl md:text-2xl text-white/80 mb-6">We'd love to hear from you. Here's how you can reach us.</p>
            
            <div className="flex justify-center items-center gap-4">
              <a 
                href="https://x.com/coachfabs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>@coachfabs</span>
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl space-y-4">
              <Mail className="w-10 h-10 text-cyan-400" />
              <h2 className="text-2xl font-bold">General Inquiries</h2>
              <p className="text-white/70">For general questions, partnerships, or media inquiries, please email us.</p>
              <Button asChild variant="link" className="text-cyan-400 p-0 text-lg">
                <a href="mailto:info@thehubhq.xyz">info@thehubhq.xyz</a>
              </Button>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-4">
              <HelpCircle className="w-10 h-10 text-purple-400" />
              <h2 className="text-2xl font-bold">Founder Support</h2>
              <p className="text-white/70">Need help setting up your program or have a technical question? Reach out to our founder support team.</p>
              <Button asChild variant="link" className="text-purple-400 p-0 text-lg">
                <a href="mailto:founders@thehubhq.xyz">founders@thehubhq.xyz</a>
              </Button>
            </div>
            <div className="glass-card p-8 rounded-2xl space-y-4 md:col-span-2">
              <Users className="w-10 h-10 text-pink-400" />
              <h2 className="text-2xl font-bold">Creator Support</h2>
              <p className="text-white/70">If you're a creator with questions about applying to programs or getting paid, our creator success team is here for you.</p>
              <Button asChild variant="link" className="text-pink-400 p-0 text-lg">
                <a href="mailto:creators@thehubhq.xyz">creators@thehubhq.xyz</a>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-2xl space-y-6 mt-10">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="text-white/80 text-sm">Got a question, partnership idea, or feedback? We’d love to hear from you. Share a few details and our team will reply within one business day.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Full name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="glass border-white/20 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Email *</label>
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="glass border-white/20 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Message *</label>
                <Textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="glass border-white/20 text-white min-h-[140px]" />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={status==='loading'} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  {status==='loading' ? 'Sending...' : 'Send message'}
                </Button>
                {status==='success' && <span className="text-emerald-300 text-sm">Thanks! We received your message.</span>}
                {status==='error' && <span className="text-red-300 text-sm">Failed to send. Check API key/group ID.</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}