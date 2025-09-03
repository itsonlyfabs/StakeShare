import React, { useState } from 'react';
import { Rss, Send, CheckCircle } from 'lucide-react';
import { BlogSubscriber } from '@/api/entities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublicNavigation from '../components/PublicNavigation';
import PublicFooter from '@/components/PublicFooter';

export default function BlogPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    setError('');

    try {
      await BlogSubscriber.create({ email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setStatus('error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <PublicNavigation />
      <div className="text-white flex flex-col items-center justify-center text-center p-6 py-20">
        <div className="glass-card p-12 rounded-2xl max-w-3xl mx-auto">
          <Rss className="w-16 h-16 text-purple-400 mb-6 mx-auto" />
          <h1 className="text-5xl font-bold mb-4">Our Blog is Coming Soon</h1>
          <p className="text-xl text-white/70 mb-8">
            We're writing some amazing content about the future of creator economies, startup growth, and micro-investing. Be the first to know when we launch.
          </p>

          {status === 'success' ? (
            <Alert className="bg-green-500/20 border-green-500/30 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <AlertTitle>Thank You!</AlertTitle>
              <AlertDescription>
                You're on the list. We'll let you know when we post our first article.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="glass border-white/20 text-white flex-1"
                />
                <Button type="submit" disabled={status === 'loading'} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white glow">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {status === 'error' && <p className="text-red-400 text-sm">{error}</p>}
              <p className="text-white/60 text-sm">Be the first one to get the latest updates</p>
            </form>
          )}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}