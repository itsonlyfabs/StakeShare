import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText, Clock, DollarSign, User, Building2 } from "lucide-react";

export default function TerminationRequestDialog({ 
  isOpen, 
  onClose, 
  contract, 
  userRole, 
  onSubmit,
  isFounder = false,
  programCreators = []
}) {
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [compensationRequest, setCompensationRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminationScope, setTerminationScope] = useState('program'); // 'program' or 'multiple'
  const [selectedCreators, setSelectedCreators] = useState([]);

  const handleSubmit = async () => {
    if (!reason.trim() || !effectiveDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (isFounder && terminationScope === 'multiple' && selectedCreators.length === 0) {
      alert('Please select at least one creator to terminate.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        contractId: contract.id,
        reason: reason.trim(),
        effectiveDate,
        compensationRequest: compensationRequest.trim() || null,
        requestedBy: userRole,
        status: 'pending',
        terminationScope,
        // When terminating program, target all active creators (frontend hint)
        selectedCreators: isFounder 
          ? (terminationScope === 'multiple' 
              ? selectedCreators 
              : (programCreators || []).map(c => c.id))
          : null
      });
      
      // Reset form
      setReason('');
      setEffectiveDate('');
      setCompensationRequest('');
      setTerminationScope('program');
      setSelectedCreators([]);
      onClose();
    } catch (error) {
      console.error('Failed to submit termination request:', error);
      alert('Failed to submit termination request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateCompensation = () => {
    if (!contract) return null;
    
    const equityPercent = contract.equity_pct || 0;
    const monthsServed = contract.months_served || 0;
    const totalMonths = contract.total_months || 12;
    const companyValuation = contract.company_valuation || 1000000; // Default $1M
    
    if (monthsServed === 0) return null;
    
    const earnedEquity = (equityPercent / 100) * (monthsServed / totalMonths);
    const compensation = earnedEquity * companyValuation;
    
    return {
      earnedEquity: (earnedEquity * 100).toFixed(4),
      compensation: compensation.toFixed(2)
    };
  };

  const compensation = calculateCompensation();
  const isCreator = userRole === 'creator';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Request Contract Termination
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Information */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Contract Details
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Program:</span>
                <span className="text-white ml-2">{contract?.program_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-white/60">Equity:</span>
                <span className="text-white ml-2">{contract?.equity_pct || 0}%</span>
              </div>
              <div>
                <span className="text-white/60">Notice Required:</span>
                <span className="text-white ml-2">{contract?.termination_notice_days || 30} days</span>
              </div>
              <div>
                <span className="text-white/60">Status:</span>
                <span className="text-white ml-2 capitalize">{contract?.status || 'Active'}</span>
              </div>
            </div>
          </div>

          {/* Phantom Equity Calculation */}
          {compensation && compensation.earnedEquity > 0 && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h5 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Phantom Equity Compensation
              </h5>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Earned Equity:</span>
                  <span className="text-blue-300 ml-2">{compensation.earnedEquity}%</span>
                </div>
                <div>
                  <span className="text-white/60">Estimated Value:</span>
                  <span className="text-blue-300 ml-2">${compensation.compensation}</span>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-2">
                Based on {contract?.months_served || 0} months served out of {contract?.total_months || 12} total months
              </p>
            </div>
          )}

          {/* Termination Form */}
          <div className="space-y-4">
            {/* Creator Selection for Founders */}
            {isFounder && programCreators.length > 0 && (
              <div className="space-y-3">
                <Label className="text-white">Termination Scope *</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="terminationScope"
                      value="program"
                      checked={terminationScope === 'program'}
                      onChange={(e) => setTerminationScope(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                    />
                    <span className="text-white/80">Terminate Program</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="terminationScope"
                      value="multiple"
                      checked={terminationScope === 'multiple'}
                      onChange={(e) => setTerminationScope(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                    />
                    <span className="text-white/80">Select Creators</span>
                  </label>
                </div>

                {terminationScope === 'multiple' && (
                  <div className="space-y-3">
                    <Label className="text-white">Select Creators to Terminate *</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                      {programCreators.map((creator) => (
                        <label key={creator.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedCreators.includes(creator.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCreators([...selectedCreators, creator.id]);
                              } else {
                                setSelectedCreators(selectedCreators.filter(id => id !== creator.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="text-white font-medium">{creator.name}</div>
                            <div className="text-white/60 text-sm">{creator.email}</div>
                          </div>
                          <Badge className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                            Active
                          </Badge>
                        </label>
                      ))}
                    </div>
                    {selectedCreators.length === 0 && (
                      <p className="text-orange-400 text-sm">Please select at least one creator to terminate.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white">Reason for Termination *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20 text-white">
                  {isCreator && (
                    <>
                      <SelectItem value="performance_issues">Performance issues with company</SelectItem>
                      <SelectItem value="compensation_concerns">Compensation concerns</SelectItem>
                      <SelectItem value="personal_circumstances">Personal circumstances</SelectItem>
                      <SelectItem value="better_opportunity">Better opportunity elsewhere</SelectItem>
                      <SelectItem value="creative_differences">Creative differences</SelectItem>
                    </>
                  )}
                  {isFounder && (
                    <>
                      <SelectItem value="performance_issues">Creator performance issues</SelectItem>
                      <SelectItem value="contract_violation">Contract violation</SelectItem>
                      <SelectItem value="company_changes">Company direction changes</SelectItem>
                      <SelectItem value="budget_constraints">Budget constraints</SelectItem>
                      <SelectItem value="other">Other business reasons</SelectItem>
                    </>
                  )}
                  <SelectItem value="mutual_agreement">Mutual agreement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Effective Date *</Label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-white/60">
                Must be at least {contract?.termination_notice_days || 30} days from today
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Additional Details (Optional)</Label>
              <Textarea
                value={compensationRequest}
                onChange={(e) => setCompensationRequest(e.target.value)}
                placeholder="Provide additional context about the termination request..."
                className="glass border-white/20 min-h-[100px] text-white"
              />
            </div>
          </div>

          {/* Legal Notice */}
          <Alert className="border-orange-500/50 bg-orange-900/20 text-orange-100">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> This termination request will be reviewed by both parties. 
              If approved, the contract will end on the specified date and phantom equity compensation 
              will be calculated based on time served and performance metrics.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-0 bg-white/10 hover:bg-white/15 text-white rounded-md px-5 shadow-sm hover:shadow transition"
            >
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason || !effectiveDate || (isFounder && terminationScope === 'multiple' && selectedCreators.length === 0)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : (
                isFounder
                  ? (terminationScope === 'multiple'
                      ? `Terminate ${selectedCreators.length} Creator${selectedCreators.length !== 1 ? 's' : ''}`
                      : 'Request Program Termination')
                  : 'Submit Termination Request'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
