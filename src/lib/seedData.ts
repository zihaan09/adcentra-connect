import { 
  User, 
  RFP, 
  Proposal, 
  Hold, 
  Campaign, 
  Screen, 
  Notification,
  SupportTicket,
  ChatMessage
} from '@/types';
import { 
  generateId, 
  generateRFPId, 
  generateCampaignId, 
  generateProposalId, 
  generateHoldId, 
  generateTicketId,
  addDays,
  addHours
} from '@/lib/utils';

// Sample users
export const sampleUsers: User[] = [
  {
    id: 'user-advertiser-1',
    email: 'advertiser@acme.com',
    name: 'Rahul Kumar',
    role: 'advertiser',
    companyName: 'Acme Corporation',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'user-owner-1',
    email: 'owner@metro.com',
    name: 'Priya Sharma',
    role: 'owner',
    companyName: 'Metro Media',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'user-owner-2',
    email: 'owner@cityads.com',
    name: 'Amit Patel',
    role: 'owner',
    companyName: 'City Ads',
    createdAt: new Date('2024-01-20').toISOString(),
  },
];

// Sample screens
export const sampleScreens: Screen[] = [
  {
    id: 'screen-1',
    name: 'Digital LED Indiranagar',
    location: '100 Feet Road Indiranagar',
    city: 'Bangalore',
    type: 'digital',
    environment: 'outdoor',
    format: 'Hoarding',
    size: '12\' x 8\'',
    illumination: 'LED',
    baseRate: 18000,
    discountedRate: 16000,
    status: 'active',
    ownerId: 'user-owner-1',
    image: '/placeholder.svg',
    availability: [],
  },
  {
    id: 'screen-2',
    name: 'Static Hoarding Koramangala',
    location: 'Koramangala 5th Block Main Road',
    city: 'Bangalore',
    type: 'static',
    environment: 'outdoor',
    format: 'Hoarding',
    size: '20\' x 12\'',
    illumination: 'Back lit',
    baseRate: 55000,
    discountedRate: 50000,
    status: 'active',
    ownerId: 'user-owner-1',
    image: '/placeholder.svg',
    availability: [],
  },
  {
    id: 'screen-3',
    name: 'UB City Digital Screen',
    location: 'UB City Mall Vittal Mallya Road',
    city: 'Bangalore',
    type: 'digital',
    environment: 'indoor',
    format: 'Signage',
    size: '10\' x 6\'',
    illumination: 'LED',
    baseRate: 22000,
    discountedRate: 20000,
    status: 'active',
    ownerId: 'user-owner-2',
    image: '/placeholder.svg',
    availability: [],
  },
  {
    id: 'screen-4',
    name: 'Phoenix Mall Digital',
    location: 'Phoenix MarketCity Whitefield',
    city: 'Bangalore',
    type: 'digital',
    environment: 'indoor',
    format: 'Signage',
    size: '8\' x 5\'',
    illumination: 'LED',
    baseRate: 15000,
    discountedRate: 13500,
    status: 'active',
    ownerId: 'user-owner-2',
    image: '/placeholder.svg',
    availability: [],
  },
  {
    id: 'screen-5',
    name: 'MG Road Static Billboard',
    location: 'MG Road Near Trinity Circle',
    city: 'Bangalore',
    type: 'static',
    environment: 'outdoor',
    format: 'Billboard',
    size: '24\' x 12\'',
    illumination: 'Front lit',
    baseRate: 75000,
    discountedRate: 68000,
    status: 'active',
    ownerId: 'user-owner-1',
    image: '/placeholder.svg',
    availability: [],
  },
];

// Sample RFPs
export const sampleRFPs: RFP[] = [
  {
    id: generateRFPId(),
    campaignName: 'Festive Launch 2024',
    type: 'normal',
    budget: 500000,
    budgetRange: { min: 300000, max: 500000 },
    startDate: addDays(new Date(), 7).toISOString().split('T')[0],
    endDate: addDays(new Date(), 37).toISOString().split('T')[0],
    cities: ['Bangalore'],
    mediaTypes: ['digital', 'static'],
    objective: 'Brand awareness for festive season',
    notes: 'Targeting premium locations in Bangalore',
    attachments: [],
    status: 'open',
    advertiserId: 'user-advertiser-1',
    createdAt: new Date().toISOString(),
    expiresAt: addHours(new Date(), 48).toISOString(),
    proposalCount: 2,
  },
  {
    id: generateRFPId(),
    campaignName: 'Diwali Campaign',
    type: 'normal',
    budget: 300000,
    budgetRange: { min: 200000, max: 300000 },
    startDate: addDays(new Date(), 3).toISOString().split('T')[0],
    endDate: addDays(new Date(), 18).toISOString().split('T')[0],
    cities: ['Bangalore', 'Mumbai'],
    mediaTypes: ['digital'],
    objective: 'Product launch campaign',
    notes: 'Focus on high-traffic areas',
    attachments: [],
    status: 'on_hold',
    advertiserId: 'user-advertiser-1',
    createdAt: addDays(new Date(), -1).toISOString(),
    expiresAt: addHours(addDays(new Date(), -1), 48).toISOString(),
    proposalCount: 1,
  },
  {
    id: generateRFPId(),
    campaignName: 'Winter Sale Promo',
    type: 'screenwise',
    budget: 0,
    startDate: addDays(new Date(), 5).toISOString().split('T')[0],
    endDate: addDays(new Date(), 20).toISOString().split('T')[0],
    cities: [],
    mediaTypes: [],
    notes: 'Selected specific screens for targeted reach',
    attachments: [],
    status: 'confirmed',
    advertiserId: 'user-advertiser-1',
    createdAt: addDays(new Date(), -2).toISOString(),
    expiresAt: addHours(addDays(new Date(), -2), 48).toISOString(),
    proposalCount: 1,
    selectedScreens: ['screen-1', 'screen-3'],
  },
];

// Sample proposals
export const sampleProposals: Proposal[] = [
  {
    id: generateProposalId(),
    rfpId: sampleRFPs[0].id,
    ownerId: 'user-owner-1',
    screens: [
      {
        screenId: 'screen-1',
        screenName: 'Digital LED Indiranagar',
        price: 16000,
        rationale: 'High footfall location, perfect for brand awareness',
      },
      {
        screenId: 'screen-2',
        screenName: 'Static Hoarding Koramangala',
        price: 50000,
        rationale: 'Premium location with excellent visibility',
      },
    ],
    totalAmount: 66000,
    rationale: 'Our screens offer excellent visibility and reach in premium Bangalore locations',
    description: 'We have strategically placed screens in high-traffic areas that will maximize your campaign impact',
    attachments: [],
    status: 'pending',
    submittedAt: addDays(new Date(), -1).toISOString(),
    advertiserId: 'user-advertiser-1',
  },
  {
    id: generateProposalId(),
    rfpId: sampleRFPs[0].id,
    ownerId: 'user-owner-2',
    screens: [
      {
        screenId: 'screen-3',
        screenName: 'UB City Digital Screen',
        price: 20000,
        rationale: 'Premium mall location with affluent audience',
      },
      {
        screenId: 'screen-4',
        screenName: 'Phoenix Mall Digital',
        price: 13500,
        rationale: 'High footfall mall in IT corridor',
      },
    ],
    totalAmount: 33500,
    rationale: 'Mall locations provide captive audience and premium brand association',
    description: 'Our mall screens offer excellent brand visibility with engaged audiences',
    attachments: [],
    status: 'pending',
    submittedAt: addDays(new Date(), -1).toISOString(),
    advertiserId: 'user-advertiser-1',
  },
  {
    id: generateProposalId(),
    rfpId: sampleRFPs[1].id,
    ownerId: 'user-owner-1',
    screens: [
      {
        screenId: 'screen-1',
        screenName: 'Digital LED Indiranagar',
        price: 16000,
        rationale: 'Perfect for digital campaigns',
      },
    ],
    totalAmount: 16000,
    rationale: 'High-impact digital screen for maximum visibility',
    description: 'Our digital screen offers dynamic content capabilities',
    attachments: [],
    status: 'hold_requested',
    submittedAt: addDays(new Date(), -1).toISOString(),
    advertiserId: 'user-advertiser-1',
  },
];

// Sample holds
export const sampleHolds: Hold[] = [
  {
    id: generateHoldId(),
    proposalId: sampleProposals[2].id,
    advertiserId: 'user-advertiser-1',
    ownerId: 'user-owner-1',
    amount: 5000,
    status: 'approved',
    requestedAt: addDays(new Date(), -1).toISOString(),
    expiresAt: addHours(addDays(new Date(), -1), 6).toISOString(),
    approvedAt: addHours(addDays(new Date(), -1), 2).toISOString(),
    holdExpiresAt: addHours(addDays(new Date(), -1), 50).toISOString(),
    screens: ['screen-1'],
  },
];

// Sample campaigns
export const sampleCampaigns: Campaign[] = [
  {
    id: generateCampaignId(),
    rfpId: sampleRFPs[2].id,
    proposalId: sampleProposals[0].id,
    advertiserId: 'user-advertiser-1',
    ownerId: 'user-owner-1',
    name: 'Winter Sale Promo',
    screens: ['screen-1', 'screen-3'],
    startDate: addDays(new Date(), 5).toISOString().split('T')[0],
    endDate: addDays(new Date(), 20).toISOString().split('T')[0],
    totalAmount: 33500,
    advanceAmount: 10050, // 30%
    status: 'live',
    createdAt: addDays(new Date(), -2).toISOString(),
    creatives: ['creative1.jpg', 'creative2.jpg'],
    po: 'PO123456.pdf',
    proofOfPlay: ['proof1.jpg', 'proof2.jpg'],
    approvedAt: addDays(new Date(), -1).toISOString(),
  },
];

// Sample notifications
export const sampleNotifications: Notification[] = [
  {
    id: generateId(),
    userId: 'user-advertiser-1',
    type: 'proposal_received',
    title: 'New Proposal Received',
    message: 'You have received a new proposal for "Festive Launch 2024"',
    read: false,
    createdAt: addDays(new Date(), -1).toISOString(),
  },
  {
    id: generateId(),
    userId: 'user-advertiser-1',
    type: 'hold_approved',
    title: 'Hold Approved',
    message: 'Your hold request for Diwali Campaign has been approved',
    read: false,
    createdAt: addDays(new Date(), -1).toISOString(),
  },
  {
    id: generateId(),
    userId: 'user-owner-1',
    type: 'hold_request',
    title: 'Hold Request Received',
    message: 'You have received a hold request for Diwali Campaign',
    read: true,
    createdAt: addDays(new Date(), -1).toISOString(),
  },
];

// Sample support tickets
export const sampleSupportTickets: SupportTicket[] = [
  {
    id: generateTicketId(),
    userId: 'user-advertiser-1',
    subject: 'Payment not reflecting',
    category: 'payment',
    status: 'open',
    agentId: 'agent-1',
    createdAt: addDays(new Date(), -1).toISOString(),
    messages: [
      {
        id: generateId(),
        ticketId: '',
        senderId: 'user-advertiser-1',
        senderType: 'user',
        message: 'I made a payment but it\'s not showing in my wallet',
        createdAt: addDays(new Date(), -1).toISOString(),
      },
      {
        id: generateId(),
        ticketId: '',
        senderId: 'agent-1',
        senderType: 'agent',
        message: 'We are looking into this issue. Please provide your transaction ID.',
        createdAt: addDays(new Date(), -1).toISOString(),
      },
    ],
  },
];

// Sample chat messages
export const sampleChatMessages: ChatMessage[] = [
  {
    id: generateId(),
    rfpId: sampleRFPs[0].id,
    senderId: 'user-advertiser-1',
    senderType: 'advertiser',
    message: 'Hi, I\'m interested in your proposal. Can you tell me more about the screen locations?',
    createdAt: addDays(new Date(), -1).toISOString(),
    read: true,
  },
  {
    id: generateId(),
    rfpId: sampleRFPs[0].id,
    senderId: 'user-owner-1',
    senderType: 'owner',
    message: 'Sure! Our screens are located in high-traffic areas with excellent visibility.',
    createdAt: addDays(new Date(), -1).toISOString(),
    read: true,
  },
];

// Function to seed all data
export const seedAllData = () => {
  // This function will be called to populate stores with sample data
  // It will be used in the main app initialization
  return {
    users: sampleUsers,
    screens: sampleScreens,
    rfps: sampleRFPs,
    proposals: sampleProposals,
    holds: sampleHolds,
    campaigns: sampleCampaigns,
    notifications: sampleNotifications,
    supportTickets: sampleSupportTickets,
    chatMessages: sampleChatMessages,
  };
};
