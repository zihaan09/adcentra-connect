import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Megaphone, Building2, TrendingUp, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

const Index = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'advertiser' | 'owner'>('advertiser');

  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated) {
    const { user } = useAuthStore.getState();
    navigate(user?.role === 'advertiser' ? '/advertiser' : '/owner');
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password, selectedRole);
    }
  };

  const handleQuickLogin = (role: 'advertiser' | 'owner') => {
    const demoCredentials = {
      advertiser: { email: 'advertiser@acme.com', password: 'demo123' },
      owner: { email: 'owner@metro.com', password: 'demo123' }
    };
    
    const credentials = demoCredentials[role];
    login(credentials.email, credentials.password, role);
  };

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
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="demo">Quick Demo</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={selectedRole === 'advertiser' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setSelectedRole('advertiser')}
                        >
                          <Megaphone className="mr-2 h-4 w-4" />
                          Advertiser
                        </Button>
                        <Button
                          type="button"
                          variant={selectedRole === 'owner' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setSelectedRole('owner')}
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          Media Owner
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary shadow-medium">
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demo" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div 
                  className="group p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all cursor-pointer border border-border hover:border-primary"
                  onClick={() => handleQuickLogin('advertiser')}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Megaphone className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Advertiser Demo</h2>
                  <p className="text-muted-foreground mb-6">
                    Experience the advertiser dashboard with sample RFPs, proposals, and campaigns
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <p><strong>Email:</strong> advertiser@acme.com</p>
                    <p><strong>Password:</strong> demo123</p>
                  </div>
                  <Button className="w-full bg-gradient-primary shadow-medium group-hover:shadow-lg transition-shadow">
                    Enter Advertiser Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div 
                  className="group p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all cursor-pointer border border-border hover:border-primary"
                  onClick={() => handleQuickLogin('owner')}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Media Owner Demo</h2>
                  <p className="text-muted-foreground mb-6">
                    Explore the media owner dashboard with inventory management and proposal tools
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <p><strong>Email:</strong> owner@metro.com</p>
                    <p><strong>Password:</strong> demo123</p>
                  </div>
                  <Button className="w-full bg-gradient-primary shadow-medium group-hover:shadow-lg transition-shadow">
                    Enter Owner Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
