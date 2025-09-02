import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PayoutDialog({ creator, isOpen, onOpenChange }) {
  const [amount, setAmount] = useState('');
  const [payoutType, setPayoutType] = useState('revenue_share');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayout = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/functions/createCreatorPayout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: creator.stripe_connect_id, // Creator's Stripe account
          amount: parseFloat(amount),
          currency: 'usd',
          description: description || `Manual payout - ${payoutType.replace('_', ' ')}`,
          creatorId: creator.id
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Payout sent successfully!');
        onOpenChange(false);
        setAmount('');
        setDescription('');
      } else {
        alert(`Payout failed: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to process payout');
    }
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <DollarSign className="w-6 h-6 mr-2" />
            Send Payout to {creator?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert className="bg-blue-500/10 border-blue-500/30 text-white">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Note: Automated payouts are sent when conversions happen. Use this for manual adjustments or bonuses.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="glass border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payoutType">Payout Type</Label>
            <Select value={payoutType} onValueChange={setPayoutType}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="glass-card bg-slate-800/90 text-white border-slate-700">
                <SelectItem value="revenue_share">Revenue Share</SelectItem>
                <SelectItem value="equity_bonus">Equity Bonus</SelectItem>
                <SelectItem value="milestone_bonus">Milestone Bonus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Q1 performance bonus"
              className="glass border-white/20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayout} 
            disabled={isProcessing || !amount}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <DollarSign className="w-4 h-4 mr-2" />}
            {isProcessing ? 'Processing...' : 'Send Payout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}