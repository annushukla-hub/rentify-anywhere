import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Heart, Calendar, Package, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  full_name: string;
  role: string;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    setProfile(data);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile.full_name}!
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-3xl font-bold text-primary">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{profile.full_name}</h2>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary-light text-primary rounded-full capitalize">
                    {profile.role.replace('_', ' ')}
                  </span>
                  {profile.verified && (
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Listings</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Active Bookings</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Package className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Your Listings</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Saved Items</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mt-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                    1
                  </div>
                  <p className="text-muted-foreground">Complete your profile information</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                    2
                  </div>
                  <p className="text-muted-foreground">Browse available rentals</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                    3
                  </div>
                  <p className="text-muted-foreground">Book your first rental</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Bookings</h3>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No bookings yet</p>
                <Button className="mt-4" onClick={() => navigate('/browse')}>
                  Browse Rentals
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Listings</h3>
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No listings yet</p>
                {(profile.role === 'owner' || profile.role === 'both') && (
                  <Button className="mt-4">Create Listing</Button>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Saved Favorites</h3>
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No favorites yet</p>
                <Button className="mt-4" onClick={() => navigate('/browse')}>
                  Explore Rentals
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <p className="text-muted-foreground capitalize">{profile.role.replace('_', ' ')}</p>
                </div>
                {profile.phone && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <p className="text-muted-foreground">{profile.phone}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
