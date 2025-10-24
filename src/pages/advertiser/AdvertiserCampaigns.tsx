import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Upload, Eye, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdvertiserCampaigns() {
  const pendingCampaigns = [
    {
      id: "C001",
      name: "Festive Launch 2024",
      screens: 6,
      owner: "Metro Media",
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      budget: "₹12.5L",
      status: "Awaiting Creative",
    },
    {
      id: "C002",
      name: "Diwali Campaign",
      screens: 4,
      owner: "Prime Outdoor",
      startDate: "2024-10-28",
      endDate: "2024-11-10",
      budget: "₹8.2L",
      status: "Awaiting PO",
    },
  ];

  const liveCampaigns = [
    {
      id: "C003",
      name: "Winter Sale Promo",
      screens: 8,
      owner: "City Ads",
      startDate: "2024-10-15",
      endDate: "2024-11-15",
      budget: "₹15.8L",
      daysLeft: 12,
      proof: 24,
    },
    {
      id: "C004",
      name: "Brand Awareness Q4",
      screens: 12,
      owner: "Urban Media",
      startDate: "2024-10-01",
      endDate: "2024-12-31",
      budget: "₹42.5L",
      daysLeft: 58,
      proof: 156,
    },
  ];

  const completedCampaigns = [
    {
      id: "C005",
      name: "Summer Clearance",
      screens: 5,
      owner: "Metro Media",
      startDate: "2024-08-01",
      endDate: "2024-08-31",
      budget: "₹9.2L",
      proof: 155,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage your campaign lifecycle</p>
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
                    <TableHead>Screens</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.screens} screens</TableCell>
                      <TableCell>{campaign.owner}</TableCell>
                      <TableCell className="text-sm">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell className="font-semibold">{campaign.budget}</TableCell>
                      <TableCell>
                        <Badge className="bg-warning text-warning-foreground">{campaign.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="mr-2">
                          <Upload className="mr-1 h-3 w-3" />
                          Upload
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
                    <TableHead>Screens</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.screens} screens</TableCell>
                      <TableCell>{campaign.owner}</TableCell>
                      <TableCell className="text-sm">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell className="font-semibold">{campaign.budget}</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">{campaign.daysLeft} days</Badge>
                      </TableCell>
                      <TableCell>{campaign.proof} uploads</TableCell>
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

        <TabsContent value="completed" className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Screens</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.id}</TableCell>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{campaign.screens} screens</TableCell>
                      <TableCell>{campaign.owner}</TableCell>
                      <TableCell className="text-sm">
                        {campaign.startDate} to {campaign.endDate}
                      </TableCell>
                      <TableCell className="font-semibold">{campaign.budget}</TableCell>
                      <TableCell>{campaign.proof} uploads</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Report
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
