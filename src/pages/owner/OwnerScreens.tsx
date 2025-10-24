import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OwnerScreens() {
  const screens = [
    {
      id: 1,
      name: "Digital LED Indiranagar",
      location: "100 Feet Road Indiranagar",
      type: "Digital",
      environment: "Outdoor",
      format: "Hoarding",
      size: "12' x 8'",
      illumination: "LED",
      baseRate: "₹18,000.00/Slot",
      discounted: "₹16,000.00/Slot",
      status: "Active",
    },
    {
      id: 2,
      name: "Static Hoarding Koramangala",
      location: "Koramangala 5th Block Main Road",
      type: "Static",
      environment: "Outdoor",
      format: "Hoarding",
      size: "20' x 12'",
      illumination: "Back lit",
      baseRate: "₹55,000.00/Month",
      discounted: "₹50,000.00/Month",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Screens</h1>
          <p className="text-muted-foreground mt-1">Manage your media inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Plus className="mr-2 h-4 w-4" />
            Add Screen
          </Button>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="static">Static</TabsTrigger>
                <TabsTrigger value="digital">Digital</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search screens..." className="pl-10 w-[300px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Media Type</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Illumination</TableHead>
                      <TableHead>Base Rate</TableHead>
                      <TableHead>Discounted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screens.map((screen) => (
                      <TableRow key={screen.id}>
                        <TableCell>
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg" />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{screen.name}</p>
                            <p className="text-sm text-muted-foreground">{screen.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>{screen.type}</TableCell>
                        <TableCell>{screen.environment}</TableCell>
                        <TableCell>{screen.format}</TableCell>
                        <TableCell>{screen.size}</TableCell>
                        <TableCell>
                          <Badge className="bg-success text-success-foreground">{screen.status}</Badge>
                        </TableCell>
                        <TableCell>{screen.illumination}</TableCell>
                        <TableCell className="font-medium">{screen.baseRate}</TableCell>
                        <TableCell className="font-medium text-primary">{screen.discounted}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="static">
              <p className="text-center text-muted-foreground py-8">Static screens will appear here</p>
            </TabsContent>

            <TabsContent value="digital">
              <p className="text-center text-muted-foreground py-8">Digital screens will appear here</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
