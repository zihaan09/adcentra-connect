import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Clock, CheckCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdvertiserDashboard() {
  const stats = [
    { label: "Active Campaigns", value: "12", change: "+2 this week", icon: TrendingUp, color: "text-success" },
    { label: "Pending RFPs", value: "5", change: "3 expiring soon", icon: Clock, color: "text-warning" },
    { label: "Completed", value: "28", change: "This quarter", icon: CheckCircle, color: "text-primary" },
    { label: "Total Spend", value: "₹42.5L", change: "+18% vs last month", icon: FileText, color: "text-foreground" },
  ];

  const recentActivity = [
    { action: "Proposal received", rfp: "Festive Launch 2024", time: "2 hours ago", status: "new" },
    { action: "Hold approved", rfp: "Diwali Campaign", time: "5 hours ago", status: "success" },
    { action: "Campaign went live", rfp: "Winter Sale", time: "1 day ago", status: "live" },
    { action: "RFP expired", rfp: "Summer Promo", time: "2 days ago", status: "expired" },
  ];

  const statusColors = {
    new: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    live: "bg-accent text-accent-foreground",
    expired: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your campaign overview.</p>
        </div>
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="mr-2 h-4 w-4" />
          Create RFP
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start justify-between py-3 border-b last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.rfp}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create Normal RFP
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create Screenwise RFP
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              View All Campaigns
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Browse Screens
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
