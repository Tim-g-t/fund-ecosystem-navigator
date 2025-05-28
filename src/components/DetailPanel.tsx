
import React, { useState } from 'react';
import { Person, VCFund } from '../types/vc-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Timeline } from './Timeline';
import { ConnectionTracker } from './ConnectionTracker';
import { CompanyDetailView } from './CompanyDetailView';
import { EducationDetailView } from './EducationDetailView';
import { SpecificFundDetailView } from './SpecificFundDetailView';
import { 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  GraduationCap,
  Briefcase,
  Globe,
  TrendingUp,
  Star,
  ArrowLeft
} from 'lucide-react';

interface DetailPanelProps {
  selectedNode: string | null;
  nodeType: 'fund' | 'person' | null;
  people: Person[];
  funds: VCFund[];
  onClose: () => void;
}

type ViewState = 'main' | 'company' | 'education' | 'specificFund' | 'person';

export const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedNode,
  nodeType,
  people,
  funds,
  onClose
}) => {
  const [viewState, setViewState] = useState<ViewState>('main');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [selectedSpecificFund, setSelectedSpecificFund] = useState<any>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const resetView = () => {
    setViewState('main');
    setSelectedCompany(null);
    setSelectedEducation(null);
    setSelectedSpecificFund(null);
    setSelectedPersonId(null);
  };

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
          setViewState('person');
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
          setViewState('person');
        }}
      />
    );
  }

  if (viewState === 'specificFund' && selectedSpecificFund) {
    return (
      <SpecificFundDetailView
        specificFund={selectedSpecificFund}
        people={people}
        onClose={resetView}
        onPersonClick={(personId) => {
          setSelectedPersonId(personId);
          setViewState('person');
        }}
      />
    );
  }

  if (viewState === 'person' && selectedPersonId) {
    const person = people.find(p => p.id === selectedPersonId);
    if (person) {
      return (
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={resetView}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">{person.name}</h2>
            <p className="text-slate-600 mb-1">{person.currentRole}</p>
            <p className="text-blue-600 font-medium">{person.currentFund}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-purple-600">Influence</div>
                <div className="text-xl font-bold text-purple-700">{person.influence}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-600">Tenure</div>
                <div className="text-xl font-bold text-blue-700">{person.tenure} years</div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Contact Info</h3>
              <div className="text-sm text-slate-600">
                <div>Last contacted by: {person.lastContactedBy}</div>
                <div>Connection strength: {person.connectionStrength}</div>
                {person.lastContactDate && <div>Last contact: {person.lastContactDate}</div>}
              </div>
            </div>
          </Card>
        </div>
      );
    }
  }

  if (!selectedNode || !nodeType) {
    return (
      <Card className="p-6 h-full flex items-center justify-center">
        <div className="text-center text-slate-500">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a fund or person to view details</p>
        </div>
      </Card>
    );
  }

  if (nodeType === 'fund') {
    const fund = funds.find(f => f.id === selectedNode);
    if (!fund) return null;

    const teamMembers = people.filter(p => fund.currentTeam.includes(p.id));
    const pastMembers = people.filter(p => fund.pastTeam.includes(p.id));

    const handleEducationClick = (institution: string) => {
      setSelectedEducation(institution);
      setViewState('education');
    };

    const handleCompanyClick = (company: string) => {
      setSelectedCompany(company);
      setViewState('company');
    };

    const handleSpecificFundClick = (specificFund: any) => {
      setSelectedSpecificFund(specificFund);
      setViewState('specificFund');
    };

    const handlePersonClick = (personId: string) => {
      setSelectedPersonId(personId);
      setViewState('person');
    };

    return (
      <Card className="p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{fund.name}</h2>
            <p className="text-slate-600">{fund.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Influence Score</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{fund.influenceScore}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{fund.growthRate}%</div>
          </div>
        </div>

        {/* Fund Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>Founded {fund.foundedYear}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="h-4 w-4" />
            <span>{fund.teamSize} team members</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="h-4 w-4" />
            <span>{fund.fundSize} AUM</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="h-4 w-4" />
            <span>
              <Button variant="link" className="p-0 h-auto text-slate-600" asChild>
                <a href={fund.website} target="_blank" rel="noopener noreferrer">
                  Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </span>
          </div>
        </div>

        {/* Specific Funds - Now Clickable */}
        {fund.specificFunds && fund.specificFunds.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Portfolio Funds</h3>
            <div className="space-y-3">
              {fund.specificFunds.map(specificFund => (
                <div 
                  key={specificFund.id} 
                  className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => handleSpecificFundClick(specificFund)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-blue-600 hover:text-blue-700">{specificFund.name}</div>
                      <div className="text-sm text-slate-600">{specificFund.size} • {specificFund.vintage}</div>
                    </div>
                    <Badge variant="outline">{specificFund.status}</Badge>
                  </div>
                  {specificFund.moic && (
                    <div className="mt-2 flex gap-4 text-xs text-slate-500">
                      <span>MOIC: {specificFund.moic}x</span>
                      {specificFund.irr && <span>IRR: {specificFund.irr}%</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geography */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Geography
          </h3>
          <div className="flex flex-wrap gap-2">
            {fund.geography.map(geo => (
              <Badge key={geo} variant="outline">{geo}</Badge>
            ))}
          </div>
        </div>

        {/* Sector Focus */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Sector Focus</h3>
          <div className="flex flex-wrap gap-2">
            {fund.sectorFocus.map(sector => (
              <Badge key={sector} variant="secondary">{sector}</Badge>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Current Team - Now Clickable */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Current Team ({teamMembers.length})</h3>
          <div className="space-y-3">
            {teamMembers.map(member => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => handlePersonClick(member.id)}
              >
                <div>
                  <div className="font-medium text-blue-600 hover:text-blue-700">{member.name}</div>
                  <div className="text-sm text-slate-600">{member.currentRole}</div>
                  {member.currentSpecificFund && (
                    <div className="text-xs text-slate-500">{member.currentSpecificFund}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Influence: {member.influence}</div>
                  <div className="text-xs text-slate-500">{member.tenure} years</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (nodeType === 'person') {
    const person = people.find(p => p.id === selectedNode);
    if (!person) return null;

    const currentFund = funds.find(f => f.id === person.currentFund);

    const handleEducationClick = (institution: string) => {
      setSelectedEducation(institution);
      setViewState('education');
    };

    const handleCompanyClick = (company: string) => {
      setSelectedCompany(company);
      setViewState('company');
    };

    const handleConnectionUpdate = (field: string, value: string) => {
      console.log(`Updating ${field} to ${value} for person ${person.id}`);
    };

    return (
      <Card className="p-6 h-full overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{person.name}</h2>
            <p className="text-lg text-slate-600">{person.currentRole}</p>
            {currentFund && (
              <p className="text-blue-600 font-medium">{currentFund.name}</p>
            )}
            {person.currentSpecificFund && (
              <p className="text-sm text-slate-500">{person.currentSpecificFund}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        {/* Connection Tracker */}
        <ConnectionTracker
          lastContactedBy={person.lastContactedBy || 'Lukas Bennemann'}
          lastContactDate={person.lastContactDate}
          connectionStrength={person.connectionStrength || 'Good'}
          onContactedByChange={(value) => handleConnectionUpdate('lastContactedBy', value)}
          onStrengthChange={(value) => handleConnectionUpdate('connectionStrength', value)}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Influence</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{person.influence}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Tenure</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{person.tenure} years</div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>{person.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="h-4 w-4" />
            <Button variant="link" className="p-0 h-auto text-slate-600" asChild>
              <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn Profile <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {person.languages.map(lang => (
              <Badge key={lang} variant="outline">{lang}</Badge>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {person.skills.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Clickable Education */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </h3>
          <div className="space-y-3">
            {person.education.map((edu, index) => (
              <div 
                key={index} 
                className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => handleEducationClick(edu.institution)}
              >
                <div className="font-medium text-blue-600 hover:text-blue-700">{edu.institution}</div>
                <div className="text-sm text-slate-600">{edu.degree} in {edu.field}</div>
                <div className="text-xs text-slate-500">{edu.graduationYear}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clickable Previous Roles */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Previous Experience
          </h3>
          <div className="space-y-3">
            {person.previousRoles.map((role, index) => (
              <div 
                key={index} 
                className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => handleCompanyClick(role.company)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{role.role}</div>
                    <div className="text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer">
                      {role.company}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      {role.startYear} - {role.endYear}
                    </div>
                    {role.isFund && (
                      <Badge variant="outline" className="text-xs mt-1">VC Fund</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invested Companies */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Portfolio Companies</h3>
          <div className="flex flex-wrap gap-2">
            {person.investedCompanies.map(company => (
              <Badge 
                key={company} 
                variant="outline" 
                className="cursor-pointer hover:bg-green-50"
                onClick={() => handleCompanyClick(company)}
              >
                {company}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return null;
};
