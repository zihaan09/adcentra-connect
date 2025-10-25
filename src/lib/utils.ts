// Utility functions for ID generation, date calculations, and data persistence
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const generateRFPId = (): string => {
  return `RFP${Date.now().toString().slice(-6)}`;
};

export const generateCampaignId = (): string => {
  return `C${Date.now().toString().slice(-6)}`;
};

export const generateProposalId = (): string => {
  return `P${Date.now().toString().slice(-6)}`;
};

export const generateHoldId = (): string => {
  return `H${Date.now().toString().slice(-6)}`;
};

export const generateTicketId = (): string => {
  return `T${Date.now().toString().slice(-6)}`;
};

// Date utilities
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeRemaining = (expiryDate: string | Date): { hours: number; minutes: number; seconds: number; expired: boolean } => {
  const now = new Date();
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, expired: false };
};

export const formatTimeRemaining = (expiryDate: string | Date): string => {
  const { hours, minutes, expired } = getTimeRemaining(expiryDate);
  
  if (expired) return 'Expired';
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

export const isExpired = (expiryDate: string | Date): boolean => {
  const now = new Date();
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  return expiry.getTime() <= now.getTime();
};

export const isExpiringSoon = (expiryDate: string | Date, hoursThreshold: number = 12): boolean => {
  const now = new Date();
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const diff = expiry.getTime() - now.getTime();
  const hoursRemaining = diff / (1000 * 60 * 60);
  return hoursRemaining <= hoursThreshold && hoursRemaining > 0;
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyDetailed = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Local storage utilities
export const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

export const isDocumentFile = (filename: string): boolean => {
  const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const extension = getFileExtension(filename).toLowerCase();
  return docExtensions.includes(extension);
};

// Status utilities
export const getRFPStatusColor = (status: string): string => {
  switch (status) {
    case 'open': return 'bg-success text-success-foreground';
    case 'on_hold': return 'bg-warning text-warning-foreground';
    case 'confirmed': return 'bg-primary text-primary-foreground';
    case 'expired': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const getProposalStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-warning text-warning-foreground';
    case 'hold_requested': return 'bg-primary text-primary-foreground';
    case 'accepted': return 'bg-success text-success-foreground';
    case 'rejected': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const getHoldStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-warning text-warning-foreground';
    case 'approved': return 'bg-success text-success-foreground';
    case 'rejected': return 'bg-destructive text-destructive-foreground';
    case 'expired': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const getCampaignStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return 'bg-muted text-muted-foreground';
    case 'pending_approval': return 'bg-warning text-warning-foreground';
    case 'live': return 'bg-success text-success-foreground';
    case 'completed': return 'bg-primary text-primary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = <T>(array: T[], filters: Partial<T>): T[] => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === '') return true;
      return item[key as keyof T] === value;
    });
  });
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};