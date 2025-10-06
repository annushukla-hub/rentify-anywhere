import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface Booking {
  id: string;
  listing_id: string;
  start_date: string;
  end_date: string | null;
  total_price: number;
  status: string;
  transaction_type: string;
  listings: {
    title: string;
    images: any;
  };
}

interface Listing {
  id: string;
  title: string;
  description: string;
  rent_price: number | null;
  buy_price: number | null;
  images: any;
  listing_type: string;
}

interface Favorite {
  id: string;
  listings: {
    id: string;
    title: string;
    rent_price: number | null;
    buy_price: number | null;
    images: any;
    listing_type: string;
  };
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadBookings();
      loadListings();
      loadFavorites();
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
    setEditedProfile(data);
  };

  const loadBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (
          title,
          images
        )
      `)
      .eq('renter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading bookings:', error);
      return;
    }

    setBookings(data || []);
  };

  const loadListings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading listings:', error);
      return;
    }

    setListings(data || []);
  };

  const loadFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        listings (
          id,
          title,
          rent_price,
          buy_price,
          images,
          listing_type
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading favorites:', error);
      return;
    }

    setFavorites(data || []);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        bio: editedProfile.bio,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
      return;
    }

    toast.success('Profile updated successfully');
    setProfile({ ...profile!, ...editedProfile });
    setEditMode(false);
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
                    <p className="text-2xl font-bold">{bookings.length}</p>
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
                    <p className="text-2xl font-bold">{listings.length}</p>
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
                    <p className="text-2xl font-bold">{favorites.length}</p>
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
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No bookings yet</p>
                  <Button className="mt-4" onClick={() => navigate('/browse')}>
                    Browse Rentals
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={booking.listings.images?.[0] || '/placeholder.svg'}
                          alt={booking.listings.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{booking.listings.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {booking.transaction_type}
                          </p>
                          {booking.transaction_type === 'rent' && (
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.start_date).toLocaleDateString()} - 
                              {booking.end_date && new Date(booking.end_date).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-1">
                            ${booking.total_price.toFixed(2)}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Listings</h3>
              {listings.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No listings yet</p>
                  {(profile.role === 'owner' || profile.role === 'both') && (
                    <Button className="mt-4">Create Listing</Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <Card key={listing.id} className="p-4">
                      <img
                        src={listing.images?.[0] || '/placeholder.svg'}
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold mb-1">{listing.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {listing.description}
                      </p>
                      <p className="text-primary font-semibold">
                        {listing.listing_type === 'rent' && listing.rent_price && `$${listing.rent_price}/day`}
                        {listing.listing_type === 'sell' && listing.buy_price && `$${listing.buy_price}`}
                        {listing.listing_type === 'both' && (
                          <>Rent: ${listing.rent_price}/day | Buy: ${listing.buy_price}</>
                        )}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Saved Favorites</h3>
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <Button className="mt-4" onClick={() => navigate('/browse')}>
                    Explore Rentals
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id} className="p-4">
                      <img
                        src={favorite.listings.images?.[0] || '/placeholder.svg'}
                        alt={favorite.listings.title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold mb-1">{favorite.listings.title}</h4>
                      <p className="text-primary font-semibold">
                        {favorite.listings.listing_type === 'rent' && favorite.listings.rent_price && `$${favorite.listings.rent_price}/day`}
                        {favorite.listings.listing_type === 'sell' && favorite.listings.buy_price && `$${favorite.listings.buy_price}`}
                        {favorite.listings.listing_type === 'both' && (
                          <>Rent: ${favorite.listings.rent_price}/day | Buy: ${favorite.listings.buy_price}</>
                        )}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => navigate(`/browse`)}
                      >
                        View Details
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Account Settings</h3>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  {editMode ? (
                    <Input
                      value={editedProfile.full_name || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.full_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <p className="text-muted-foreground capitalize">{profile.role.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  {editMode ? (
                    <Input
                      value={editedProfile.phone || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.phone || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio || 'No bio yet'}</p>
                  )}
                </div>
                {editMode && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleUpdateProfile} className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        setEditedProfile(profile);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
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
