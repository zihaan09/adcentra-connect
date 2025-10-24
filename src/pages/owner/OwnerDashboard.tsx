import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, Calendar, DollarSign, Plus } from "lucide-react";

export default function OwnerDashboard() {
  const stats = [
    { label: "Active RFPs", value: "8", change: "+3 new today", icon: FileText, color: "text-primary" },
    { label: "Proposals Sent", value: "15", change: "5 pending response", icon: TrendingUp, color: "text-warning" },
    { label: "Live Campaigns", value: "6", change: "Running this month", icon: Calendar, color: "text-success" },
    { label: "Revenue (MTD)", value: "₹8.2L", change: "+22% vs last month", icon: DollarSign, color: "text-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your media business overview</p>
        </div>
        <Button className="bg-gradient-primary shadow-medium">
          <Plus className="mr-2 h-4 w-4" />
          Add Screen
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

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Recent RFPs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div>
                  <p className="font-medium">Festive Campaign {i}</p>
                  <p className="text-sm text-muted-foreground">Budget: ₹{10 + i}L • 5 screens requested</p>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
