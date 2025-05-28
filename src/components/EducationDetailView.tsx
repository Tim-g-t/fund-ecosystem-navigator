
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Calendar, X, ArrowLeft } from 'lucide-react';
import { Person } from '../types/vc-data';
import { Timeline } from './Timeline';

interface EducationDetailViewProps {
  institutionName: string;
  people: Person[];
  onClose: () => void;
  onPersonClick: (personId: string) => void;
}

export const EducationDetailView: React.FC<EducationDetailViewProps> = ({
  institutionName,
  people,
  onClose,
  onPersonClick
}) => {
  // Find all people who attended this institution
  const alumni = people.filter(person => 
    person.education.some(edu => edu.institution === institutionName)
  );

  // Create timeline entries for all alumni
  const timelineEntries = alumni.map(person => {
    const education = person.education.find(edu => edu.institution === institutionName);
    return {
      id: person.id,
      name: person.name,
      role: `${education?.degree} in ${education?.field}`,
      institution: institutionName,
      startYear: education?.startYear || education?.graduationYear - 4 || 2000,
      endYear: education?.graduationYear,
      startMonth: education?.startMonth,
      endMonth: education?.endMonth,
      current: false,
      type: 'education' as const
    };
  }).sort((a, b) => (b.endYear || 0) - (a.endYear || 0));

  // Group by graduation year for overlap detection
  const graduationYears = timelineEntries.reduce((acc, entry) => {
    const year = entry.endYear || 0;
    if (!acc[year]) acc[year] = [];
    acc[year].push(entry);
    return acc;
  }, {} as Record<number, typeof timelineEntries>);

  // Mark overlapping periods
  const enhancedEntries = timelineEntries.map(entry => ({
    ...entry,
    overlap: graduationYears[entry.endYear || 0]?.length > 1
  }));

  const handleTimelineClick = (entry: any) => {
    onPersonClick(entry.id);
  };

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            {institutionName}
          </h2>
          <p className="text-slate-600 mt-1">
            {alumni.length} alumni in your network
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Alumni Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Total Alumni</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{alumni.length}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Years Span</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {Math.max(...timelineEntries.map(e => e.endYear || 0)) - 
             Math.min(...timelineEntries.map(e => e.startYear))}
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <Timeline
        entries={enhancedEntries}
        title={`Alumni Timeline at ${institutionName}`}
        onEntryClick={handleTimelineClick}
      />

      {/* Graduation Year Clusters */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Graduation Year Clusters</h3>
        <div className="space-y-2">
          {Object.entries(graduationYears)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .slice(0, 5)
            .map(([year, graduates]) => (
              <div key={year} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <span className="font-medium">{year}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{graduates.length} graduates</Badge>
                  {graduates.length > 1 && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Overlap
                    </Badge>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" />
            View All Alumni
          </Button>
          <Button variant="outline" size="sm">
            <GraduationCap className="h-4 w-4 mr-1" />
            Institution Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};
