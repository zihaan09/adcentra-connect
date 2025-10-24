import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-background">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-3xl font-bold">AdCentra</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Simplify Offline Media Booking
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Connect advertisers and media owners through a centralized, transparent marketplace for DOOH and offline media
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              className="group p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all cursor-pointer border border-border hover:border-primary"
              onClick={() => navigate('/advertiser')}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Megaphone className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">For Advertisers</h2>
              <p className="text-muted-foreground mb-6">
                Create RFPs, browse inventory, and manage campaigns effortlessly
              </p>
              <Button className="w-full bg-gradient-primary shadow-medium group-hover:shadow-lg transition-shadow">
                Enter Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div 
              className="group p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all cursor-pointer border border-border hover:border-primary"
              onClick={() => navigate('/owner')}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">For Media Owners</h2>
              <p className="text-muted-foreground mb-6">
                Respond to RFPs, manage inventory, and grow your revenue
              </p>
              <Button className="w-full bg-gradient-primary shadow-medium group-hover:shadow-lg transition-shadow">
                Enter Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Streamlined Process</h3>
            <p className="text-sm text-muted-foreground">From RFP to campaign launch in minutes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Transparent Marketplace</h3>
            <p className="text-sm text-muted-foreground">Clear pricing and inventory availability</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Unified Platform</h3>
            <p className="text-sm text-muted-foreground">Everything you need in one place</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
