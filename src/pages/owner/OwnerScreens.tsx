import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Filter, Edit, Trash2, Upload, Monitor } from "lucide-react";
import { AddScreenModal, ScreenManagement } from "@/components/screens/ScreenManagement";
import { useScreenStore, useAuthStore } from "@/store";
import { Screen } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function OwnerScreens() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { screens, getScreensByOwner, deleteScreen } = useScreenStore();
  
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screen | undefined>(undefined);
  const [deletingScreenId, setDeletingScreenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "static" | "digital">("all");

  const userScreens = user ? getScreensByOwner(user.id) : [];
  
  const filteredScreens = userScreens.filter(screen => {
    if (activeTab === "static") return screen.type === "static";
    if (activeTab === "digital") return screen.type === "digital";
    return true;
  });

  const handleEditScreen = (screen: Screen) => {
    setEditingScreen(screen);
    setShowAddScreen(true);
  };

  const handleDeleteScreen = async (screenId: string) => {
    try {
      deleteScreen(screenId);
      toast({
        title: "Screen Deleted",
        description: "Screen has been removed from your inventory.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete screen. Please try again.",
        variant: "destructive",
      });
    }
    setDeletingScreenId(null);
  };

  const handleCloseAddScreen = () => {
    setShowAddScreen(false);
    setEditingScreen(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Screens</h1>
          <p className="text-muted-foreground mt-1">Manage your media inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Dialog open={showAddScreen} onOpenChange={setShowAddScreen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary shadow-medium">
                <Plus className="mr-2 h-4 w-4" />
                Add Screen
              </Button>
            </DialogTrigger>
            <AddScreenModal
              isOpen={showAddScreen}
              onClose={handleCloseAddScreen}
              screen={editingScreen}
            />
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Screens</p>
                <p className="text-2xl font-bold">{userScreens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-success rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-full" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {userScreens.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-warning rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-full" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold">
                  {userScreens.filter(s => s.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-full" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">
                  {userScreens.filter(s => s.status === 'inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Screen Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="all">All ({userScreens.length})</TabsTrigger>
                <TabsTrigger value="static">Static ({userScreens.filter(s => s.type === "static").length})</TabsTrigger>
                <TabsTrigger value="digital">Digital ({userScreens.filter(s => s.type === "digital").length})</TabsTrigger>
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
              <ScreenManagement
                screens={filteredScreens}
                onEdit={handleEditScreen}
                onDelete={setDeletingScreenId}
              />
            </TabsContent>

            <TabsContent value="static">
              <ScreenManagement
                screens={filteredScreens}
                onEdit={handleEditScreen}
                onDelete={setDeletingScreenId}
              />
            </TabsContent>

            <TabsContent value="digital">
              <ScreenManagement
                screens={filteredScreens}
                onEdit={handleEditScreen}
                onDelete={setDeletingScreenId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingScreenId} onOpenChange={() => setDeletingScreenId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Screen</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this screen? This action cannot be undone.
              All associated campaigns and proposals will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingScreenId && handleDeleteScreen(deletingScreenId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
