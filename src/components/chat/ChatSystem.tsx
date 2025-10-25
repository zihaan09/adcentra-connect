import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Send, 
  User, 
  Building2, 
  Clock, 
  Paperclip,
  Smile,
  MoreVertical
} from 'lucide-react';
import { useChatStore, useAuthStore, useRFPStore, useProposalStore } from '@/store';
import { formatDateTime } from '@/lib/utils';
import { ChatMessage } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfpId: string;
  advertiserId: string;
  ownerId: string;
}

export function ChatModal({ isOpen, onClose, rfpId, advertiserId, ownerId }: ChatModalProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { messages, getMessagesByRFP, addMessage } = useChatStore();
  const { getRFPById } = useRFPStore();
  const { getProposalsByRFP } = useProposalStore();
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rfp = getRFPById(rfpId);
  const proposals = getProposalsByRFP(rfpId);
  const chatMessages = getMessagesByRFP(rfpId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    addMessage(rfpId, user.id, user.role === 'advertiser' ? 'advertiser' : 'owner', newMessage.trim());
    setNewMessage('');
    
    // Simulate other party typing
    setIsTyping(true);
    
    // Simulate auto-reply after delay (for demo purposes)
    setTimeout(() => {
      const replyerId = user.role === 'advertiser' ? ownerId : advertiserId;
      const replyerType = user.role === 'advertiser' ? 'owner' : 'advertiser';
      addMessage(rfpId, replyerId, replyerType as 'advertiser' | 'owner', getAutoReplyMessage(newMessage));
    }, 3000);
  };

  const getAutoReplyMessage = (originalMessage: string): string => {
    const replies = [
      "Thanks for the message! I'll review this and get back to you.",
      "That sounds good. Let me check the details and respond shortly.",
      "I understand. We can discuss this further.",
      "Great point! I'll look into this.",
      "Thanks for reaching out. I'll get back to you soon.",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSenderName = (senderId: string, senderType: string) => {
    if (senderId === user?.id) return 'You';
    return senderType === 'advertiser' ? 'Advertiser' : 'Media Owner';
  };

  const getSenderIcon = (senderType: string) => {
    return senderType === 'advertiser' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat - {rfp?.campaignName || 'RFP Discussion'}
          </DialogTitle>
          <DialogDescription>
            RFP ID: {rfpId} | Discuss proposal details and requirements
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* RFP Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{rfp?.campaignName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Budget: {rfp?.budgetRange ? `${rfp.budgetRange.min} - ${rfp.budgetRange.max}` : 'Not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Proposals: {proposals.length}</p>
                  <Badge variant="outline">{rfp?.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="flex-1">
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getSenderIcon(message.senderType)}
                            <span className="text-sm font-medium">
                              {getSenderName(message.senderId, message.senderType)}
                            </span>
                            <span className="text-xs opacity-70">
                              {formatDateTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Media Owner</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Paperclip className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Smile className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-primary"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ChatListProps {
  chats: Array<{
    rfpId: string;
    advertiserId: string;
    ownerId: string;
    lastMessage?: ChatMessage;
    unreadCount: number;
  }>;
  onOpenChat: (rfpId: string, advertiserId: string, ownerId: string) => void;
}

export function ChatList({ chats, onOpenChat }: ChatListProps) {
  const { getRFPById } = useRFPStore();
  const { getMessagesByRFP } = useChatStore();

  return (
    <div className="space-y-4">
      {chats.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4" />
          <p>No active conversations</p>
        </div>
      ) : (
        chats.map((chat) => {
          const rfp = getRFPById(chat.rfpId);
          const messages = getMessagesByRFP(chat.rfpId);
          
          return (
            <Card
              key={chat.rfpId}
              className="cursor-pointer hover:shadow-medium transition-shadow"
              onClick={() => onOpenChat(chat.rfpId, chat.advertiserId, chat.ownerId)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{rfp?.campaignName || 'Unknown Campaign'}</h4>
                      <Badge variant="outline">{rfp?.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      RFP ID: {chat.rfpId}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-sm mt-1 truncate">
                        {chat.lastMessage.message}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground mb-2">
                        {chat.unreadCount}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {chat.lastMessage ? formatDateTime(chat.lastMessage.timestamp) : 'No messages'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
