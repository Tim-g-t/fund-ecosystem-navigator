
import React, { useState, useMemo } from 'react';
import { NetworkGraph } from '../components/NetworkGraph';
import { FilterPanel } from '../components/FilterPanel';
import { DetailPanel } from '../components/DetailPanel';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { SearchBar } from '../components/SearchBar';
import { mockPeople, mockFunds, mockConnections } from '../data/mock-data';
import { FilterOptions } from '../types/vc-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  BarChart3, 
  Filter, 
  Info, 
  Maximize2,
  Download,
  Settings
} from 'lucide-react';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<'fund' | 'person' | null>(null);
  const [activeTab, setActiveTab] = useState('network');
  const [filters, setFilters] = useState<FilterOptions>({
    education: [],
    previousCompanies: [],
    geography: [],
    sectorFocus: [],
    fundSize: [],
    languages: [],
    skills: [],
    minInfluence: 0,
    minTenure: 0
  });

  // Apply filters to data
  const filteredPeople = useMemo(() => {
    return mockPeople.filter(person => {
      // Education filter
      if (filters.education.length > 0) {
        const hasEducation = person.education.some(edu => 
          filters.education.includes(edu.institution)
        );
        if (!hasEducation) return false;
      }

      // Previous companies filter
      if (filters.previousCompanies.length > 0) {
        const hasCompany = person.previousRoles.some(role => 
          filters.previousCompanies.includes(role.company)
        );
        if (!hasCompany) return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasSkill = person.skills.some(skill => 
          filters.skills.includes(skill)
        );
        if (!hasSkill) return false;
      }

      // Languages filter
      if (filters.languages.length > 0) {
        const hasLanguage = person.languages.some(lang => 
          filters.languages.includes(lang)
        );
        if (!hasLanguage) return false;
      }

      // Influence filter
      if (person.influence < filters.minInfluence) return false;

      // Tenure filter
      if (person.tenure < filters.minTenure) return false;

      return true;
    });
  }, [filters]);

  const filteredFunds = useMemo(() => {
    return mockFunds.filter(fund => {
      // Geography filter
      if (filters.geography.length > 0) {
        const hasGeography = fund.geography.some(geo => 
          filters.geography.includes(geo)
        );
        if (!hasGeography) return false;
      }

      // Sector focus filter
      if (filters.sectorFocus.length > 0) {
        const hasSector = fund.sectorFocus.some(sector => 
          filters.sectorFocus.includes(sector)
        );
        if (!hasSector) return false;
      }

      // Fund size filter
      if (filters.fundSize.length > 0) {
        // This would need more sophisticated matching in a real app
        const matchesFundSize = filters.fundSize.some(size => {
          if (size === '$5B+' && fund.fundSize.includes('B')) {
            const amount = parseFloat(fund.fundSize.replace(/[^0-9.]/g, ''));
            return amount >= 5;
          }
          return false; // Simplified for demo
        });
        if (filters.fundSize.length > 0 && !matchesFundSize) {
          // For demo purposes, don't filter by fund size strictly
        }
      }

      return true;
    });
  }, [filters]);

  const handleNodeSelect = (nodeId: string, nodeType: 'fund' | 'person') => {
    setSelectedNode(nodeId);
    setSelectedNodeType(nodeType);
  };

  const handleSearchResultSelect = (id: string, type: 'person' | 'fund') => {
    setSelectedNode(id);
    setSelectedNodeType(type);
    setActiveTab('network'); // Switch to network view to show selection
  };

  const clearFilters = () => {
    setFilters({
      education: [],
      previousCompanies: [],
      geography: [],
      sectorFocus: [],
      fundSize: [],
      languages: [],
      skills: [],
      minInfluence: 0,
      minTenure: 0
    });
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(filter => 
      Array.isArray(filter) ? filter.length > 0 : filter > 0
    );
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              VC Intelligence Platform
            </h1>
            <p className="text-slate-600">
              Explore the venture capital ecosystem through data and relationships
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {Object.values(filters).flat().filter(f => f && f !== 0).length} filters active
              </Badge>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 max-w-md">
          <SearchBar
            people={filteredPeople}
            funds={filteredFunds}
            onResultSelect={handleSearchResultSelect}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-white border-r border-slate-200 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Center Content */}
        <div className="flex-grow flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-slate-200 px-6 py-2 bg-white">
              <TabsList>
                <TabsTrigger value="network" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Network View
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-grow p-6">
              <TabsContent value="network" className="h-full m-0">
                <Card className="h-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Network Graph</h2>
                      <p className="text-sm text-slate-600">
                        {filteredFunds.length} funds • {filteredPeople.length} people
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Maximize2 className="h-4 w-4 mr-1" />
                      Fullscreen
                    </Button>
                  </div>
                  
                  <NetworkGraph
                    funds={filteredFunds}
                    people={filteredPeople}
                    connections={mockConnections}
                    selectedNode={selectedNode}
                    onNodeSelect={handleNodeSelect}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="h-full m-0">
                <StatisticsPanel
                  people={filteredPeople}
                  funds={filteredFunds}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - Details */}
        <div className="w-96 bg-white border-l border-slate-200 flex-shrink-0">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-slate-600" />
              <h2 className="font-semibold">Details</h2>
            </div>
          </div>
          
          <DetailPanel
            selectedNode={selectedNode}
            nodeType={selectedNodeType}
            people={filteredPeople}
            funds={filteredFunds}
            onClose={() => {
              setSelectedNode(null);
              setSelectedNodeType(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
