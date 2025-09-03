import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";
import TerminationRequestDialog from "./TerminationRequestDialog";

export default function TerminationRequestButton({ 
  contract, 
  userRole, 
  className = "",
  variant = "outline",
  isFounder = false,
  programCreators = []
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitTermination = async (terminationData) => {
    try {
      // TODO: Implement API call to submit termination request
      console.log('Submitting termination request:', terminationData);
      
      // For now, just log the request
      // In production, this would call an API endpoint
      alert('Termination request submitted successfully! It will be reviewed by both parties.');
      
    } catch (error) {
      console.error('Failed to submit termination request:', error);
      throw error;
    }
  };

  const getButtonText = () => {
    if (contract?.status === 'terminated') return 'Contract Terminated';
    if (contract?.status === 'termination_pending') return 'Termination Pending';
    return 'Request Termination';
  };

  const getButtonVariant = () => {
    if (contract?.status === 'terminated') return 'secondary';
    if (contract?.status === 'termination_pending') return 'outline';
    return variant;
  };

  const isDisabled = contract?.status === 'terminated' || contract?.status === 'termination_pending';

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={isDisabled}
        variant={getButtonVariant()}
        className={`${className} ${
          contract?.status === 'terminated' 
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
            : contract?.status === 'termination_pending'
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200'
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
        }`}
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        {getButtonText()}
      </Button>

      <TerminationRequestDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        contract={contract}
        userRole={userRole}
        onSubmit={handleSubmitTermination}
        isFounder={isFounder}
        programCreators={programCreators}
      />
    </>
  );
}
