import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  TestTube,
  Users,
  Building2,
  MessageSquare,
  CreditCard,
  FileText,
  Settings
} from 'lucide-react';
import { useAuthStore, useRFPStore, useProposalStore, useHoldStore, useCampaignStore, useWalletStore, useNotificationStore, useChatStore, useSupportTicketStore } from '@/store';
import { useToast } from '@/components/ui/use-toast';

interface TestResult {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

export function IntegrationTestSuite() {
  const { toast } = useToast();
  const { user, login, logout } = useAuthStore();
  const { rfps, createRFP, getRFPsByAdvertiser } = useRFPStore();
  const { proposals, createProposal, getProposalsByRFP } = useProposalStore();
  const { holds, createHold, approveHold, rejectHold } = useHoldStore();
  const { campaigns, createCampaign, approveCampaign } = useCampaignStore();
  const { wallets, addFunds, deductFunds } = useWalletStore();
  const { notifications, addNotification } = useNotificationStore();
  const { messages, addMessage } = useChatStore();
  const { tickets, createTicket } = useSupportTicketStore();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const testSuites = [
    {
      id: 'auth',
      name: 'Authentication System',
      icon: <Users className="h-5 w-5" />,
      tests: [
        {
          id: 'login-advertiser',
          name: 'Login as Advertiser',
          description: 'Test advertiser login functionality',
          test: async () => {
            await login('advertiser@acme.com', 'demo123');
            if (!user || user.role !== 'advertiser') {
              throw new Error('Failed to login as advertiser');
            }
          }
        },
        {
          id: 'login-owner',
          name: 'Login as Media Owner',
          description: 'Test media owner login functionality',
          test: async () => {
            await login('owner@metro.com', 'demo123');
            if (!user || user.role !== 'owner') {
              throw new Error('Failed to login as media owner');
            }
          }
        },
        {
          id: 'logout',
          name: 'Logout Functionality',
          description: 'Test logout functionality',
          test: async () => {
            logout();
            if (user) {
              throw new Error('Failed to logout');
            }
          }
        }
      ]
    },
    {
      id: 'rfp',
      name: 'RFP Management',
      icon: <FileText className="h-5 w-5" />,
      tests: [
        {
          id: 'create-normal-rfp',
          name: 'Create Normal RFP',
          description: 'Test normal RFP creation',
          test: async () => {
            await login('advertiser@acme.com', 'demo123');
            const rfpData = {
              campaignName: 'Test Campaign',
              budgetRange: { min: 50000, max: 100000 },
              startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              cities: ['Mumbai', 'Delhi'],
              mediaTypes: ['billboard', 'digital_display'],
              objectives: ['brand_awareness'],
              targetAudience: 'General',
              brief: 'Test brief for integration testing',
              attachments: [],
              type: 'normal' as const,
              advertiserId: user?.id || '',
            };
            createRFP(rfpData);
            const userRFPs = getRFPsByAdvertiser(user?.id || '');
            if (userRFPs.length === 0) {
              throw new Error('RFP not created successfully');
            }
          }
        },
        {
          id: 'create-screenwise-rfp',
          name: 'Create Screenwise RFP',
          description: 'Test screenwise RFP creation',
          test: async () => {
            const rfpData = {
              campaignName: 'Test Screenwise Campaign',
              budgetRange: { min: 30000, max: 50000 },
              startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              cities: ['Bangalore'],
              mediaTypes: ['led'],
              objectives: ['sales'],
              targetAudience: 'Tech Professionals',
              brief: 'Test screenwise brief',
              attachments: [],
              type: 'screenwise' as const,
              advertiserId: user?.id || '',
              selectedScreens: ['SCRN001', 'SCRN002'],
            };
            createRFP(rfpData);
            const userRFPs = getRFPsByAdvertiser(user?.id || '');
            if (userRFPs.length < 2) {
              throw new Error('Screenwise RFP not created successfully');
            }
          }
        }
      ]
    },
    {
      id: 'proposal',
      name: 'Proposal System',
      icon: <Building2 className="h-5 w-5" />,
      tests: [
        {
          id: 'create-proposal',
          name: 'Create Proposal',
          description: 'Test proposal creation by media owner',
          test: async () => {
            await login('owner@metro.com', 'demo123');
            const rfp = rfps.find(r => r.status === 'open');
            if (!rfp) {
              throw new Error('No open RFP found for testing');
            }
            const proposalData = {
              rfpId: rfp.id,
              ownerId: user?.id || '',
              advertiserId: rfp.advertiserId,
              campaignName: rfp.campaignName,
              screens: [
                { screenId: 'SCRN001', price: 15000 },
                { screenId: 'SCRN002', price: 20000 }
              ],
              totalAmount: 35000,
              description: 'Test proposal for integration testing',
            };
            createProposal(proposalData);
            const rfpProposals = getProposalsByRFP(rfp.id);
            if (rfpProposals.length === 0) {
              throw new Error('Proposal not created successfully');
            }
          }
        }
      ]
    },
    {
      id: 'hold',
      name: 'Hold System',
      icon: <CreditCard className="h-5 w-5" />,
      tests: [
        {
          id: 'create-hold',
          name: 'Create Hold Request',
          description: 'Test hold request creation',
          test: async () => {
            await login('advertiser@acme.com', 'demo123');
            const proposal = proposals.find(p => p.status === 'pending');
            if (!proposal) {
              throw new Error('No pending proposal found for testing');
            }
            const holdData = {
              rfpId: proposal.rfpId,
              proposalId: proposal.id,
              advertiserId: proposal.advertiserId,
              ownerId: proposal.ownerId,
              screenIds: proposal.screens.map(s => s.screenId),
              amount: 5000,
              requestedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            };
            createHold(holdData);
            if (holds.length === 0) {
              throw new Error('Hold not created successfully');
            }
          }
        },
        {
          id: 'approve-hold',
          name: 'Approve Hold',
          description: 'Test hold approval by media owner',
          test: async () => {
            await login('owner@metro.com', 'demo123');
            const hold = holds.find(h => h.status === 'pending');
            if (!hold) {
              throw new Error('No pending hold found for testing');
            }
            approveHold(hold.id);
            const updatedHold = holds.find(h => h.id === hold.id);
            if (!updatedHold || updatedHold.status !== 'approved') {
              throw new Error('Hold not approved successfully');
            }
          }
        }
      ]
    },
    {
      id: 'campaign',
      name: 'Campaign Management',
      icon: <Play className="h-5 w-5" />,
      tests: [
        {
          id: 'create-campaign',
          name: 'Create Campaign',
          description: 'Test campaign creation after advance payment',
          test: async () => {
            await login('advertiser@acme.com', 'demo123');
            const approvedHold = holds.find(h => h.status === 'approved');
            if (!approvedHold) {
              throw new Error('No approved hold found for testing');
            }
            const campaignData = {
              rfpId: approvedHold.rfpId,
              advertiserId: approvedHold.advertiserId,
              ownerId: approvedHold.ownerId,
              campaignName: 'Test Campaign',
              screens: approvedHold.screenIds.map(id => ({ screenId: id, price: 15000 })),
              budget: 30000,
              startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'draft' as const,
              creatives: [],
              proofOfPlay: [],
            };
            createCampaign(campaignData);
            if (campaigns.length === 0) {
              throw new Error('Campaign not created successfully');
            }
          }
        },
        {
          id: 'approve-campaign',
          name: 'Approve Campaign',
          description: 'Test campaign approval',
          test: async () => {
            const campaign = campaigns.find(c => c.status === 'draft');
            if (!campaign) {
              throw new Error('No draft campaign found for testing');
            }
            approveCampaign(campaign.id);
            const updatedCampaign = campaigns.find(c => c.id === campaign.id);
            if (!updatedCampaign || updatedCampaign.status !== 'live') {
              throw new Error('Campaign not approved successfully');
            }
          }
        }
      ]
    },
    {
      id: 'wallet',
      name: 'Wallet System',
      icon: <CreditCard className="h-5 w-5" />,
      tests: [
        {
          id: 'add-funds',
          name: 'Add Funds',
          description: 'Test wallet fund addition',
          test: async () => {
            await login('advertiser@acme.com', 'demo123');
            const initialBalance = wallets.find(w => w.userId === user?.id)?.balance || 0;
            addFunds(user?.id || '', 10000, 'Test fund addition');
            const updatedWallet = wallets.find(w => w.userId === user?.id);
            if (!updatedWallet || updatedWallet.balance !== initialBalance + 10000) {
              throw new Error('Funds not added successfully');
            }
          }
        },
        {
          id: 'deduct-funds',
          name: 'Deduct Funds',
          description: 'Test wallet fund deduction',
          test: async () => {
            const wallet = wallets.find(w => w.userId === user?.id);
            if (!wallet) {
              throw new Error('No wallet found for testing');
            }
            const initialBalance = wallet.balance;
            deductFunds(user?.id || '', 5000, 'Test fund deduction');
            const updatedWallet = wallets.find(w => w.userId === user?.id);
            if (!updatedWallet || updatedWallet.balance !== initialBalance - 5000) {
              throw new Error('Funds not deducted successfully');
            }
          }
        }
      ]
    },
    {
      id: 'notifications',
      name: 'Notification System',
      icon: <MessageSquare className="h-5 w-5" />,
      tests: [
        {
          id: 'create-notification',
          name: 'Create Notification',
          description: 'Test notification creation',
          test: async () => {
            const initialCount = notifications.length;
            addNotification({
              userId: user?.id || '',
              type: 'proposal_update',
              title: 'Test Notification',
              message: 'This is a test notification for integration testing',
              read: false,
            });
            if (notifications.length !== initialCount + 1) {
              throw new Error('Notification not created successfully');
            }
          }
        }
      ]
    },
    {
      id: 'chat',
      name: 'Chat System',
      icon: <MessageSquare className="h-5 w-5" />,
      tests: [
        {
          id: 'send-message',
          name: 'Send Chat Message',
          description: 'Test chat message sending',
          test: async () => {
            const rfp = rfps.find(r => r.status === 'open');
            if (!rfp) {
              throw new Error('No RFP found for chat testing');
            }
            const initialCount = messages.length;
            addMessage(rfp.id, user?.id || '', 'advertiser', 'Test chat message');
            if (messages.length !== initialCount + 1) {
              throw new Error('Chat message not sent successfully');
            }
          }
        }
      ]
    },
    {
      id: 'support',
      name: 'Support System',
      icon: <Settings className="h-5 w-5" />,
      tests: [
        {
          id: 'create-ticket',
          name: 'Create Support Ticket',
          description: 'Test support ticket creation',
          test: async () => {
            const initialCount = tickets.length;
            const ticketData = {
              userId: user?.id || '',
              subject: 'Test Support Ticket',
              category: 'technical',
              priority: 'medium' as const,
              status: 'open' as const,
              description: 'This is a test support ticket for integration testing',
              messages: [{
                id: 'MSG001',
                senderId: user?.id || '',
                senderType: 'user' as const,
                message: 'This is a test support ticket for integration testing',
                timestamp: new Date(),
              }],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            createTicket(ticketData);
            if (tickets.length !== initialCount + 1) {
              throw new Error('Support ticket not created successfully');
            }
          }
        }
      ]
    }
  ];

  const runTest = async (test: any) => {
    const startTime = Date.now();
    setCurrentTest(test.id);
    
    try {
      await test.test();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => prev.map(t => 
        t.id === test.id 
          ? { ...t, status: 'passed', duration }
          : t
      ));
      
      toast({
        title: "Test Passed",
        description: `${test.name} completed successfully`,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setTestResults(prev => prev.map(t => 
        t.id === test.id 
          ? { ...t, status: 'failed', duration, error: error instanceof Error ? error.message : String(error) }
          : t
      ));
      
      toast({
        title: "Test Failed",
        description: `${test.name} failed: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setCurrentTest(null);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    // Initialize all tests as pending
    const allTests = testSuites.flatMap(suite => 
      suite.tests.map(test => ({
        id: test.id,
        name: test.name,
        description: test.description,
        status: 'pending' as const,
      }))
    );
    
    setTestResults(allTests);
    
    // Run tests sequentially
    for (const suite of testSuites) {
      for (const test of suite.tests) {
        await runTest(test);
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsRunning(false);
    
    const passedTests = testResults.filter(t => t.status === 'passed').length;
    const totalTests = testResults.length;
    
    toast({
      title: "Test Suite Complete",
      description: `${passedTests}/${totalTests} tests passed`,
    });
  };

  const resetTests = () => {
    setTestResults([]);
    setCurrentTest(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'running': return <Clock className="h-4 w-4 text-primary animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-success text-success-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      case 'running': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integration Test Suite</h1>
          <p className="text-muted-foreground mt-1">Comprehensive testing of all Adcentra features</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-gradient-primary"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
          <Button
            onClick={resetTests}
            variant="outline"
            disabled={isRunning}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Test Summary */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{testResults.length}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {testResults.filter(t => t.status === 'passed').length}
                </div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-destructive">
                  {testResults.filter(t => t.status === 'failed').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">
                  {testResults.filter(t => t.status === 'running').length}
                </div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map(suite => (
          <Card key={suite.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {suite.icon}
                {suite.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suite.tests.map(test => {
                  const result = testResults.find(t => t.id === test.id);
                  const isRunning = currentTest === test.id;
                  
                  return (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result?.status || 'pending')}
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                          {result?.error && (
                            <Alert className="mt-2">
                              <XCircle className="h-4 w-4" />
                              <AlertDescription>{result.error}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result && (
                          <Badge className={getStatusColor(result.status)}>
                            {result.status.toUpperCase()}
                          </Badge>
                        )}
                        {result?.duration && (
                          <span className="text-sm text-muted-foreground">
                            {result.duration}ms
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runTest(test)}
                          disabled={isRunning || isRunning}
                        >
                          {isRunning ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
                              Running
                            </>
                          ) : (
                            'Run'
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
