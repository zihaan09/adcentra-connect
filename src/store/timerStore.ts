import { create } from 'zustand';
import { 
  useRFPStore, 
  useHoldStore, 
  useCampaignStore, 
  useNotificationStore,
  useWalletStore,
  useProposalStore
} from './index';
import { isExpired, isExpiringSoon, addDays } from '@/lib/utils';

class TimerService {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Check every 30 seconds for expiries and deadlines
    const mainTimer = setInterval(() => {
      this.checkRFPExpiries();
      this.checkHoldDeadlines();
      this.checkHoldExpiries();
      this.checkCampaignCompletions();
    }, 30000);
    
    this.timers.set('main', mainTimer);
    
    // Check every minute for warnings
    const warningTimer = setInterval(() => {
      this.checkHoldExpiryWarnings();
    }, 60000);
    
    this.timers.set('warnings', warningTimer);
  }

  stop() {
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
    this.isRunning = false;
  }

  private checkRFPExpiries() {
    const { rfps, expireRFP } = useRFPStore.getState();
    
    rfps.forEach(rfp => {
      if (rfp.status === 'open' && isExpired(rfp.expiresAt)) {
        expireRFP(rfp.id);
        
        // Notify advertiser
        useNotificationStore.getState().addNotification({
          userId: rfp.advertiserId,
          type: 'campaign_created',
          title: 'RFP Expired',
          message: `Your RFP "${rfp.campaignName}" has expired`,
          read: false,
        });
      }
    });
  }

  private checkHoldDeadlines() {
    const { holds, rejectHold } = useHoldStore.getState();
    
    holds.forEach(hold => {
      if (hold.status === 'pending' && isExpired(hold.expiresAt)) {
        rejectHold(hold.id);
        
        // Notify advertiser
        useNotificationStore.getState().addNotification({
          userId: hold.advertiserId,
          type: 'hold_rejected',
          title: 'Hold Auto-Rejected',
          message: 'Hold request was auto-rejected due to owner timeout',
          read: false,
        });
        
        // Notify owner
        useNotificationStore.getState().addNotification({
          userId: hold.ownerId,
          type: 'hold_rejected',
          title: 'Hold Auto-Rejected',
          message: 'Hold request was auto-rejected due to timeout',
          read: false,
        });
      }
    });
  }

  private checkHoldExpiries() {
    const { holds, expireHold } = useHoldStore.getState();
    
    holds.forEach(hold => {
      if (hold.status === 'approved' && hold.holdExpiresAt && isExpired(hold.holdExpiresAt)) {
        expireHold(hold.id);
        
        // Update RFP status back to open
        const proposal = useProposalStore.getState().proposals.find(p => p.id === hold.proposalId);
        if (proposal) {
          useRFPStore.getState().updateRFP(proposal.rfpId, { status: 'open' });
        }
        
        // Notify advertiser
        useNotificationStore.getState().addNotification({
          userId: hold.advertiserId,
          type: 'hold_rejected',
          title: 'Hold Expired',
          message: 'Your hold has expired and screens are now available',
          read: false,
        });
      }
    });
  }

  private checkHoldExpiryWarnings() {
    const { holds } = useHoldStore.getState();
    
    holds.forEach(hold => {
      if (hold.status === 'approved' && hold.holdExpiresAt && isExpiringSoon(hold.holdExpiresAt, 12)) {
        // Check if we already sent this warning
        const notifications = useNotificationStore.getState().notifications;
        const warningExists = notifications.some(n => 
          n.type === 'hold_expiring' && 
          n.data?.holdId === hold.id &&
          new Date(n.createdAt).getTime() > Date.now() - 60000 // Within last minute
        );
        
        if (!warningExists) {
          useNotificationStore.getState().addNotification({
            userId: hold.advertiserId,
            type: 'hold_expiring',
            title: 'Hold Expiring Soon',
            message: 'Your hold expires in less than 12 hours. Pay advance to secure screens.',
            read: false,
            data: { holdId: hold.id }
          });
        }
      }
    });
  }

  private checkCampaignCompletions() {
    const { campaigns, completeCampaign } = useCampaignStore.getState();
    
    campaigns.forEach(campaign => {
      if (campaign.status === 'live' && isExpired(campaign.endDate)) {
        completeCampaign(campaign.id);
        
        // Notify both parties
        useNotificationStore.getState().addNotification({
          userId: campaign.advertiserId,
          type: 'campaign_created',
          title: 'Campaign Completed',
          message: `Campaign "${campaign.name}" has completed`,
          read: false,
        });
        
        useNotificationStore.getState().addNotification({
          userId: campaign.ownerId,
          type: 'campaign_created',
          title: 'Campaign Completed',
          message: `Campaign "${campaign.name}" has completed`,
          read: false,
        });
      }
    });
  }

  // Manual timer controls
  startTimer(key: string, callback: () => void, interval: number) {
    this.stopTimer(key);
    const timer = setInterval(callback, interval);
    this.timers.set(key, timer);
  }

  stopTimer(key: string) {
    const timer = this.timers.get(key);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(key);
    }
  }

  clearAllTimers() {
    this.stop();
  }
}

// Create singleton instance
export const timerService = new TimerService();

// Don't auto-start timer service - let App component handle initialization
// if (typeof window !== 'undefined') {
//   timerService.start();
// }

// Timer Store for React components
interface TimerStore {
  timers: Map<string, NodeJS.Timeout>;
  startTimer: (key: string, callback: () => void, interval: number) => void;
  stopTimer: (key: string) => void;
  clearAllTimers: () => void;
}

export const useTimerStore = create<TimerStore>()((set, get) => ({
  timers: new Map(),
  
  startTimer: (key: string, callback: () => void, interval: number) => {
    timerService.startTimer(key, callback, interval);
    set(state => ({
      timers: new Map(state.timers.set(key, {} as NodeJS.Timeout))
    }));
  },
  
  stopTimer: (key: string) => {
    timerService.stopTimer(key);
    set(state => {
      const newTimers = new Map(state.timers);
      newTimers.delete(key);
      return { timers: newTimers };
    });
  },
  
  clearAllTimers: () => {
    timerService.clearAllTimers();
    set({ timers: new Map() });
  },
}));
