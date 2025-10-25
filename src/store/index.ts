import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  RFP, 
  Proposal, 
  Hold, 
  Campaign, 
  Screen, 
  Notification, 
  Wallet, 
  Transaction,
  SupportTicket,
  SupportMessage,
  ChatMessage,
  TeamMember,
  NormalRFPFormData,
  ScreenwiseRFPFormData,
  ProposalFormData,
  ScreenFormData
} from '@/types';
import { 
  generateId, 
  generateRFPId, 
  generateCampaignId, 
  generateProposalId, 
  generateHoldId, 
  generateTicketId,
  addHours,
  addDays,
  saveToStorage,
  loadFromStorage
} from '@/lib/utils';

// Auth Store
interface AuthStore {
  user: User | null;
  login: (email: string, password: string, role: 'advertiser' | 'owner') => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (email: string, password: string, role: 'advertiser' | 'owner') => {
        const user: User = {
          id: generateId(),
          email,
          name: email.split('@')[0],
          role,
          companyName: role === 'advertiser' ? 'Acme Corporation' : 'Metro Media',
          createdAt: new Date().toISOString(),
        };
        
        set({ user, isAuthenticated: true });
      },
      
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// RFP Store
interface RFPStore {
  rfps: RFP[];
  createRFP: (data: NormalRFPFormData | ScreenwiseRFPFormData, advertiserId: string) => void;
  updateRFP: (id: string, updates: Partial<RFP>) => void;
  getRFPById: (id: string) => RFP | undefined;
  getRFPsByAdvertiser: (advertiserId: string) => RFP[];
  getOpenRFPs: () => RFP[];
  expireRFP: (id: string) => void;
  incrementProposalCount: (rfpId: string) => void;
}

export const useRFPStore = create<RFPStore>()(
  persist(
    (set, get) => ({
      rfps: [],
      
      createRFP: (data: NormalRFPFormData | ScreenwiseRFPFormData, advertiserId: string) => {
        const isScreenwise = 'selectedScreens' in data;
        const expiresAt = addHours(new Date(), 48).toISOString();
        
        const rfp: RFP = {
          id: generateRFPId(),
          campaignName: data.campaignName,
          type: isScreenwise ? 'screenwise' : 'normal',
          budget: isScreenwise ? 0 : data.budgetRange.max,
          budgetRange: isScreenwise ? undefined : data.budgetRange,
          dates: { start: data.startDate, end: data.endDate },
          startDate: data.startDate,
          endDate: data.endDate,
          cities: isScreenwise ? [] : data.cities,
          mediaTypes: isScreenwise ? [] : data.mediaTypes,
          objective: isScreenwise ? undefined : data.objective,
          notes: data.notes,
          attachments: [],
          status: 'open',
          advertiserId,
          createdAt: new Date().toISOString(),
          expiresAt,
          proposalCount: 0,
          selectedScreens: isScreenwise ? data.selectedScreens : undefined,
        };
        
        set(state => ({ rfps: state.rfps.concat([rfp]) }));
      },
      
      updateRFP: (id: string, updates: Partial<RFP>) => {
        set(state => ({
          rfps: state.rfps.map(rfp => 
            rfp.id === id ? Object.assign({}, rfp, updates) : rfp
          )
        }));
      },
      
      getRFPById: (id: string) => {
        return get().rfps.find(rfp => rfp.id === id);
      },
      
      getRFPsByAdvertiser: (advertiserId: string) => {
        return get().rfps.filter(rfp => rfp.advertiserId === advertiserId);
      },
      
      getOpenRFPs: () => {
        return get().rfps.filter(rfp => rfp.status === 'open');
      },
      
      expireRFP: (id: string) => {
        set(state => ({
          rfps: state.rfps.map(rfp => 
            rfp.id === id ? Object.assign({}, rfp, { status: 'expired' as const }) : rfp
          )
        }));
      },
      
      incrementProposalCount: (rfpId: string) => {
        set(state => ({
          rfps: state.rfps.map(rfp => 
            rfp.id === rfpId ? Object.assign({}, rfp, { proposalCount: rfp.proposalCount + 1 }) : rfp
          )
        }));
      },
    }),
    {
      name: 'rfp-storage',
    }
  )
);

// Proposal Store
interface ProposalStore {
  proposals: Proposal[];
  createProposal: (data: ProposalFormData, rfpId: string, ownerId: string, advertiserId: string, campaignName: string) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  getProposalsByRFP: (rfpId: string) => Proposal[];
  getProposalsByOwner: (ownerId: string) => Proposal[];
}

export const useProposalStore = create<ProposalStore>()(
  persist(
    (set, get) => ({
      proposals: [],
      
      createProposal: (data: ProposalFormData, rfpId: string, ownerId: string, advertiserId: string, campaignName: string) => {
        const totalAmt = data.screens.reduce((sum, screen) => sum + screen.price, 0);
        const proposal: Proposal = {
          id: generateProposalId(),
          rfpId,
          campaignName,
          ownerId,
          screens: data.screens,
          amount: totalAmt,
          totalAmount: totalAmt,
          rationale: data.rationale,
          description: data.description,
          attachments: [],
          status: 'pending',
          submittedAt: new Date().toISOString(),
          advertiserId,
        };
        
        set(state => ({ proposals: state.proposals.concat([proposal]) }));
        
        // Increment proposal count in RFP
        useRFPStore.getState().incrementProposalCount(rfpId);
      },
      
      updateProposal: (id: string, updates: Partial<Proposal>) => {
        set(state => ({
          proposals: state.proposals.map(proposal => 
            proposal.id === id ? Object.assign({}, proposal, updates) : proposal
          )
        }));
      },
      
      getProposalsByRFP: (rfpId: string) => {
        return get().proposals.filter(proposal => proposal.rfpId === rfpId);
      },
      
      getProposalsByOwner: (ownerId: string) => {
        return get().proposals.filter(proposal => proposal.ownerId === ownerId);
      },
    }),
    {
      name: 'proposal-storage',
    }
  )
);

// Hold Store
interface HoldStore {
  holds: Hold[];
  createHold: (proposalId: string, advertiserId: string, ownerId: string, screens: string[]) => void;
  approveHold: (holdId: string) => void;
  rejectHold: (holdId: string) => void;
  expireHold: (holdId: string) => void;
  getHoldByProposal: (proposalId: string) => Hold | undefined;
}

export const useHoldStore = create<HoldStore>()(
  persist(
    (set, get) => ({
      holds: [],
      
      createHold: (proposalId: string, advertiserId: string, ownerId: string, screens: string[]) => {
        const now = new Date();
        const expiresAt = addHours(now, 6).toISOString();
        
        const hold: Hold = {
          id: generateHoldId(),
          proposalId,
          advertiserId,
          ownerId,
          amount: 5000, // ₹5,000
          status: 'pending',
          requestedAt: now.toISOString(),
          expiresAt,
          screens,
        };
        
        set(state => ({ holds: [...state.holds, hold] }));
        
        // Update proposal status
        useProposalStore.getState().updateProposal(proposalId, { status: 'hold_requested' });
      },
      
      approveHold: (holdId: string) => {
        const now = new Date();
        const holdExpiresAt = addHours(now, 48).toISOString();
        
        set(state => ({
          holds: state.holds.map(hold => 
            hold.id === holdId 
              ? Object.assign({}, hold, {
                  status: 'approved' as const,
                  approvedAt: now.toISOString(),
                  holdExpiresAt
                }) 
              : hold
          )
        }));
        
        // Update RFP status
        const hold = get().holds.find(h => h.id === holdId);
        if (hold) {
          const proposal = useProposalStore.getState().proposals.find(p => p.id === hold.proposalId);
          if (proposal) {
            useRFPStore.getState().updateRFP(proposal.rfpId, { status: 'on_hold' });
          }
        }
      },
      
      rejectHold: (holdId: string) => {
        set(state => ({
          holds: state.holds.map(hold => 
            hold.id === holdId ? Object.assign({}, hold, { status: 'rejected' as const }) : hold
          )
        }));
        
        // Refund advertiser
        const hold = get().holds.find(h => h.id === holdId);
        if (hold) {
          useWalletStore.getState().addFunds(hold.advertiserId, hold.amount);
        }
      },
      
      expireHold: (holdId: string) => {
        set(state => ({
          holds: state.holds.map(hold => 
            hold.id === holdId ? Object.assign({}, hold, { status: 'expired' as const }) : hold
          )
        }));
        
        // Refund advertiser
        const hold = get().holds.find(h => h.id === holdId);
        if (hold) {
          useWalletStore.getState().addFunds(hold.advertiserId, hold.amount);
        }
      },
      
      getHoldByProposal: (proposalId: string) => {
        return get().holds.find(hold => hold.proposalId === proposalId);
      },
    }),
    {
      name: 'hold-storage',
    }
  )
);

// Campaign Store
interface CampaignStore {
  campaigns: Campaign[];
  createCampaign: (rfpId: string, proposalId: string, advertiserId: string, ownerId: string, advanceAmount: number) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  getCampaignsByAdvertiser: (advertiserId: string) => Campaign[];
  getCampaignsByOwner: (ownerId: string) => Campaign[];
  approveCampaign: (id: string) => void;
  completeCampaign: (id: string) => void;
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      
      createCampaign: (rfpId: string, proposalId: string, advertiserId: string, ownerId: string, advanceAmount: number) => {
        const rfp = useRFPStore.getState().getRFPById(rfpId);
        const proposal = useProposalStore.getState().proposals.find(p => p.id === proposalId);
        
        if (!rfp || !proposal) return;
        
        const campaign: Campaign = {
          id: generateCampaignId(),
          rfpId,
          proposalId,
          advertiserId,
          ownerId,
          campaignName: rfp.campaignName,
          name: rfp.campaignName,
          budget: proposal.totalAmount,
          screens: proposal.screens.map(s => ({
            screenId: s.screenId,
            screenName: s.screenName,
            price: s.price
          })),
          startDate: rfp.startDate,
          endDate: rfp.endDate,
          totalAmount: proposal.totalAmount,
          advanceAmount,
          balanceAmount: proposal.totalAmount - advanceAmount,
          status: 'draft',
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({ campaigns: [...state.campaigns, campaign] }));
        
        // Update RFP status
        useRFPStore.getState().updateRFP(rfpId, { status: 'confirmed' });
        
        // Update proposal status
        useProposalStore.getState().updateProposal(proposalId, { status: 'accepted' });
      },
      
      updateCampaign: (id: string, updates: Partial<Campaign>) => {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id ? Object.assign({}, campaign, updates) : campaign
          )
        }));
      },
      
      getCampaignsByAdvertiser: (advertiserId: string) => {
        return get().campaigns.filter(campaign => campaign.advertiserId === advertiserId);
      },
      
      getCampaignsByOwner: (ownerId: string) => {
        return get().campaigns.filter(campaign => campaign.ownerId === ownerId);
      },
      
      approveCampaign: (id: string) => {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id 
              ? Object.assign({}, campaign, {
                  status: 'live' as const,
                  approvedAt: new Date().toISOString()
                }) 
              : campaign
          )
        }));
      },
      
      completeCampaign: (id: string) => {
        set(state => ({
          campaigns: state.campaigns.map(campaign => 
            campaign.id === id 
              ? Object.assign({}, campaign, {
                  status: 'completed' as const,
                  completedAt: new Date().toISOString()
                }) 
              : campaign
          )
        }));
      },
    }),
    {
      name: 'campaign-storage',
    }
  )
);

// Screen Store
interface ScreenStore {
  screens: Screen[];
  addScreen: (data: ScreenFormData, ownerId: string) => void;
  createScreen: (data: ScreenFormData, ownerId: string) => void;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  deleteScreen: (id: string) => void;
  getScreenById: (id: string) => Screen | undefined;
  getScreensByOwner: (ownerId: string) => Screen[];
  getAvailableScreens: (city?: string, type?: string) => Screen[];
}

export const useScreenStore = create<ScreenStore>()(
  persist(
    (set, get) => ({
      screens: [],
      
      addScreen: (data: ScreenFormData, ownerId: string) => {
        const screen: Screen = {
          id: generateId(),
          name: data.name,
          location: data.location,
          city: data.city,
          type: data.type,
          environment: data.environment,
          format: data.format,
          size: data.size,
          illumination: data.illumination,
          baseRate: data.baseRate,
          discountedRate: data.discountedRate,
          pricePerDay: data.baseRate,
          status: 'active',
          ownerId,
          image: data.image ? URL.createObjectURL(data.image) : undefined,
          createdAt: new Date().toISOString(),
          availability: [],
        };
        
        set(state => ({ screens: [...state.screens, screen] }));
      },
      
      createScreen: (data: ScreenFormData, ownerId: string) => {
        const screen: Screen = {
          id: generateId(),
          name: data.name,
          location: data.location,
          city: data.city,
          type: data.type,
          environment: data.environment,
          format: data.format,
          size: data.size,
          illumination: data.illumination,
          baseRate: data.baseRate,
          discountedRate: data.discountedRate,
          pricePerDay: data.baseRate,
          status: 'active',
          ownerId,
          image: data.image ? URL.createObjectURL(data.image) : undefined,
          createdAt: new Date().toISOString(),
          availability: [],
        };
        
        set(state => ({ screens: [...state.screens, screen] }));
      },
      
      updateScreen: (id: string, updates: Partial<Screen>) => {
        set(state => ({
          screens: state.screens.map(screen => 
            screen.id === id ? Object.assign({}, screen, updates) : screen
          )
        }));
      },
      
      deleteScreen: (id: string) => {
        set(state => ({
          screens: state.screens.filter(screen => screen.id !== id)
        }));
      },
      
      getScreenById: (id: string) => {
        return get().screens.find(screen => screen.id === id);
      },
      
      getScreensByOwner: (ownerId: string) => {
        return get().screens.filter(screen => screen.ownerId === ownerId);
      },
      
      getAvailableScreens: (city?: string, type?: string) => {
        return get().screens.filter(screen => {
          if (screen.status !== 'active') return false;
          if (city && screen.city !== city) return false;
          if (type && screen.type !== type) return false;
          return true;
        });
      },
    }),
    {
      name: 'screen-storage',
    }
  )
);

// Notification Store
interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getNotificationsByUser: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
        const newNotification: Notification = Object.assign({}, notification, {
          id: generateId(),
          createdAt: new Date().toISOString(),
        });
        
        set(state => ({ notifications: state.notifications.concat([newNotification]) }));
      },
      
      markAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(notification => 
            notification.id === id ? Object.assign({}, notification, { read: true }) : notification
          )
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => 
            Object.assign({}, notification, { read: true })
          )
        }));
      },
      
      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      },
      
      getNotificationsByUser: (userId: string) => {
        return get().notifications
          .filter(notification => notification.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Wallet Store
interface WalletStore {
  wallets: Wallet[];
  getWalletByUser: (userId: string) => Wallet | undefined;
  addFunds: (userId: string, amount: number) => void;
  deductFunds: (userId: string, amount: number, description: string, reference?: string) => boolean;
  getTransactionsByUser: (userId: string) => Transaction[];
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      wallets: [],
      
      getWalletByUser: (userId: string) => {
        let wallet = get().wallets.find(w => w.userId === userId);
        
        if (!wallet) {
          // Create wallet if it doesn't exist
          wallet = {
            id: generateId(),
            userId,
            balance: 100000, // Start with ₹1,00,000
            transactions: [],
          };
          
          set(state => ({ wallets: [...state.wallets, wallet!] }));
        }
        
        return wallet;
      },
      
      addFunds: (userId: string, amount: number) => {
        const wallet = get().getWalletByUser(userId);
        if (!wallet) return;
        
        const transaction: Transaction = {
          id: generateId(),
          type: 'credit',
          amount,
          description: 'Funds added',
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          wallets: state.wallets.map(w => 
            w.userId === userId 
              ? Object.assign({}, w, {
                  balance: w.balance + amount,
                  transactions: w.transactions.concat([transaction])
                }) 
              : w
          )
        }));
      },
      
      deductFunds: (userId: string, amount: number, description: string, reference?: string) => {
        const wallet = get().getWalletByUser(userId);
        if (!wallet || wallet.balance < amount) return false;
        
        const transaction: Transaction = {
          id: generateId(),
          type: 'debit',
          amount,
          description,
          createdAt: new Date().toISOString(),
          reference,
        };
        
        set(state => ({
          wallets: state.wallets.map(w => 
            w.userId === userId 
              ? Object.assign({}, w, {
                  balance: w.balance - amount,
                  transactions: w.transactions.concat([transaction])
                }) 
              : w
          )
        }));
        
        return true;
      },
      
      getTransactionsByUser: (userId: string) => {
        const wallet = get().getWalletByUser(userId);
        return wallet ? wallet.transactions : [];
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);

// Support Ticket Store
interface SupportTicketStore {
  tickets: SupportTicket[];
  createTicket: (userId: string, subject: string, category: string, message: string) => void;
  updateTicket: (id: string, updates: Partial<SupportTicket>) => void;
  addMessage: (ticketId: string, senderId: string, senderType: 'user' | 'agent', message: string) => void;
  getTicketsByUser: (userId: string) => SupportTicket[];
}

export const useSupportTicketStore = create<SupportTicketStore>()(
  persist(
    (set, get) => ({
      tickets: [],
      
      createTicket: (userId: string, subject: string, category: string, message: string) => {
        const ticket: SupportTicket = {
          id: generateTicketId(),
          userId,
          subject,
          category: category as any,
          status: 'open',
          createdAt: new Date().toISOString(),
          messages: [{
            id: generateId(),
            ticketId: '',
            senderId: userId,
            senderType: 'user',
            message,
            createdAt: new Date().toISOString(),
          }],
        };
        
        // Update message with correct ticket ID
        ticket.messages[0].ticketId = ticket.id;
        
        set(state => ({ tickets: [...state.tickets, ticket] }));
      },
      
      updateTicket: (id: string, updates: Partial<SupportTicket>) => {
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id === id ? Object.assign({}, ticket, updates) : ticket
          )
        }));
      },
      
      addMessage: (ticketId: string, senderId: string, senderType: 'user' | 'agent', message: string) => {
        const newMessage: SupportMessage = {
          id: generateId(),
          ticketId,
          senderId,
          senderType,
          message,
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id === ticketId 
              ? Object.assign({}, ticket, { messages: ticket.messages.concat([newMessage]) })
              : ticket
          )
        }));
      },
      
      getTicketsByUser: (userId: string) => {
        return get().tickets.filter(ticket => ticket.userId === userId);
      },
    }),
    {
      name: 'support-ticket-storage',
    }
  )
);

// Chat Store
interface ChatStore {
  messages: ChatMessage[];
  addMessage: (rfpId: string, senderId: string, senderType: 'advertiser' | 'owner', message: string) => void;
  getMessagesByRFP: (rfpId: string) => ChatMessage[];
  markAsRead: (rfpId: string, userId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      
      addMessage: (rfpId: string, senderId: string, senderType: 'advertiser' | 'owner', message: string) => {
        const chatMessage: ChatMessage = {
          id: generateId(),
          rfpId,
          senderId,
          senderType,
          message,
          createdAt: new Date().toISOString(),
          read: false,
        };
        
        set(state => ({ messages: [...state.messages, chatMessage] }));
      },
      
      getMessagesByRFP: (rfpId: string) => {
        return get().messages
          .filter(message => message.rfpId === rfpId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },
      
      markAsRead: (rfpId: string, userId: string) => {
        set(state => ({
          messages: state.messages.map(message => 
            message.rfpId === rfpId && message.senderId !== userId
              ? Object.assign({}, message, { read: true })
              : message
          )
        }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
