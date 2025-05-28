
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Signal } from 'lucide-react';

interface ConnectionTrackerProps {
  lastContactedBy: string;
  lastContactDate?: string;
  connectionStrength: string;
  onContactedByChange: (value: string) => void;
  onStrengthChange: (value: string) => void;
}

const TEAM_MEMBERS = [
  'Lukas Bennemann',
  'Dirk Rudolf', 
  'Noel Zeh',
  'Karim Menn'
];

const CONNECTION_STRENGTHS = [
  'Very strong',
  'Strong', 
  'Good',
  'Weak',
  'Very weak'
];

const getStrengthColor = (strength: string) => {
  switch (strength) {
    case 'Very strong': return 'bg-green-100 text-green-800 border-green-200';
    case 'Strong': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Weak': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Very weak': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export const ConnectionTracker: React.FC<ConnectionTrackerProps> = ({
  lastContactedBy,
  lastContactDate,
  connectionStrength,
  onContactedByChange,
  onStrengthChange
}) => {
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <h3 className="font-semibold text-slate-900">Connection Details</h3>
      
      <div className="space-y-3">
        {/* Last Contacted By */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <User className="h-4 w-4" />
            Last Contacted By
          </label>
          <Select value={lastContactedBy} onValueChange={onContactedByChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_MEMBERS.map(member => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Last Contact Date */}
        {lastContactDate && (
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Last Contact
            </label>
            <p className="text-sm text-slate-600">{lastContactDate}</p>
          </div>
        )}

        {/* Connection Strength */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Signal className="h-4 w-4" />
            Connection Strength
          </label>
          <Select value={connectionStrength} onValueChange={onStrengthChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select strength" />
            </SelectTrigger>
            <SelectContent>
              {CONNECTION_STRENGTHS.map(strength => (
                <SelectItem key={strength} value={strength}>
                  <Badge variant="outline" className={getStrengthColor(strength)}>
                    {strength}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Strength Display */}
        <div className="pt-2">
          <Badge className={`${getStrengthColor(connectionStrength)} px-3 py-1`}>
            {connectionStrength}
          </Badge>
        </div>
      </div>
    </div>
  );
};
