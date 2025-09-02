import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageCircle, 
  ExternalLink,
  Calendar,
  MapPin
} from 'lucide-react';

export default function ApplicantsTable({ applications, onUpdate, title }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      // Here you would typically call an API to update the application status
      // await Application.update(applicationId, { status: newStatus });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the parent's update function to refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { color: 'bg-blue-500', text: 'Applied' },
      under_review: { color: 'bg-yellow-500', text: 'Under Review' },
      approved: { color: 'bg-green-500', text: 'Approved' },
      rejected: { color: 'bg-red-500', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.applied;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (!applications || applications.length === 0) {
    return (
      <Card className="glass-card border-white/20">
        <CardContent className="p-8 text-center">
          <p className="text-white/70 text-lg">No {title.toLowerCase()} found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-white/70">Creator</TableHead>
              <TableHead className="text-white/70">Applied</TableHead>
              <TableHead className="text-white/70">Location</TableHead>
              <TableHead className="text-white/70">Followers</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => {
              const creator = application.creator;
              if (!creator) return null;

              return (
                <TableRow key={application.id} className="border-white/20">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={creator.avatar_url} alt={creator.name} />
                        <AvatarFallback className="bg-white/10 text-white">
                          {creator.name?.charAt(0)?.toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{creator.name}</div>
                        <div className="text-sm text-white/70">@{creator.username || 'username'}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1 text-white/70">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(application.created_at)}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1 text-white/70">
                      <MapPin className="h-4 w-4" />
                      <span>{creator.location || 'N/A'}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-white">
                    {creator.followers_count ? creator.followers_count.toLocaleString() : 'N/A'}
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {application.status === 'applied' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, 'approved')}
                            disabled={updatingId === application.id}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updatingId === application.id}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {application.status === 'under_review' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application.id, 'approved')}
                            disabled={updatingId === application.id}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            disabled={updatingId === application.id}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass border-white/20 text-white hover:bg-white/10"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      
                      {creator.profile_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(creator.profile_url, '_blank')}
                          className="glass border-white/20 text-white hover:bg-white/10"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Profile
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
