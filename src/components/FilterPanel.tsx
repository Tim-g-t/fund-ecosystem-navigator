
import React, { useMemo } from 'react';
import { FilterOptions, Person, VCFund } from '../types/vc-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { X, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  people: Person[];
  funds: VCFund[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  people,
  funds
}) => {
  // Generate dynamic filter options from real data with safety checks
  const educationOptions = useMemo(() => {
    if (!people || people.length === 0) return [];
    
    const institutions = new Set<string>();
    people.forEach(person => {
      if (person.education) {
        person.education.forEach(edu => {
          if (edu.institution && edu.institution !== 'Unknown') {
            institutions.add(edu.institution);
          }
        });
      }
    });
    return Array.from(institutions).slice(0, 20); // Limit to 20 most common
  }, [people]);

  const companyOptions = useMemo(() => {
    if (!people || people.length === 0) return [];
    
    const companies = new Set<string>();
    people.forEach(person => {
      if (person.previousRoles) {
        person.previousRoles.forEach(role => {
          if (role.company && role.company !== 'Unknown') {
            companies.add(role.company);
          }
        });
      }
    });
    return Array.from(companies).slice(0, 20); // Limit to 20 most common
  }, [people]);

  const investedCompanyOptions = useMemo(() => {
    if (!people || people.length === 0) return [];
    
    const companies = new Set<string>();
    people.forEach(person => {
      if (person.investedCompanies) {
        person.investedCompanies.forEach(company => {
          if (company && company !== 'Unknown') {
            companies.add(company);
          }
        });
      }
    });
    return Array.from(companies).slice(0, 15); // Limit to 15 most common
  }, [people]);

  const specificFundOptions = useMemo(() => {
    if (!funds || funds.length === 0) return [];
    
    const specificFunds = new Set<string>();
    funds.forEach(fund => {
      if (fund.specificFunds) {
        fund.specificFunds.forEach(sf => {
          if (sf.name) {
            specificFunds.add(sf.name);
          }
        });
      }
    });
    return Array.from(specificFunds);
  }, [funds]);

  const GEOGRAPHY_OPTIONS = [
    'United States', 'Europe', 'Asia', 'Latin America', 'Middle East', 'Africa'
  ];

  const SECTOR_OPTIONS = [
    'Enterprise Software', 'Consumer', 'Fintech', 'Healthcare', 'AI/ML', 
    'Crypto', 'Climate Tech', 'Gaming', 'Marketplaces', 'B2B SaaS'
  ];

  const FUND_SIZE_OPTIONS = [
    '<$100M', '$100M-$500M', '$500M-$1B', '$1B-$5B', '$5B+'
  ];

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const hasActiveFilters = () => {
    return (
      filters.education.length > 0 ||
      filters.previousCompanies.length > 0 ||
      filters.geography.length > 0 ||
      filters.sectorFocus.length > 0 ||
      filters.fundSize.length > 0 ||
      filters.languages.length > 0 ||
      filters.skills.length > 0 ||
      filters.investedCompanies.length > 0 ||
      filters.specificFunds.length > 0 ||
      filters.minInfluence > 0 ||
      filters.minTenure > 0
    );
  };

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {hasActiveFilters() && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Education */}
      {educationOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-slate-900">Education</h3>
          <div className="flex flex-wrap gap-2">
            {educationOptions.map(school => (
              <Badge
                key={school}
                variant={filters.education.includes(school) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100 text-xs"
                onClick={() => toggleArrayFilter('education', school)}
              >
                {school.length > 25 ? school.substring(0, 25) + '...' : school}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Previous Companies */}
      {companyOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-slate-900">Previous Companies</h3>
          <div className="flex flex-wrap gap-2">
            {companyOptions.map(company => (
              <Badge
                key={company}
                variant={filters.previousCompanies.includes(company) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100 text-xs"
                onClick={() => toggleArrayFilter('previousCompanies', company)}
              >
                {company.length > 20 ? company.substring(0, 20) + '...' : company}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Invested In */}
      {investedCompanyOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-slate-900">Invested In</h3>
          <div className="flex flex-wrap gap-2">
            {investedCompanyOptions.map(company => (
              <Badge
                key={company}
                variant={filters.investedCompanies.includes(company) ? "default" : "outline"}
                className="cursor-pointer hover:bg-green-100 text-xs"
                onClick={() => toggleArrayFilter('investedCompanies', company)}
              >
                {company.length > 20 ? company.substring(0, 20) + '...' : company}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Specific Funds */}
      {specificFundOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-slate-900">Specific Funds</h3>
          <div className="flex flex-wrap gap-2">
            {specificFundOptions.map(fund => (
              <Badge
                key={fund}
                variant={filters.specificFunds.includes(fund) ? "default" : "outline"}
                className="cursor-pointer hover:bg-purple-100 text-xs"
                onClick={() => toggleArrayFilter('specificFunds', fund)}
              >
                {fund.length > 25 ? fund.substring(0, 25) + '...' : fund}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Geography */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Geography</h3>
        <div className="flex flex-wrap gap-2">
          {GEOGRAPHY_OPTIONS.map(geo => (
            <Badge
              key={geo}
              variant={filters.geography.includes(geo) ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => toggleArrayFilter('geography', geo)}
            >
              {geo}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sector Focus */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Sector Focus</h3>
        <div className="flex flex-wrap gap-2">
          {SECTOR_OPTIONS.map(sector => (
            <Badge
              key={sector}
              variant={filters.sectorFocus.includes(sector) ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => toggleArrayFilter('sectorFocus', sector)}
            >
              {sector}
            </Badge>
          ))}
        </div>
      </div>

      {/* Fund Size */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Fund Size</h3>
        <div className="flex flex-wrap gap-2">
          {FUND_SIZE_OPTIONS.map(size => (
            <Badge
              key={size}
              variant={filters.fundSize.includes(size) ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => toggleArrayFilter('fundSize', size)}
            >
              {size}
            </Badge>
          ))}
        </div>
      </div>

      {/* Influence Score */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Min Influence Score</h3>
        <div className="px-2">
          <Slider
            value={[filters.minInfluence]}
            onValueChange={(value) => updateFilter('minInfluence', value[0])}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-500 mt-1">
            <span>0</span>
            <span className="font-medium">{filters.minInfluence}</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Tenure */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Min Tenure (years)</h3>
        <div className="px-2">
          <Slider
            value={[filters.minTenure]}
            onValueChange={(value) => updateFilter('minTenure', value[0])}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-500 mt-1">
            <span>0</span>
            <span className="font-medium">{filters.minTenure}</span>
            <span>10+</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
