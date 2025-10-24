import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Grid3x3, Map, Plus, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdvertiserScreens() {
  const [view, setView] = useState<"grid" | "map">("grid");

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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "UB City Digital Screen",
      location: "UB City Mall Vittal Mallya Road",
      type: "Digital",
      environment: "Indoor",
      format: "Signage",
      size: "10' x 6'",
      illumination: "LED",
      baseRate: "₹22,000.00/Slot",
      discounted: "₹20,000.00/Slot",
      status: "Active",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Screens</h1>
          <p className="text-muted-foreground mt-1">Discover and book media inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Normal RFP
          </Button>
          <Button className="bg-gradient-primary shadow-medium">
            <Plus className="mr-2 h-4 w-4" />
            Create Screenwise RFP
          </Button>
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by location, media type..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Media Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="static">Static</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "map")} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">
                <Grid3x3 className="mr-2 h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map className="mr-2 h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {screens.map((screen) => (
                  <Card key={screen.id} className="overflow-hidden hover:shadow-medium transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 relative">
                      <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                        {screen.status}
                      </Badge>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-purple-300" />
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{screen.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {screen.location}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">{screen.type}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Format:</span>
                          <p className="font-medium">{screen.format}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <p className="font-medium">{screen.size}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Light:</span>
                          <p className="font-medium">{screen.illumination}</p>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground line-through">{screen.baseRate}</p>
                            <p className="text-lg font-bold text-primary">{screen.discounted}</p>
                          </div>
                          <Button size="sm" className="bg-gradient-primary">Add to Cart</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map">
              <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Map className="h-12 w-12 mx-auto mb-2" />
                  <p>Map view coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
