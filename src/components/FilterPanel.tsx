
import React from 'react';
import { FilterOptions } from '../types/vc-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { X, Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const EDUCATION_OPTIONS = [
  'Stanford University', 'Harvard Business School', 'MIT', 'Wharton School', 
  'INSEAD', 'London School of Economics', 'University of California, Berkeley'
];

const COMPANY_OPTIONS = [
  'Google', 'Facebook', 'Goldman Sachs', 'McKinsey & Company', 'Uber', 
  'First Round Capital', 'Kleiner Perkins', 'Accel Partners', 'Greylock Partners'
];

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

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
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
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Education</h3>
        <div className="flex flex-wrap gap-2">
          {EDUCATION_OPTIONS.map(school => (
            <Badge
              key={school}
              variant={filters.education.includes(school) ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => toggleArrayFilter('education', school)}
            >
              {school}
            </Badge>
          ))}
        </div>
      </div>

      {/* Previous Companies */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-slate-900">Previous Companies</h3>
        <div className="flex flex-wrap gap-2">
          {COMPANY_OPTIONS.map(company => (
            <Badge
              key={company}
              variant={filters.previousCompanies.includes(company) ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => toggleArrayFilter('previousCompanies', company)}
            >
              {company}
            </Badge>
          ))}
        </div>
      </div>

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
