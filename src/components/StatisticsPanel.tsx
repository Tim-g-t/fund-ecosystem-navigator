
import React, { useState } from 'react';
import { Person, VCFund } from '../types/vc-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CompanyDetailView } from './CompanyDetailView';
import { EducationDetailView } from './EducationDetailView';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Building2, 
  Globe,
  Star,
  Award,
  Network,
  ArrowLeft
} from 'lucide-react';

interface StatisticsPanelProps {
  people: Person[];
  funds: VCFund[];
}

type ViewState = 'main' | 'company' | 'education';

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  people,
  funds
}) => {
  const [viewState, setViewState] = useState<ViewState>('main');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const resetView = () => {
    setViewState('main');
    setSelectedCompany(null);
    setSelectedEducation(null);
    setSelectedPersonId(null);
  };

  const handleCompanyClick = (company: string) => {
    setSelectedCompany(company);
    setViewState('company');
  };

  const handleEducationClick = (institution: string) => {
    setSelectedEducation(institution);
    setViewState('education');
  };

  // Show detailed views
  if (viewState === 'company' && selectedCompany) {
    const companyEmployees = people
      .filter(person => 
        person.previousRoles.some(role => role.company === selectedCompany) ||
        person.currentFund === selectedCompany
      )
      .map(person => {
        const role = person.previousRoles.find(r => r.company === selectedCompany);
        const isCurrent = person.currentFund === selectedCompany;
        return {
          id: person.id,
          name: person.name,
          role: isCurrent ? person.currentRole : (role?.role || 'Unknown'),
          startYear: isCurrent ? (new Date().getFullYear() - person.tenure) : (role?.startYear || 0),
          endYear: isCurrent ? undefined : role?.endYear,
          startMonth: role?.startMonth,
          endMonth: role?.endMonth,
          current: isCurrent || !role?.endYear
        };
      });

    return (
      <CompanyDetailView
        companyName={selectedCompany}
        employees={companyEmployees}
        people={people}
        onClose={resetView}
        onPersonClick={(personId) => {
          setSelectedPersonId(personId);
        }}
      />
    );
  }

  if (viewState === 'education' && selectedEducation) {
    return (
      <EducationDetailView
        institutionName={selectedEducation}
        people={people}
        onClose={resetView}
        onPersonClick={(personId) => {
          setSelectedPersonId(personId);
        }}
      />
    );
  }

  // Calculate power clusters
  const educationClusters = people.reduce((acc, person) => {
    person.education.forEach(edu => {
      acc[edu.institution] = (acc[edu.institution] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const companyClusters = people.reduce((acc, person) => {
    person.previousRoles.forEach(role => {
      if (!role.isFund) {
        acc[role.company] = (acc[role.company] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  // Top education institutions
  const topEducation = Object.entries(educationClusters)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Top previous companies
  const topCompanies = Object.entries(companyClusters)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Fund growth rates - now based on portfolio companies
  const topGrowthFunds = funds
    .map(fund => ({
      ...fund,
      portfolioSize: fund.specificFunds?.reduce((acc, sf) => acc + sf.investments.length, 0) || 0
    }))
    .sort((a, b) => b.portfolioSize - a.portfolioSize)
    .slice(0, 5);

  // High influence individuals
  const topInfluencers = people
    .sort((a, b) => b.influence - a.influence)
    .slice(0, 5);

  // Geographic distribution
  const geoDistribution = funds.reduce((acc, fund) => {
    fund.geography.forEach(geo => {
      acc[geo] = (acc[geo] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Average metrics
  const avgInfluence = people.reduce((sum, p) => sum + p.influence, 0) / people.length;
  const avgTenure = people.reduce((sum, p) => sum + p.tenure, 0) / people.length;
  const avgTeamSize = funds.reduce((sum, f) => sum + f.teamSize, 0) / funds.length;
  const avgGrowthRate = funds.reduce((sum, f) => sum + f.growthRate, 0) / funds.length;

  // Calculate total portfolio companies across all funds
  const totalPortfolioCompanies = funds.reduce((acc, fund) => {
    return acc + (fund.specificFunds?.reduce((sfAcc, sf) => sfAcc + sf.investments.length, 0) || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">VC Funds</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{funds.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-slate-600">Individuals</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{people.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-600">Avg Influence</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgInfluence.toFixed(0)}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-slate-600">Portfolio Cos</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalPortfolioCompanies}</div>
        </Card>
      </div>

      {/* Power Clusters - Now Clickable */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Education Power Clusters
          </h3>
          <div className="space-y-3">
            {topEducation.map(([institution, count]) => (
              <div key={institution} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span 
                    className="font-medium cursor-pointer text-blue-600 hover:text-blue-700"
                    onClick={() => handleEducationClick(institution)}
                  >
                    {institution}
                  </span>
                  <span className="text-slate-500">{count} alumni</span>
                </div>
                <Progress value={(count / people.length) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Corporate Alumni Networks
          </h3>
          <div className="space-y-3">
            {topCompanies.map(([company, count]) => (
              <div key={company} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span 
                    className="font-medium cursor-pointer text-green-600 hover:text-green-700"
                    onClick={() => handleCompanyClick(company)}
                  >
                    {company}
                  </span>
                  <span className="text-slate-500">{count} alumni</span>
                </div>
                <Progress value={(count / people.length) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Portfolio Funds */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          Largest Portfolio Funds (by Company Count)
        </h3>
        <div className="space-y-4">
          {topGrowthFunds.map((fund, index) => (
            <div key={fund.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium">{fund.name}</div>
                  <div className="text-sm text-slate-600">{fund.teamSize} team members</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">{fund.portfolioSize}</div>
                <div className="text-xs text-slate-500">portfolio cos</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Influence Leaders */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-600" />
          Highest Influence Individuals
        </h3>
        <div className="space-y-4">
          {topInfluencers.map((person, index) => (
            <div key={person.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-slate-600">
                    {person.currentRole} • {funds.find(f => f.id === person.currentFund)?.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{person.influence}</div>
                <div className="text-xs text-slate-500">influence</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Geographic Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-600" />
          Geographic Distribution
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(geoDistribution)
            .sort(([,a], [,b]) => b - a)
            .map(([region, count]) => (
              <div key={region} className="flex items-center justify-between">
                <span className="font-medium">{region}</span>
                <Badge variant="outline">{count} funds</Badge>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};
