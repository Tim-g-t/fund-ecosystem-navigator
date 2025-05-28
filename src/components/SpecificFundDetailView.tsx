
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Building2, Users, Calendar, X, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { Person, SpecificFund } from '../types/vc-data';

interface SpecificFundDetailViewProps {
  specificFund: SpecificFund;
  people: Person[];
  onClose: () => void;
  onPersonClick: (personId: string) => void;
}

export const SpecificFundDetailView: React.FC<SpecificFundDetailViewProps> = ({
  specificFund,
  people,
  onClose,
  onPersonClick
}) => {
  // Find team members for this specific fund
  const teamMembers = people.filter(p => specificFund.teamMembers.includes(p.id));

  // Calculate fund performance metrics
  const performanceColor = (value: number, threshold: number) => {
    if (value >= threshold * 1.5) return 'text-green-700 bg-green-50';
    if (value >= threshold) return 'text-blue-700 bg-blue-50';
    return 'text-orange-700 bg-orange-50';
  };

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {specificFund.name}
          </h2>
          <p className="text-slate-600 mt-1">
            {specificFund.size} • Vintage {specificFund.vintage}
          </p>
          <Badge 
            variant={specificFund.status === 'Investing' ? 'default' : 'secondary'} 
            className="mt-2"
          >
            {specificFund.status}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {specificFund.moic && (
          <div className={`p-4 rounded-lg ${performanceColor(specificFund.moic, 2)}`}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">MOIC</span>
            </div>
            <div className="text-2xl font-bold">{specificFund.moic}x</div>
            <div className="text-xs opacity-75">Multiple of Invested Capital</div>
          </div>
        )}
        
        {specificFund.irr && (
          <div className={`p-4 rounded-lg ${performanceColor(specificFund.irr, 20)}`}>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">IRR</span>
            </div>
            <div className="text-2xl font-bold">{specificFund.irr}%</div>
            <div className="text-xs opacity-75">Internal Rate of Return</div>
          </div>
        )}
        
        {specificFund.dpi && (
          <div className={`p-4 rounded-lg ${performanceColor(specificFund.dpi, 0.5)}`}>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">DPI</span>
            </div>
            <div className="text-2xl font-bold">{specificFund.dpi}x</div>
            <div className="text-xs opacity-75">Distributions to Paid-In</div>
          </div>
        )}
        
        {specificFund.tvpi && (
          <div className={`p-4 rounded-lg ${performanceColor(specificFund.tvpi, 1.5)}`}>
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">TVPI</span>
            </div>
            <div className="text-2xl font-bold">{specificFund.tvpi}x</div>
            <div className="text-xs opacity-75">Total Value to Paid-In</div>
          </div>
        )}
      </div>

      {/* Fund Lifecycle Progress */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Fund Lifecycle
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Fund Age</span>
              <span>{new Date().getFullYear() - specificFund.vintage} years</span>
            </div>
            <Progress 
              value={Math.min(100, ((new Date().getFullYear() - specificFund.vintage) / 10) * 100)} 
              className="h-2" 
            />
          </div>
          
          {specificFund.dpi && specificFund.tvpi && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Realization Progress</span>
                <span>{((specificFund.dpi / specificFund.tvpi) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={(specificFund.dpi / specificFund.tvpi) * 100} 
                className="h-2" 
              />
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Companies */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Portfolio Companies</h3>
        <div className="grid grid-cols-1 gap-2">
          {specificFund.investments.length > 0 ? (
            specificFund.investments.map((investment, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                <span className="font-medium">{investment}</span>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
            ))
          ) : (
            <div className="text-slate-500 text-center py-4">
              No portfolio companies listed
            </div>
          )}
        </div>
      </div>

      {/* Fund Team */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Fund Team ({teamMembers.length})
        </h3>
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div 
              key={member.id} 
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => onPersonClick(member.id)}
            >
              <div>
                <div className="font-medium text-blue-600 hover:text-blue-700">{member.name}</div>
                <div className="text-sm text-slate-600">{member.currentRole}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Influence: {member.influence}</div>
                <div className="text-xs text-slate-500">{member.tenure} years</div>
              </div>
            </div>
          ))}
          {teamMembers.length === 0 && (
            <div className="text-slate-500 text-center py-4">
              No team members assigned to this fund
            </div>
          )}
        </div>
      </div>

      {/* Performance Benchmark */}
      {specificFund.irr && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="font-semibold mb-3">Performance vs. Benchmark</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Fund IRR</span>
              <span className="font-medium">{specificFund.irr}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Industry Median</span>
              <span className="text-slate-500">15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Top Quartile</span>
              <span className="text-slate-500">25%</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-1" />
            View Portfolio
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            Performance Report
          </Button>
        </div>
      </div>
    </Card>
  );
};
