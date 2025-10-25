import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Clock, CheckCircle, Eye, Search, Filter, MapPin, DollarSign, Calendar } from "lucide-react";
import { ProposalBuilderModal } from "@/components/proposal/ProposalBuilderModal";
import { useRFPStore, useProposalStore, useAuthStore } from "@/store";
import { formatCurrency, formatDate, formatDateTime, getRFPStatusColor, getProposalStatusColor } from "@/lib/utils";
import { RFPExpiryTimer } from "@/components/timers/CountdownTimer";
import { RFP, Proposal } from "@/types";

export default function OwnerRequests() {
  const { user } = useAuthStore();
  const { rfps, getOpenRFPs } = useRFPStore();
  const { proposals, getProposalsByOwner } = useProposalStore();
  
  const [showProposalBuilder, setShowProposalBuilder] = useState(false);
  const [selectedRFPId, setSelectedRFPId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const openRFPs = getOpenRFPs();
  const userProposals = user ? getProposalsByOwner(user.id) : [];

  const filteredRFPs = openRFPs.filter(rfp => {
    const matchesSearch = rfp.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === "all" || rfp.cities.includes(cityFilter);
    const matchesType = typeFilter === "all" || rfp.mediaTypes.includes(typeFilter);

    return matchesSearch && matchesCity && matchesType;
  });

  const handleSubmitProposal = (rfpId: string) => {
    setSelectedRFPId(rfpId);
    setShowProposalBuilder(true);
  };

  const handleCloseProposalBuilder = () => {
    setShowProposalBuilder(false);
    setSelectedRFPId("");
  };

  const cities = Array.from(new Set(openRFPs.flatMap(rfp => rfp.cities)));
  const mediaTypes = Array.from(new Set(openRFPs.flatMap(rfp => rfp.mediaTypes)));

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
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{userProposals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="expired">
            <CheckCircle className="mr-2 h-4 w-4" />
            Expired RFPs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search RFPs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  {mediaTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* RFPs List */}
          {filteredRFPs.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No open RFPs found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRFPs.map((rfp) => (
                <Card key={rfp.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-muted-foreground">{rfp.id}</span>
                          <Badge className={getRFPStatusColor(rfp.status)}>
                            {rfp.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <RFPExpiryTimer rfpId={rfp.id} expiryDate={rfp.expiresAt} />
                        </div>
                        <h3 className="text-xl font-semibold">{rfp.campaignName}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{rfp.type === 'normal' ? 'Brief-Based' : 'Screenwise'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span>
                            <p className="font-medium">
                              {rfp.budgetRange 
                                ? `${formatCurrency(rfp.budgetRange.min)} - ${formatCurrency(rfp.budgetRange.max)}`
                                : 'Not specified'
                              }
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Proposals:</span>
                            <p className="font-medium">{rfp.proposalCount} received</p>
                          </div>
                        <div>
                          <span className="text-muted-foreground">Campaign Dates:</span>
                          <p className="font-medium">
                            {formatDate(rfp.startDate)} to {formatDate(rfp.endDate)}
                          </p>
                        </div>
                        </div>
                        <div className="flex gap-2">
                          {rfp.cities.map((city) => (
                            <Badge key={city} variant="outline">{city}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {rfp.mediaTypes.map((type) => (
                            <Badge key={type} variant="secondary">{type}</Badge>
                          ))}
                        </div>
                        {rfp.objective && (
                          <div>
                            <span className="text-muted-foreground">Objective:</span>
                            <p className="text-sm">{rfp.objective}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created {formatDateTime(rfp.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="bg-gradient-primary shadow-medium"
                          onClick={() => handleSubmitProposal(rfp.id)}
                        >
                          Submit Proposal
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {userProposals.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No proposals submitted yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userProposals.map((proposal) => (
                <Card key={proposal.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-muted-foreground">{proposal.id}</span>
                          <Badge className={getProposalStatusColor(proposal.status)}>
                            {proposal.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold">{proposal.campaignName}</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">RFP ID:</span>
                            <p className="font-medium">{proposal.rfpId}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Screens:</span>
                            <p className="font-medium">{proposal.screens.length} proposed</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-medium">{formatCurrency(proposal.amount)}</p>
                          </div>
                        </div>
                        {proposal.description && (
                          <div>
                            <span className="text-muted-foreground">Description:</span>
                            <p className="text-sm">{proposal.description}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Submitted {formatDateTime(proposal.submittedAt)}
                        </p>
                      </div>
                      <Button variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

      {/* Proposal Builder Modal */}
      {selectedRFPId && (
        <ProposalBuilderModal
          isOpen={showProposalBuilder}
          onClose={handleCloseProposalBuilder}
          rfpId={selectedRFPId}
        />
      )}
    </div>
  );
}
