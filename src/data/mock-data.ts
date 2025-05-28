import { Person, VCFund, Connection } from '../types/vc-data';

export const mockPeople: Person[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    currentRole: 'Partner',
    currentFund: 'a16z',
    previousRoles: [
      { company: 'Goldman Sachs', role: 'VP', startYear: 2015, endYear: 2018, isFund: false },
      { company: 'First Round Capital', role: 'Principal', startYear: 2018, endYear: 2021, isFund: true }
    ],
    education: [
      { institution: 'Stanford University', degree: 'MBA', field: 'Business', graduationYear: 2015 },
      { institution: 'MIT', degree: 'BS', field: 'Computer Science', graduationYear: 2013 }
    ],
    skills: ['Machine Learning', 'Fintech', 'Enterprise Software'],
    languages: ['English', 'Mandarin'],
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    connections: ['2', '3', '4'],
    influence: 89,
    tenure: 3,
    investedCompanies: ['Stripe', 'Airbnb', 'Coinbase']
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    currentRole: 'Managing Partner',
    currentFund: 'Sequoia Capital',
    previousRoles: [
      { company: 'Google', role: 'Product Manager', startYear: 2012, endYear: 2016, isFund: false },
      { company: 'Kleiner Perkins', role: 'Associate', startYear: 2016, endYear: 2019, isFund: true }
    ],
    education: [
      { institution: 'Harvard Business School', degree: 'MBA', field: 'Business', graduationYear: 2012 },
      { institution: 'University of California, Berkeley', degree: 'BS', field: 'Economics', graduationYear: 2010 }
    ],
    skills: ['Consumer Tech', 'Mobile', 'AI/ML'],
    languages: ['English', 'Spanish'],
    location: 'Menlo Park, CA',
    linkedinUrl: 'https://linkedin.com/in/marcusrodriguez',
    connections: ['1', '3', '5'],
    influence: 94,
    tenure: 5,
    investedCompanies: ['WhatsApp', 'Instagram', 'YouTube']
  },
  {
    id: '3',
    name: 'Elena Volkova',
    currentRole: 'Principal',
    currentFund: 'Index Ventures',
    previousRoles: [
      { company: 'McKinsey & Company', role: 'Senior Associate', startYear: 2017, endYear: 2020, isFund: false },
      { company: 'Rocket Internet', role: 'Investment Manager', startYear: 2020, endYear: 2022, isFund: true }
    ],
    education: [
      { institution: 'INSEAD', degree: 'MBA', field: 'Business', graduationYear: 2017 },
      { institution: 'London School of Economics', degree: 'MSc', field: 'Finance', graduationYear: 2015 }
    ],
    skills: ['Fintech', 'B2B SaaS', 'European Markets'],
    languages: ['English', 'German', 'Russian'],
    location: 'London, UK',
    linkedinUrl: 'https://linkedin.com/in/elenavolkova',
    connections: ['1', '2', '4'],
    influence: 76,
    tenure: 2,
    investedCompanies: ['Revolut', 'Skype', 'Adyen']
  },
  {
    id: '4',
    name: 'James Park',
    currentRole: 'Partner',
    currentFund: 'Bessemer Venture Partners',
    previousRoles: [
      { company: 'Uber', role: 'Director of Strategy', startYear: 2014, endYear: 2018, isFund: false },
      { company: 'Accel Partners', role: 'Principal', startYear: 2018, endYear: 2021, isFund: true }
    ],
    education: [
      { institution: 'Wharton School', degree: 'MBA', field: 'Business', graduationYear: 2014 },
      { institution: 'Stanford University', degree: 'BS', field: 'Engineering', graduationYear: 2012 }
    ],
    skills: ['Mobility', 'Enterprise Software', 'Growth Strategy'],
    languages: ['English', 'Korean'],
    location: 'New York, NY',
    linkedinUrl: 'https://linkedin.com/in/jamespark',
    connections: ['1', '3', '5'],
    influence: 82,
    tenure: 3,
    investedCompanies: ['Shopify', 'Zoom', 'Twilio']
  },
  {
    id: '5',
    name: 'Amanda Foster',
    currentRole: 'General Partner',
    currentFund: 'Lightspeed Venture Partners',
    previousRoles: [
      { company: 'Facebook', role: 'Product Director', startYear: 2013, endYear: 2017, isFund: false },
      { company: 'Greylock Partners', role: 'Partner', startYear: 2017, endYear: 2022, isFund: true }
    ],
    education: [
      { institution: 'Stanford Graduate School of Business', degree: 'MBA', field: 'Business', graduationYear: 2013 },
      { institution: 'Harvard University', degree: 'BA', field: 'Computer Science', graduationYear: 2011 }
    ],
    skills: ['Consumer Social', 'Mobile Apps', 'Product Strategy'],
    languages: ['English'],
    location: 'Palo Alto, CA',
    linkedinUrl: 'https://linkedin.com/in/amandafoster',
    connections: ['2', '4'],
    influence: 91,
    tenure: 2,
    investedCompanies: ['Snapchat', 'Discord', 'Figma']
  }
];

export const mockFunds: VCFund[] = [
  {
    id: 'a16z',
    name: 'Andreessen Horowitz',
    description: 'Software is eating the world',
    foundedYear: 2009,
    geography: ['United States', 'Global'],
    sectorFocus: ['Enterprise Software', 'Consumer', 'Crypto', 'Biotech'],
    teamSize: 180,
    fundSize: '$18.8B',
    stage: ['Seed', 'Series A', 'Series B', 'Growth'],
    website: 'https://a16z.com',
    currentTeam: ['1'],
    pastTeam: [],
    growthRate: 25,
    influenceScore: 98
  },
  {
    id: 'sequoia',
    name: 'Sequoia Capital',
    description: 'Help daring founders build legendary companies',
    foundedYear: 1972,
    geography: ['United States', 'India', 'Southeast Asia', 'Europe'],
    sectorFocus: ['Enterprise', 'Consumer', 'Healthcare', 'Financial Services'],
    teamSize: 150,
    fundSize: '$85B',
    stage: ['Seed', 'Series A', 'Series B', 'Growth'],
    website: 'https://sequoiacap.com',
    currentTeam: ['2'],
    pastTeam: [],
    growthRate: 18,
    influenceScore: 99
  },
  {
    id: 'index',
    name: 'Index Ventures',
    description: 'European and Israeli early-stage VC',
    foundedYear: 1996,
    geography: ['Europe', 'Israel'],
    sectorFocus: ['Enterprise Software', 'Fintech', 'Gaming', 'Marketplaces'],
    teamSize: 45,
    fundSize: '$2.3B',
    stage: ['Seed', 'Series A', 'Series B'],
    website: 'https://indexventures.com',
    currentTeam: ['3'],
    pastTeam: [],
    growthRate: 35,
    influenceScore: 84
  },
  {
    id: 'bessemer',
    name: 'Bessemer Venture Partners',
    description: 'Forge the future',
    foundedYear: 1911,
    geography: ['United States', 'Europe', 'India', 'Israel'],
    sectorFocus: ['Cloud', 'Consumer', 'Healthcare', 'Fintech'],
    teamSize: 90,
    fundSize: '$10.5B',
    stage: ['Seed', 'Series A', 'Series B', 'Growth'],
    website: 'https://bvp.com',
    currentTeam: ['4'],
    pastTeam: [],
    growthRate: 22,
    influenceScore: 88
  },
  {
    id: 'lightspeed',
    name: 'Lightspeed Venture Partners',
    description: 'Partnering with exceptional entrepreneurs',
    foundedYear: 2000,
    geography: ['United States', 'Europe', 'India', 'Southeast Asia'],
    sectorFocus: ['Enterprise', 'Consumer', 'Fintech', 'Healthcare'],
    teamSize: 120,
    fundSize: '$7.1B',
    stage: ['Seed', 'Series A', 'Series B', 'Growth'],
    website: 'https://lsvp.com',
    currentTeam: ['5'],
    pastTeam: [],
    growthRate: 28,
    influenceScore: 89
  }
];

export const mockConnections: Connection[] = [
  {
    id: '1',
    person1: '1',
    person2: '2',
    connectionType: 'education',
    strength: 0.8,
    details: 'Both attended Stanford (MBA programs, overlapping years)'
  },
  {
    id: '2',
    person1: '1',
    person2: '3',
    connectionType: 'previous_company',
    strength: 0.6,
    details: 'Both worked in fintech sector'
  },
  {
    id: '3',
    person1: '2',
    person2: '5',
    connectionType: 'previous_company',
    strength: 0.9,
    details: 'Both worked at tech giants (Google, Facebook)'
  },
  {
    id: '4',
    person1: '1',
    person2: '4',
    connectionType: 'education',
    strength: 0.7,
    details: 'Both Stanford alumni'
  },
  {
    id: '5',
    person1: '3',
    person2: '4',
    connectionType: 'linkedin_mutual',
    strength: 0.5,
    details: '15+ mutual connections on LinkedIn'
  }
];
