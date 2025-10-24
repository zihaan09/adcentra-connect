import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Eye, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OwnerCampaigns() {
  const pendingCampaigns = [
    {
      id: "C001",
      name: "Festive Launch 2024",
      advertiser: "Acme Corp",
      screens: 6,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      amount: "₹12.5L",
      status: "Awaiting Creative",
    },
  ];

  const liveCampaigns = [
    {
      id: "C003",
      name: "Winter Sale Promo",
      advertiser: "TechStart",
      screens: 8,
      startDate: "2024-10-15",
      endDate: "2024-11-15",
      amount: "₹15.8L",
      daysLeft: 12,
      proof: 24,
    },
    {
      id: "C004",
      name: "Brand Awareness Q4",
      advertiser: "UrbanMart",
      screens: 12,
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      amount: "₹42.5L",
      daysLeft: 58,
      proof: 156,
    },
  ];

  const completedCampaigns = [
    {
      id: "C005",
      name: "Summer Clearance",
      advertiser: "FashionHub",
      screens: 5,
      startDate: "2024-08-01",
      endDate: "2024-08-31",
      amount: "₹9.2L",
      proof: 155,
      paid: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage your active bookings</p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Approvals
            <Badge className="ml-2 bg-warning text-warning-foreground">{pendingCampaigns.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="live">
            Live Campaigns
            <Badge className="ml-2 bg-success text-success-foreground">{liveCampaigns.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Screens</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.advertiser}</TableCell>
                      <TableCell>{campaign.screens} screens</TableCell>
                      <TableCell className="text-sm">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell className="font-semibold">{campaign.amount}</TableCell>
                      <TableCell>
                        <Badge className="bg-warning text-warning-foreground">{campaign.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 h-3 w-3" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Screens</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Proof Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.advertiser}</TableCell>
                      <TableCell>{campaign.screens} screens</TableCell>
                      <TableCell className="text-sm">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell className="font-semibold">{campaign.amount}</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">{campaign.daysLeft} days</Badge>
                      </TableCell>
                      <TableCell>{campaign.proof} uploads</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" className="bg-gradient-primary">
                          <Upload className="mr-1 h-3 w-3" />
                          Upload Proof
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Screens</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.advertiser}</TableCell>
                      <TableCell>{campaign.screens} screens</TableCell>
                      <TableCell className="text-sm">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell className="font-semibold">{campaign.amount}</TableCell>
                      <TableCell>{campaign.proof} uploads</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
