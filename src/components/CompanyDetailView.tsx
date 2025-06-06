
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Calendar, MapPin, X, TrendingUp, Star } from 'lucide-react';
import { Person } from '../types/vc-data';
import { Timeline } from './Timeline';

interface CompanyEmployee {
  id: string;
  name: string;
  role: string;
  startYear: number;
  endYear?: number;
  startMonth?: number;
  endMonth?: number;
  current: boolean;
}

interface CompanyDetailViewProps {
  companyName: string;
  employees: CompanyEmployee[];
  people: Person[];
  onClose: () => void;
  onPersonClick: (personId: string) => void;
}

export const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({
  companyName,
  employees,
  people,
  onClose,
  onPersonClick
}) => {
  const timelineEntries = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    role: emp.role,
    company: companyName,
    startYear: emp.startYear,
    endYear: emp.endYear,
    startMonth: emp.startMonth,
    endMonth: emp.endMonth,
    current: emp.current,
    type: 'experience' as const
  }));

  const currentEmployees = employees.filter(emp => emp.current);
  const formerEmployees = employees.filter(emp => !emp.current);

  // Calculate company insights
  const avgTenure = employees.reduce((sum, emp) => {
    const tenure = emp.current ? 
      new Date().getFullYear() - emp.startYear : 
      (emp.endYear || new Date().getFullYear()) - emp.startYear;
    return sum + tenure;
  }, 0) / employees.length;

  const avgInfluence = employees.reduce((sum, emp) => {
    const person = people.find(p => p.id === emp.id);
    return sum + (person?.influence || 0);
  }, 0) / employees.length;

  const handleTimelineClick = (entry: any) => {
    onPersonClick(entry.id);
  };

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {companyName}
          </h2>
          <p className="text-slate-600 mt-1">
            {employees.length} connection{employees.length !== 1 ? 's' : ''} in your network
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Current</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{currentEmployees.length}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Former</span>
          </div>
          <div className="text-2xl font-bold text-slate-700">{formerEmployees.length}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Avg Influence</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{avgInfluence.toFixed(0)}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Avg Tenure</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{avgTenure.toFixed(1)}y</div>
        </div>
      </div>

      {/* Team Members by Position */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Team by Position</h3>
        <div className="space-y-2">
          {Object.entries(
            employees.reduce((acc, emp) => {
              acc[emp.role] = (acc[emp.role] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
            .sort(([,a], [,b]) => b - a)
            .map(([role, count]) => (
              <div key={role} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <span className="font-medium">{role}</span>
                <Badge variant="outline">{count} {count === 1 ? 'person' : 'people'}</Badge>
              </div>
            ))}
        </div>
      </div>

      {/* Interactive Timeline */}
      <Timeline
        entries={timelineEntries}
        title={`Network Timeline at ${companyName}`}
        onEntryClick={handleTimelineClick}
      />

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" />
            View All Connections
          </Button>
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-1" />
            Company Profile
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            Growth Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
};
