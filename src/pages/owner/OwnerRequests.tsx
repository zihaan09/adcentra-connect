import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function OwnerRequests() {
  const openRFPs = [
    {
      id: "RFP001",
      campaign: "Festive Launch 2024",
      advertiser: "Acme Corp",
      budget: "₹10L",
      screens: 5,
      cities: ["Bangalore", "Mumbai"],
      type: "Digital",
      expires: "18h Left",
      received: "2h ago",
    },
    {
      id: "RFP002",
      campaign: "Brand Awareness Q4",
      advertiser: "TechStart",
      budget: "₹25L",
      screens: 12,
      cities: ["Delhi", "Pune"],
      type: "Static",
      expires: "2d Left",
      received: "1d ago",
    },
  ];

  const submittedProposals = [
    {
      id: "P001",
      rfp: "RFP001",
      campaign: "Festive Launch 2024",
      screens: 6,
      amount: "₹12.5L",
      status: "Pending Review",
      submitted: "5h ago",
    },
    {
      id: "P002",
      rfp: "RFP003",
      campaign: "Diwali Campaign",
      screens: 4,
      amount: "₹8.2L",
      status: "Hold Requested",
      submitted: "1d ago",
    },
    {
      id: "P003",
      rfp: "RFP004",
      campaign: "Winter Sale",
      screens: 8,
      amount: "₹15.8L",
      status: "Accepted",
      submitted: "3d ago",
    },
  ];

  const statusColors = {
    "Pending Review": "bg-warning text-warning-foreground",
    "Hold Requested": "bg-primary text-primary-foreground",
    Accepted: "bg-success text-success-foreground",
    Rejected: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground mt-1">View RFPs and submit proposals</p>
        </div>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList>
          <TabsTrigger value="open">
            <FileText className="mr-2 h-4 w-4" />
            Open RFPs
            <Badge className="ml-2 bg-primary text-primary-foreground">{openRFPs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="submitted">
            <Clock className="mr-2 h-4 w-4" />
            Proposals Submitted
          </TabsTrigger>
          <TabsTrigger value="expired">
            <CheckCircle className="mr-2 h-4 w-4" />
            Expired RFPs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openRFPs.map((rfp) => (
            <Card key={rfp.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-muted-foreground">{rfp.id}</span>
                      <Badge className="bg-success text-success-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {rfp.expires}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold">{rfp.campaign}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Advertiser:</span>
                        <p className="font-medium">{rfp.advertiser}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <p className="font-medium">{rfp.budget}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Screens:</span>
                        <p className="font-medium">{rfp.screens} required</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{rfp.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {rfp.cities.map((city) => (
                        <Badge key={city} variant="outline">{city}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Received {rfp.received}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-primary shadow-medium">
                          Submit Proposal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-background">
                        <DialogHeader>
                          <DialogTitle>Submit Proposal for {rfp.campaign}</DialogTitle>
                          <DialogDescription>
                            Add screens and pricing to create your proposal
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Select Your Screens</Label>
                            <div className="p-3 border rounded-lg bg-muted/50 text-sm text-muted-foreground">
                              Screen selection interface would go here
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pricing">Pricing & Rationale</Label>
                            <Textarea
                              id="pricing"
                              placeholder="Explain your pricing and why your screens are suitable for this campaign"
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Save Draft</Button>
                            <Button className="bg-gradient-primary">Submit Proposal</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedProposals.map((proposal) => (
            <Card key={proposal.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-muted-foreground">{proposal.id}</span>
                      <Badge className={statusColors[proposal.status as keyof typeof statusColors]}>
                        {proposal.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold">{proposal.campaign}</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">RFP ID:</span>
                        <p className="font-medium">{proposal.rfp}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Screens:</span>
                        <p className="font-medium">{proposal.screens} proposed</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-medium">{proposal.amount}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Submitted {proposal.submitted}</p>
                  </div>
                  <Button variant="outline">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expired">
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No expired RFPs</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
