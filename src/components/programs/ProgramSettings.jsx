import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Save, X } from 'lucide-react';

export default function ProgramSettings({ program }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgram, setEditedProgram] = useState(program);

  const handleSave = async () => {
    try {
      // Here you would typically call an API to update the program
      // await Program.update(program.id, editedProgram);
      setIsEditing(false);
      // You might want to trigger a refresh of the parent component
    } catch (error) {
      console.error('Failed to update program:', error);
    }
  };

  const handleCancel = () => {
    setEditedProgram(program);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProgram(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Program Settings</CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="glass border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-pink-500 glow"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="glass border-white/20 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Program Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedProgram.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="glass border-white/20 text-white"
                />
              ) : (
                <p className="text-white">{program.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">Status</Label>
              {isEditing ? (
                <select
                  id="status"
                  value={editedProgram.status || 'active'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-2 rounded-md glass border-white/20 text-white bg-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                </select>
              ) : (
                <Badge 
                  variant={program.status === 'active' ? 'default' : 'secondary'}
                  className={program.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                >
                  {program.status}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={editedProgram.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="glass border-white/20 text-white"
              />
            ) : (
              <p className="text-white">{program.description || 'No description available'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-white">Requirements</Label>
            {isEditing ? (
              <Textarea
                id="requirements"
                value={editedProgram.requirements || ''}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                className="glass border-white/20 text-white"
                placeholder="Enter program requirements..."
              />
            ) : (
              <p className="text-white">{program.requirements || 'No requirements specified'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_applicants" className="text-white">Max Applicants</Label>
              {isEditing ? (
                <Input
                  id="max_applicants"
                  type="number"
                  value={editedProgram.max_applicants || ''}
                  onChange={(e) => handleInputChange('max_applicants', parseInt(e.target.value) || 0)}
                  className="glass border-white/20 text-white"
                />
              ) : (
                <p className="text-white">{program.max_applicants || 'Unlimited'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_deadline" className="text-white">Application Deadline</Label>
              {isEditing ? (
                <Input
                  id="application_deadline"
                  type="date"
                  value={editedProgram.application_deadline || ''}
                  onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                  className="glass border-white/20 text-white"
                />
              ) : (
                <p className="text-white">
                  {program.application_deadline 
                    ? new Date(program.application_deadline).toLocaleDateString()
                    : 'No deadline set'
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_approve"
              checked={editedProgram.auto_approve || false}
              onCheckedChange={(checked) => handleInputChange('auto_approve', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="auto_approve" className="text-white">Auto-approve applications</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
