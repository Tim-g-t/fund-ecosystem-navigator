
export interface Person {
  id: string;
  name: string;
  currentRole: string;
  currentFund: string;
  previousRoles: PreviousRole[];
  education: Education[];
  skills: string[];
  languages: string[];
  location: string;
  linkedinUrl: string;
  connections: string[]; // IDs of other people
  influence: number; // 0-100 score
  tenure: number; // years at current fund
  investedCompanies: string[]; // Companies they've invested in
}

export interface PreviousRole {
  company: string;
  role: string;
  startYear: number;
  endYear: number;
  isFund: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
}

export interface VCFund {
  id: string;
  name: string;
  description: string;
  foundedYear: number;
  geography: string[];
  sectorFocus: string[];
  teamSize: number;
  fundSize: string;
  stage: string[];
  website: string;
  currentTeam: string[]; // Person IDs
  pastTeam: string[]; // Person IDs
  growthRate: number; // team growth % last 2 years
  influenceScore: number; // 0-100
}

export interface Connection {
  id: string;
  person1: string;
  person2: string;
  connectionType: 'education' | 'previous_company' | 'linkedin_mutual' | 'accelerator' | 'co_authored';
  strength: number; // 0-1
  details: string;
}

export interface FilterOptions {
  education: string[];
  previousCompanies: string[];
  geography: string[];
  sectorFocus: string[];
  fundSize: string[];
  languages: string[];
  skills: string[];
  investedCompanies: string[];
  minInfluence: number;
  minTenure: number;
}
