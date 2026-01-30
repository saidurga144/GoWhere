
import { Destination, BudgetRange, TravelStyle, Climate } from './types';

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Kerala',
    country: 'India',
    description: 'Tropical state known for backwaters, houseboats, beaches, and tea plantations.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.RELAXATION, TravelStyle.NATURE],
    climateType: Climate.TROPICAL,
    popularActivities: ['Backwater Tours', 'Beach', 'Ayurveda', 'Tea Plantations'],
    bestMonths: ['November', 'December', 'January', 'February'],
    imageUrl: 'https://picsum.photos/seed/kerala/800/600',
    averageCostPerDay: 50
  },
  {
    id: '2',
    name: 'Rajasthan',
    country: 'India',
    description: 'Land of palaces, forts, deserts, and vibrant culture. Home to Jaipur, Jodhpur, and Udaipur.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.CULTURAL, TravelStyle.ADVENTURE],
    climateType: Climate.ARID,
    popularActivities: ['Palace Tours', 'Desert Safari', 'Photography', 'Shopping'],
    bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    imageUrl: 'https://picsum.photos/seed/rajasthan/800/600',
    averageCostPerDay: 40
  },
  {
    id: '3',
    name: 'Himachal Pradesh',
    country: 'India',
    description: 'Mountainous state with snow-capped peaks, valleys, and adventure activities.',
    budgetLevel: BudgetRange.MODERATE,
    primaryStyles: [TravelStyle.ADVENTURE, TravelStyle.NATURE],
    climateType: Climate.COLD,
    popularActivities: ['Trekking', 'Skiing', 'Mountain Views', 'Paragliding'],
    bestMonths: ['May', 'June', 'September', 'October'],
    imageUrl: 'https://picsum.photos/seed/himachal/800/600',
    averageCostPerDay: 60
  },
  {
    id: '4',
    name: 'Goa',
    country: 'India',
    description: 'Coastal state famous for beaches, Portuguese colonial architecture, and nightlife.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.RELAXATION, TravelStyle.URBAN],
    climateType: Climate.TROPICAL,
    popularActivities: ['Beach', 'Water Sports', 'Nightlife', 'Churches'],
    bestMonths: ['November', 'December', 'January', 'February'],
    imageUrl: 'https://picsum.photos/seed/goa/800/600',
    averageCostPerDay: 55
  },
  {
    id: '5',
    name: 'Tamil Nadu',
    country: 'India',
    description: 'Ancient temples, beaches, and rich cultural heritage in South India.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.CULTURAL, TravelStyle.NATURE],
    climateType: Climate.TROPICAL,
    popularActivities: ['Temple Tours', 'Beach', 'Art & Crafts', 'Backwaters'],
    bestMonths: ['October', 'November', 'December', 'January'],
    imageUrl: 'https://picsum.photos/seed/tamilnadu/800/600',
    averageCostPerDay: 45
  },
  {
    id: '6',
    name: 'Uttarakhand',
    country: 'India',
    description: 'Himalayan state with sacred sites, tea estates, waterfalls, and adventure.',
    budgetLevel: BudgetRange.MODERATE,
    primaryStyles: [TravelStyle.ADVENTURE, TravelStyle.NATURE],
    climateType: Climate.TEMPERATE,
    popularActivities: ['Trekking', 'River Rafting', 'Meditation', 'Tea Gardens'],
    bestMonths: ['March', 'April', 'May', 'September', 'October'],
    imageUrl: 'https://picsum.photos/seed/uttarakhand/800/600',
    averageCostPerDay: 55
  },
  {
    id: '7',
    name: 'Jaipur',
    country: 'India',
    description: 'The Pink City - famous for City Palace, Hawa Mahal, and Jantar Mantar.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.CULTURAL, TravelStyle.URBAN],
    climateType: Climate.ARID,
    popularActivities: ['Palace Tours', 'Shopping', 'Photography', 'Markets'],
    bestMonths: ['October', 'November', 'December', 'January', 'February'],
    imageUrl: 'https://picsum.photos/seed/jaipur/800/600',
    averageCostPerDay: 45
  },
  {
    id: '8',
    name: 'West Bengal',
    country: 'India',
    description: 'Cultural hub with Darjeeling tea, Kolkata museums, and Himalayan foothills.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.CULTURAL, TravelStyle.NATURE],
    climateType: Climate.TEMPERATE,
    popularActivities: ['Tea Plantations', 'Hill Stations', 'Museums', 'Local Culture'],
    bestMonths: ['October', 'November', 'December', 'March', 'April'],
    imageUrl: 'https://picsum.photos/seed/darjeeling/800/600',
    averageCostPerDay: 50
  },
  {
    id: '9',
    name: 'Maharashtra',
    country: 'India',
    description: 'State with Mumbai\'s energy, Pune\'s culture, and natural attractions.',
    budgetLevel: BudgetRange.MODERATE,
    primaryStyles: [TravelStyle.URBAN, TravelStyle.CULTURAL],
    climateType: Climate.TROPICAL,
    popularActivities: ['City Life', 'Forts', 'Waterfalls', 'Shopping'],
    bestMonths: ['October', 'November', 'December', 'January', 'February'],
    imageUrl: 'https://picsum.photos/seed/maharashtra/800/600',
    averageCostPerDay: 60
  },
  {
    id: '10',
    name: 'Karnataka',
    country: 'India',
    description: 'South Indian state with coffee plantations, temples, and beautiful landscapes.',
    budgetLevel: BudgetRange.BUDGET,
    primaryStyles: [TravelStyle.NATURE, TravelStyle.CULTURAL],
    climateType: Climate.TEMPERATE,
    popularActivities: ['Coffee Plantations', 'Temples', 'Waterfalls', 'Trekking'],
    bestMonths: ['October', 'November', 'December', 'January', 'February'],
    imageUrl: 'https://picsum.photos/seed/karnataka/800/600',
    averageCostPerDay: 50
  },
];

export const ACTIVITY_OPTIONS = [
  'Hiking', 'Beach', 'Temples', 'Nightlife', 'Skiing', 'Surfing', 
  'Fine Dining', 'Historical Sites', 'Photography', 'Shopping', 
  'Yoga & Wellness', 'Street Food', 'Wildlife', 'Backwaters'
];
