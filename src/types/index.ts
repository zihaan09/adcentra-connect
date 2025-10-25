// Core data models matching PRD requirements

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'advertiser' | 'owner';
  companyName: string;
  createdAt: string;
}

export interface RFP {
  id: string;
  campaignName: string;
  type: 'normal' | 'screenwise';
  budget: number;
  budgetRange?: { min: number; max: number };
  startDate: string;
  endDate: string;
  cities: string[];
  mediaTypes: string[];
  objective?: string;
  notes?: string;
  attachments?: string[];
  status: 'open' | 'on_hold' | 'confirmed' | 'expired';
  advertiserId: string;
  createdAt: string;
  expiresAt: string;
  proposalCount: number;
  selectedScreens?: string[]; // For screenwise RFPs
}

export interface Proposal {
  id: string;
  rfpId: string;
  ownerId: string;
  screens: ProposalScreen[];
  totalAmount: number;
  rationale: string;
  description: string;
  attachments?: string[];
  status: 'pending' | 'hold_requested' | 'accepted' | 'rejected';
  submittedAt: string;
  advertiserId: string;
}

export interface ProposalScreen {
  screenId: string;
  screenName: string;
  price: number;
  rationale: string;
}

export interface Hold {
  id: string;
  proposalId: string;
  advertiserId: string;
  ownerId: string;
  amount: number; // ₹5,000
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: string;
  expiresAt: string; // 6 hours from request
  approvedAt?: string;
  holdExpiresAt?: string; // 48 hours from approval
  screens: string[];
}

export interface Campaign {
  id: string;
  rfpId: string;
  proposalId: string;
  advertiserId: string;
  ownerId: string;
  name: string;
  screens: string[];
  startDate: string;
  endDate: string;
  totalAmount: number;
  advanceAmount: number;
  status: 'draft' | 'pending_approval' | 'live' | 'completed';
  createdAt: string;
  creatives?: string[];
  po?: string;
  proofOfPlay?: string[];
  approvedAt?: string;
  completedAt?: string;
}

export interface Screen {
  id: string;
  name: string;
  location: string;
  city: string;
  type: 'digital' | 'static';
  environment: 'outdoor' | 'indoor';
  format: string;
  size: string;
  illumination: string;
  baseRate: number;
  discountedRate: number;
  status: 'active' | 'booked' | 'maintenance';
  ownerId: string;
  image?: string;
  availability?: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  date: string;
  available: boolean;
  price?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'proposal_received' | 'hold_request' | 'hold_approved' | 'hold_rejected' | 'hold_expiring' | 'campaign_created' | 'payment' | 'support_reply';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any; // Additional context data
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
  reference?: string; // RFP ID, Campaign ID, etc.
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: 'payment' | 'booking' | 'technical' | 'other';
  status: 'open' | 'in_progress' | 'resolved';
  agentId?: string;
  createdAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'agent';
  message: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  rfpId: string;
  senderId: string;
  senderType: 'advertiser' | 'owner';
  message: string;
  createdAt: string;
  read: boolean;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'active' | 'invited';
  invitedAt: string;
}

// Form data interfaces
export interface NormalRFPFormData {
  campaignName: string;
  budgetRange: { min: number; max: number };
  startDate: string;
  endDate: string;
  cities: string[];
  mediaTypes: string[];
  objective?: string;
  notes?: string;
  attachments?: File[];
}

export interface ScreenwiseRFPFormData {
  campaignName: string;
  selectedScreens: string[];
  startDate: string;
  endDate: string;
  notes?: string;
  attachments?: File[];
}

export interface ProposalFormData {
  screens: ProposalScreen[];
  rationale: string;
  description: string;
  attachments?: File[];
}

export interface ScreenFormData {
  name: string;
  location: string;
  city: string;
  type: 'digital' | 'static';
  environment: 'outdoor' | 'indoor';
  format: string;
  size: string;
  illumination: string;
  baseRate: number;
  discountedRate: number;
  image?: File;
}

// Store state interfaces
export interface RFPStore {
  rfps: RFP[];
  createRFP: (data: NormalRFPFormData | ScreenwiseRFPFormData) => void;
  updateRFP: (id: string, updates: Partial<RFP>) => void;
  getRFPById: (id: string) => RFP | undefined;
  getRFPsByAdvertiser: (advertiserId: string) => RFP[];
  expireRFP: (id: string) => void;
}

export interface ProposalStore {
  proposals: Proposal[];
  createProposal: (data: ProposalFormData, rfpId: string, ownerId: string) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  getProposalsByRFP: (rfpId: string) => Proposal[];
  getProposalsByOwner: (ownerId: string) => Proposal[];
}

export interface HoldStore {
  holds: Hold[];
  createHold: (proposalId: string, advertiserId: string, ownerId: string, screens: string[]) => void;
  approveHold: (holdId: string) => void;
  rejectHold: (holdId: string) => void;
  expireHold: (holdId: string) => void;
  getHoldByProposal: (proposalId: string) => Hold | undefined;
}

export interface CampaignStore {
  campaigns: Campaign[];
  createCampaign: (rfpId: string, proposalId: string, advertiserId: string, ownerId: string, advanceAmount: number) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  getCampaignsByAdvertiser: (advertiserId: string) => Campaign[];
  getCampaignsByOwner: (ownerId: string) => Campaign[];
  approveCampaign: (id: string) => void;
  completeCampaign: (id: string) => void;
}

export interface ScreenStore {
  screens: Screen[];
  addScreen: (data: ScreenFormData, ownerId: string) => void;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  deleteScreen: (id: string) => void;
  getScreensByOwner: (ownerId: string) => Screen[];
  getAvailableScreens: (city?: string, type?: string) => Screen[];
}

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getNotificationsByUser: (userId: string) => Notification[];
}

export interface AuthStore {
  user: User | null;
  login: (email: string, password: string, role: 'advertiser' | 'owner') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface WalletStore {
  wallets: Wallet[];
  getWalletByUser: (userId: string) => Wallet | undefined;
  addFunds: (userId: string, amount: number) => void;
  deductFunds: (userId: string, amount: number, description: string, reference?: string) => boolean;
  getTransactionsByUser: (userId: string) => Transaction[];
}

export interface TimerStore {
  timers: Map<string, NodeJS.Timeout>;
  startTimer: (key: string, callback: () => void, interval: number) => void;
  stopTimer: (key: string) => void;
  clearAllTimers: () => void;
}
