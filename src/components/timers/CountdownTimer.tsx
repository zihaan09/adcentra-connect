import { useState, useEffect } from 'react';
import { getTimeRemaining, formatTimeRemaining } from '@/lib/utils';

interface CountdownTimerProps {
  expiryDate: string | Date;
  onExpire?: () => void;
  className?: string;
  showSeconds?: boolean;
}

export function CountdownTimer({ 
  expiryDate, 
  onExpire, 
  className = '',
  showSeconds = false 
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(expiryDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(expiryDate);
      setTimeRemaining(remaining);
      
      if (remaining.expired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate, onExpire]);

  if (timeRemaining.expired) {
    return (
      <span className={`text-destructive font-medium ${className}`}>
        Expired
      </span>
    );
  }

  const formatTime = () => {
    const { hours, minutes, seconds } = timeRemaining;
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    
    if (hours > 0) {
      return showSeconds ? `${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m`;
    }
    
    if (minutes > 0) {
      return showSeconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
    
    return showSeconds ? `${seconds}s` : '< 1m';
  };

  const getColorClass = () => {
    const { hours, minutes } = timeRemaining;
    
    if (hours < 1) return 'text-destructive';
    if (hours < 6) return 'text-warning';
    if (hours < 12) return 'text-orange-500';
    return 'text-success';
  };

  return (
    <span className={`font-medium ${getColorClass()} ${className}`}>
      {formatTime()}
    </span>
  );
}

interface RFPExpiryTimerProps {
  rfpId: string;
  expiryDate: string | Date;
  className?: string;
}

export function RFPExpiryTimer({ rfpId, expiryDate, className }: RFPExpiryTimerProps) {
  const handleExpire = () => {
    // RFP expiry is handled by the timer service
    console.log(`RFP ${rfpId} expired`);
  };

  return (
    <CountdownTimer
      expiryDate={expiryDate}
      onExpire={handleExpire}
      className={className}
    />
  );
}

interface HoldDeadlineTimerProps {
  holdId: string;
  expiryDate: string | Date;
  className?: string;
}

export function HoldDeadlineTimer({ holdId, expiryDate, className }: HoldDeadlineTimerProps) {
  const handleExpire = () => {
    // Hold deadline expiry is handled by the timer service
    console.log(`Hold ${holdId} deadline expired`);
  };

  return (
    <CountdownTimer
      expiryDate={expiryDate}
      onExpire={handleExpire}
      className={className}
      showSeconds={true}
    />
  );
}

interface HoldExpiryTimerProps {
  holdId: string;
  expiryDate: string | Date;
  className?: string;
}

export function HoldExpiryTimer({ holdId, expiryDate, className }: HoldExpiryTimerProps) {
  const handleExpire = () => {
    // Hold expiry is handled by the timer service
    console.log(`Hold ${holdId} expired`);
  };

  return (
    <CountdownTimer
      expiryDate={expiryDate}
      onExpire={handleExpire}
      className={className}
    />
  );
}

interface CampaignDaysLeftProps {
  endDate: string | Date;
  className?: string;
}

export function CampaignDaysLeft({ endDate, className }: CampaignDaysLeftProps) {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const now = new Date();
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
      const diff = end.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, days));
    };

    calculateDaysLeft();
    const timer = setInterval(calculateDaysLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [endDate]);

  const getColorClass = () => {
    if (daysLeft <= 0) return 'text-destructive';
    if (daysLeft <= 3) return 'text-warning';
    if (daysLeft <= 7) return 'text-orange-500';
    return 'text-success';
  };

  return (
    <span className={`font-medium ${getColorClass()} ${className}`}>
      {daysLeft === 0 ? 'Completed' : `${daysLeft} days left`}
    </span>
  );
}
