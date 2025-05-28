
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Building2 } from 'lucide-react';

interface TimelineEntry {
  id: string;
  name: string;
  role?: string;
  company?: string;
  institution?: string;
  startYear: number;
  endYear?: number;
  startMonth?: number;
  endMonth?: number;
  current?: boolean;
  overlap?: boolean;
  type: 'education' | 'experience';
}

interface TimelineProps {
  entries: TimelineEntry[];
  title: string;
  onEntryClick: (entry: TimelineEntry) => void;
  highlightedPeople?: string[];
}

export const Timeline: React.FC<TimelineProps> = ({
  entries,
  title,
  onEntryClick,
  highlightedPeople = []
}) => {
  const sortedEntries = entries.sort((a, b) => {
    if (a.startYear !== b.startYear) {
      return b.startYear - a.startYear;
    }
    return (b.startMonth || 0) - (a.startMonth || 0);
  });

  const formatDate = (year: number, month?: number) => {
    if (month) {
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return year.toString();
  };

  const getDuration = (entry: TimelineEntry) => {
    const start = formatDate(entry.startYear, entry.startMonth);
    const end = entry.current ? 'Present' : 
      entry.endYear ? formatDate(entry.endYear, entry.endMonth) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        {title}
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
        
        <div className="space-y-4">
          {sortedEntries.map((entry, index) => (
            <div
              key={entry.id}
              className={`relative flex items-start gap-4 cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors ${
                entry.overlap ? 'bg-amber-50 border border-amber-200' : ''
              }`}
              onClick={() => onEntryClick(entry)}
            >
              {/* Timeline dot */}
              <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                entry.current ? 'bg-blue-500 border-blue-500' :
                entry.overlap ? 'bg-amber-500 border-amber-500' :
                'bg-white border-slate-300'
              }`}></div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {entry.type === 'education' ? entry.institution : entry.company}
                    </h4>
                    {entry.role && (
                      <p className="text-sm text-slate-600">{entry.role}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {getDuration(entry)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {entry.current && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                    {entry.overlap && (
                      <Badge variant="outline" className="text-xs bg-amber-50">
                        <Users className="h-3 w-3 mr-1" />
                        Overlap
                      </Badge>
                    )}
                  </div>
                </div>
                
                {highlightedPeople.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {highlightedPeople.slice(0, 3).map((person, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {person}
                      </Badge>
                    ))}
                    {highlightedPeople.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{highlightedPeople.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
