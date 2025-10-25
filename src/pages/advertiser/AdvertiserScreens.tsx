import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Grid3x3, Map, Plus, Search, Filter, Eye, Clock, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NormalRFPForm } from "@/components/rfp/NormalRFPForm";
import { ScreenwiseRFPForm } from "@/components/rfp/ScreenwiseRFPForm";
import { RFPDetailModal } from "@/components/rfp/RFPDetailModal";
import { RFPExpiryTimer } from "@/components/timers/CountdownTimer";
import { useRFPStore, useAuthStore } from "@/store";
import { getRFPStatusColor, formatCurrency, formatDate } from "@/lib/utils";

export default function AdvertiserScreens() {
  const [activeTab, setActiveTab] = useState<"rfps" | "screens">("rfps");
  const [showNormalRFP, setShowNormalRFP] = useState(false);
  const [showScreenwiseRFP, setShowScreenwiseRFP] = useState(false);
  const [showRFPDetail, setShowRFPDetail] = useState(false);
  const [selectedRFPId, setSelectedRFPId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const { rfps, getRFPsByAdvertiser } = useRFPStore();
  const { user } = useAuthStore();

  const userRFPs = user ? getRFPsByAdvertiser(user.id) : [];

  const filteredRFPs = userRFPs.filter(rfp => {
    const matchesSearch = rfp.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfp.status === statusFilter;
    const matchesCity = cityFilter === "all" || rfp.cities.includes(cityFilter);
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleRFPSuccess = () => {
    setShowNormalRFP(false);
    setShowScreenwiseRFP(false);
  };

  const handleViewRFP = (rfpId: string) => {
    setSelectedRFPId(rfpId);
    setShowRFPDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Screens</h1>
          <p className="text-muted-foreground mt-1">Manage RFPs and browse media inventory</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNormalRFP} onOpenChange={setShowNormalRFP}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Normal RFP
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <NormalRFPForm onSuccess={handleRFPSuccess} onCancel={() => setShowNormalRFP(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showScreenwiseRFP} onOpenChange={setShowScreenwiseRFP}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-medium">
                <Plus className="mr-2 h-4 w-4" />
                Create Screenwise RFP
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <ScreenwiseRFPForm onSuccess={handleRFPSuccess} onCancel={() => setShowScreenwiseRFP(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "rfps" | "screens")} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="rfps">
            <Clock className="mr-2 h-4 w-4" />
            My RFPs
            <Badge className="ml-2 bg-primary text-primary-foreground">{userRFPs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="screens">
            <Grid3x3 className="mr-2 h-4 w-4" />
            Browse Screens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rfps" className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>RFP Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by RFP name or ID..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RFP ID</TableHead>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Proposals</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRFPs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No RFPs found. Create your first RFP to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRFPs.map((rfp) => (
                        <TableRow key={rfp.id}>
                          <TableCell className="font-medium">{rfp.id}</TableCell>
                          <TableCell>{rfp.campaignName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {rfp.type === 'normal' ? 'Normal' : 'Screenwise'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {rfp.type === 'normal' 
                              ? formatCurrency(rfp.budgetRange?.max || 0)
                              : 'Auto-calculated'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge className={getRFPStatusColor(rfp.status)}>
                              {rfp.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{rfp.proposalCount}</Badge>
                          </TableCell>
                          <TableCell>
                            <RFPExpiryTimer rfpId={rfp.id} expiryDate={rfp.expiresAt} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewRFP(rfp.id)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </Button>
                              {rfp.status === 'open' && (
                                <Button size="sm" variant="outline">
                                  <X className="mr-1 h-3 w-3" />
                                  Close
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screens" className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder screens - will be replaced with real data from store */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-medium transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 relative">
                      <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                        Active
                      </Badge>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-purple-300" />
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">Sample Screen {i}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Sample Location
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">Digital</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Format:</span>
                          <p className="font-medium">Hoarding</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <p className="font-medium">12' x 8'</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Light:</span>
                          <p className="font-medium">LED</p>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground line-through">₹18,000</p>
                            <p className="text-lg font-bold text-primary">₹16,000</p>
                          </div>
                          <Button size="sm" className="bg-gradient-primary">Add to Cart</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* RFP Detail Modal */}
      <RFPDetailModal
        isOpen={showRFPDetail}
        onClose={() => {
          setShowRFPDetail(false);
          setSelectedRFPId("");
        }}
        rfpId={selectedRFPId}
      />
    </div>
  );
}
