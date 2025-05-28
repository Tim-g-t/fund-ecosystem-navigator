
import React, { useState, useMemo } from 'react';
import { Person, VCFund } from '../types/vc-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Building2, X } from 'lucide-react';

interface SearchBarProps {
  people: Person[];
  funds: VCFund[];
  onResultSelect: (id: string, type: 'person' | 'fund') => void;
}

interface SearchResult {
  id: string;
  type: 'person' | 'fund';
  name: string;
  subtitle: string;
  relevance: number;
  matchedFields: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  people,
  funds,
  onResultSelect
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (query.length < 2) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search people
    people.forEach(person => {
      const matchedFields: string[] = [];
      let relevance = 0;

      // Name match (highest relevance)
      if (person.name.toLowerCase().includes(searchTerm)) {
        matchedFields.push('name');
        relevance += 10;
      }

      // Role match
      if (person.currentRole.toLowerCase().includes(searchTerm)) {
        matchedFields.push('role');
        relevance += 8;
      }

      // Skills match
      person.skills.forEach(skill => {
        if (skill.toLowerCase().includes(searchTerm)) {
          matchedFields.push('skills');
          relevance += 6;
        }
      });

      // Education match
      person.education.forEach(edu => {
        if (edu.institution.toLowerCase().includes(searchTerm)) {
          matchedFields.push('education');
          relevance += 5;
        }
      });

      // Previous companies match
      person.previousRoles.forEach(role => {
        if (role.company.toLowerCase().includes(searchTerm)) {
          matchedFields.push('previous experience');
          relevance += 4;
        }
      });

      // Location match
      if (person.location.toLowerCase().includes(searchTerm)) {
        matchedFields.push('location');
        relevance += 3;
      }

      // Languages match
      person.languages.forEach(lang => {
        if (lang.toLowerCase().includes(searchTerm)) {
          matchedFields.push('languages');
          relevance += 2;
        }
      });

      if (matchedFields.length > 0) {
        const currentFund = funds.find(f => f.id === person.currentFund);
        results.push({
          id: person.id,
          type: 'person',
          name: person.name,
          subtitle: `${person.currentRole} • ${currentFund?.name || 'Unknown Fund'}`,
          relevance,
          matchedFields: [...new Set(matchedFields)]
        });
      }
    });

    // Search funds
    funds.forEach(fund => {
      const matchedFields: string[] = [];
      let relevance = 0;

      // Name match (highest relevance)
      if (fund.name.toLowerCase().includes(searchTerm)) {
        matchedFields.push('name');
        relevance += 10;
      }

      // Description match
      if (fund.description.toLowerCase().includes(searchTerm)) {
        matchedFields.push('description');
        relevance += 7;
      }

      // Sector focus match
      fund.sectorFocus.forEach(sector => {
        if (sector.toLowerCase().includes(searchTerm)) {
          matchedFields.push('sector focus');
          relevance += 6;
        }
      });

      // Geography match
      fund.geography.forEach(geo => {
        if (geo.toLowerCase().includes(searchTerm)) {
          matchedFields.push('geography');
          relevance += 5;
        }
      });

      // Stage match
      fund.stage.forEach(stage => {
        if (stage.toLowerCase().includes(searchTerm)) {
          matchedFields.push('investment stage');
          relevance += 4;
        }
      });

      // Fund size match
      if (fund.fundSize.toLowerCase().includes(searchTerm)) {
        matchedFields.push('fund size');
        relevance += 3;
      }

      if (matchedFields.length > 0) {
        results.push({
          id: fund.id,
          type: 'fund',
          name: fund.name,
          subtitle: `${fund.fundSize} • ${fund.teamSize} team members`,
          relevance,
          matchedFields: [...new Set(matchedFields)]
        });
      }
    });

    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  }, [query, people, funds]);

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result.id, result.type);
    setQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search funds, people, skills, companies..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 py-2 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {searchResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {result.type === 'fund' ? (
                      <Building2 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Users className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {result.name}
                    </div>
                    <div className="text-sm text-slate-600 truncate">
                      {result.subtitle}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.matchedFields.slice(0, 3).map(field => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-slate-400">
                    {result.relevance}% match
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {isOpen && query.length >= 2 && searchResults.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <div className="p-4 text-center text-slate-500">
            No results found for "{query}"
          </div>
        </Card>
      )}
    </div>
  );
};
