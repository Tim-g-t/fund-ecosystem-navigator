
import { Person, VCFund, PreviousRole, Education } from '../types/vc-data';

interface CSVRow {
  [key: string]: string;
}

export const parseCSVData = (csvData: CSVRow[]): { people: Person[], funds: VCFund[] } => {
  const people: Person[] = [];
  const fundMap = new Map<string, VCFund>();

  csvData.forEach((row, index) => {
    // Skip rows without essential data
    if (!row.firstName || !row.lastName) return;

    // Parse job experiences
    const previousRoles: PreviousRole[] = [];
    let currentFund = '';
    let currentRole = '';
    
    // Parse up to 20 job experiences
    for (let i = 1; i <= 20; i++) {
      const companyName = row[`jobExperience_${i}_company_name`];
      const position = row[`jobExperience_${i}_positions_1_function`];
      const startYear = parseInt(row[`jobExperience_${i}_positions_1_tenure_start_year`]) || 0;
      const endYear = parseInt(row[`jobExperience_${i}_positions_1_tenure_end_year`]) || new Date().getFullYear();
      
      if (companyName && position) {
        // Determine if it's a fund (simplified logic - you may want to enhance this)
        const isFund = companyName.toLowerCase().includes('capital') || 
                      companyName.toLowerCase().includes('ventures') || 
                      companyName.toLowerCase().includes('partners') ||
                      companyName.toLowerCase().includes('fund');
        
        // If it's the first (current) role and it's a fund, set as current
        if (i === 1 && isFund) {
          currentFund = companyName;
          currentRole = position;
        } else {
          previousRoles.push({
            company: companyName,
            role: position,
            startYear,
            endYear,
            isFund
          });
        }

        // Create or update fund data
        if (isFund && !fundMap.has(companyName)) {
          fundMap.set(companyName, {
            id: companyName.toLowerCase().replace(/\s+/g, '-'),
            name: companyName,
            description: '',
            foundedYear: 2000, // Default, could be enhanced
            geography: row.location_countryCode ? [row.location_countryCode] : ['Unknown'],
            sectorFocus: [], // Could be inferred from descriptions
            teamSize: 1,
            fundSize: 'Unknown',
            stage: ['Seed', 'Series A'], // Default
            website: row[`jobExperience_${i}_company_liUrl`] || '',
            currentTeam: [],
            pastTeam: [],
            growthRate: 0,
            influenceScore: 50
          });
        }
      }
    }

    // Parse education
    const education: Education[] = [];
    for (let i = 1; i <= 8; i++) {
      const institution = row[`education_${i}_company_name`];
      const subject = row[`education_${i}_subject`];
      const graduationYear = parseInt(row[`education_${i}_tenure_end_year`]) || 0;
      
      if (institution) {
        education.push({
          institution,
          degree: 'Degree', // Could be enhanced
          field: subject || 'Unknown',
          graduationYear
        });
      }
    }

    // Parse skills
    const skills: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const skill = row[`skills_${i}`];
      if (skill && skill.trim()) {
        skills.push(skill.trim());
      }
    }

    // Parse languages
    const languages: string[] = [];
    for (let i = 1; i <= 9; i++) {
      const language = row[`languages_${i}_language`];
      if (language && language.trim()) {
        languages.push(language.trim());
      }
    }

    // Calculate influence score based on available data
    const influence = Math.min(100, Math.max(0, 
      (parseInt(row.connections) || 0) / 10 + 
      (parseInt(row.followers) || 0) / 100 + 
      skills.length * 2 + 
      education.length * 5
    ));

    // Calculate tenure (years at current position)
    const currentStartYear = parseInt(row.jobExperience_1_positions_1_tenure_start_year) || new Date().getFullYear();
    const tenure = new Date().getFullYear() - currentStartYear;

    const person: Person = {
      id: `person-${index}`,
      name: `${row.firstName} ${row.lastName}`.trim(),
      currentRole: currentRole || row.headline || 'Professional',
      currentFund: currentFund || 'Unknown',
      previousRoles,
      education,
      skills,
      languages,
      location: row.location_address || 'Unknown',
      linkedinUrl: row.slug ? `https://linkedin.com/in/${row.slug}` : '',
      connections: [], // Will be populated based on shared experiences
      influence: Math.round(influence),
      tenure: Math.max(0, tenure)
    };

    people.push(person);

    // Update fund with current team member
    if (currentFund && fundMap.has(currentFund)) {
      const fund = fundMap.get(currentFund)!;
      fund.currentTeam.push(person.id);
      fund.teamSize = fund.currentTeam.length;
    }
  });

  return {
    people,
    funds: Array.from(fundMap.values())
  };
};

export const parseCSV = (csvText: string): CSVRow[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: CSVRow = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
};
