import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  FileText,
  User,
  Building2
} from "lucide-react";

export default function TerminationManagement({ 
  contract, 
  userRole, 
  onTerminationUpdate 
}) {
  const [terminationRequests, setTerminationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in production this would come from API
  useEffect(() => {
    // Simulate loading termination requests
    const mockRequests = [
      {
        id: 1,
        requestedBy: 'creator',
        reason: 'personal_circumstances',
        reasonText: 'Personal circumstances',
        effectiveDate: '2024-04-15',
        status: 'pending',
        requestedAt: '2024-03-15T10:00:00Z',
        compensationRequest: 'Requesting fair compensation for 6 months of service',
        monthsServed: 6,
        totalMonths: 12,
        equityPercent: 0.1
      }
    ];
    setTerminationRequests(mockRequests);
  }, [contract]);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-300 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    
    return (
      <Badge className={`${variants[status] || variants.pending} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getReasonText = (reason) => {
    const reasons = {
      performance_issues: 'Performance Issues',
      compensation_concerns: 'Compensation Concerns',
      personal_circumstances: 'Personal Circumstances',
      better_opportunity: 'Better Opportunity',
      creative_differences: 'Creative Differences',
      contract_violation: 'Contract Violation',
      company_changes: 'Company Changes',
      budget_constraints: 'Budget Constraints',
      mutual_agreement: 'Mutual Agreement',
      other: 'Other'
    };
    return reasons[reason] || reason;
  };

  const calculateCompensation = (request) => {
    const equityPercent = request.equityPercent || 0;
    const monthsServed = request.monthsServed || 0;
    const totalMonths = request.totalMonths || 12;
    const companyValuation = contract?.company_valuation || 1000000; // Default $1M
    
    if (monthsServed === 0) return 0;
    
    const earnedEquity = (equityPercent / 100) * (monthsServed / totalMonths);
    const compensation = earnedEquity * companyValuation;
    
    return {
      earnedEquity: (earnedEquity * 100).toFixed(4),
      compensation: compensation.toFixed(2)
    };
  };

  const handleApprove = async (requestId) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to approve termination
      console.log('Approving termination request:', requestId);
      
      // Update local state
      setTerminationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'approved' }
            : req
        )
      );
      
      // Update contract status
      onTerminationUpdate?.({
        contractId: contract.id,
        status: 'terminated',
        terminationDate: terminationRequests.find(r => r.id === requestId)?.effectiveDate
      });
      
      alert('Termination request approved. Contract will be terminated on the specified date.');
    } catch (error) {
      console.error('Failed to approve termination:', error);
      alert('Failed to approve termination request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to reject termination
      console.log('Rejecting termination request:', requestId);
      
      // Update local state
      setTerminationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'rejected' }
            : req
        )
      );
      
      alert('Termination request rejected. Contract remains active.');
    } catch (error) {
      console.error('Failed to reject termination:', error);
      alert('Failed to reject termination request.');
    } finally {
      setIsLoading(false);
    }
  };

  const canApprove = (request) => {
    if (userRole === 'founder') {
      return request.requestedBy === 'creator' && request.status === 'pending';
    }
    if (userRole === 'creator') {
      return request.requestedBy === 'founder' && request.status === 'pending';
    }
    return false;
  };

  const canReject = (request) => {
    return canApprove(request);
  };

  if (terminationRequests.length === 0) {
    return (
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Termination Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60 text-center py-4">
            No termination requests for this contract.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Termination Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {terminationRequests.map((request) => {
          const compensation = calculateCompensation(request);
          const isRequester = request.requestedBy === userRole;
          
          return (
            <div key={request.id} className="border border-white/10 rounded-lg p-4 space-y-4">
              {/* Request Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    request.requestedBy === 'creator' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    {request.requestedBy === 'creator' ? (
                      <User className="w-4 h-4 text-green-400" />
                    ) : (
                      <Building2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {request.requestedBy === 'creator' ? 'Creator' : 'Founder'} Request
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              {/* Request Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Reason</p>
                  <p className="text-white">{getReasonText(request.reason)}</p>
                  {request.compensationRequest && (
                    <p className="text-white/80 text-sm mt-1">{request.compensationRequest}</p>
                  )}
                </div>
                <div>
                  <p className="text-white/60 text-sm">Effective Date</p>
                  <p className="text-white">{new Date(request.effectiveDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Compensation Calculation */}
              {compensation && compensation.earnedEquity > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
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
                    Based on {request.monthsServed} months served out of {request.totalMonths} total months
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {!isRequester && request.status === 'pending' && (
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}

              {/* Status Messages */}
              {request.status === 'approved' && (
                <Alert className="border-green-500/50 bg-green-500/20 text-green-100">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Termination approved. Contract will end on {new Date(request.effectiveDate).toLocaleDateString()}.
                  </AlertDescription>
                </Alert>
              )}

              {request.status === 'rejected' && (
                <Alert className="border-red-500/50 bg-red-500/20 text-red-100">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Termination request rejected. Contract remains active.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
